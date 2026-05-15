import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TICKET_LABELS: Record<string, string> = {
  adult: "Adult",
  concession: "Concession",
  child: "Child",
  family: "Family (2 adults + 2 children)",
};

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await supabaseUser.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: isAdminData } = await supabaseAdmin.rpc("is_admin", { _user_id: userId });
    if (!isAdminData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { ticketId, fixtureId, action } = body;

    if (!ticketId || !isUuid(ticketId)) {
      return new Response(JSON.stringify({
        result: "invalid", message: "Not a valid ticket code",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: ticket } = await supabaseAdmin
      .from("tickets")
      .select("id, order_id, fixture_id, ticket_type, holder_name, is_used, used_at")
      .eq("id", ticketId)
      .maybeSingle();

    if (!ticket) {
      return new Response(JSON.stringify({
        result: "not_found", message: "Ticket not found in system",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Optionally enforce that the ticket is for the fixture currently being scanned
    if (fixtureId && ticket.fixture_id !== fixtureId) {
      const { data: fx } = await supabaseAdmin
        .from("fixtures").select("team, opponent, date")
        .eq("id", ticket.fixture_id).maybeSingle();
      return new Response(JSON.stringify({
        result: "wrong_fixture",
        message: "This ticket is for a different match",
        ticket: { ...ticket, ticket_label: TICKET_LABELS[ticket.ticket_type] || ticket.ticket_type },
        fixture: fx,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // "check" action just returns status without marking
    if (action === "check") {
      return new Response(JSON.stringify({
        result: ticket.is_used ? "already_used" : "valid",
        ticket: { ...ticket, ticket_label: TICKET_LABELS[ticket.ticket_type] || ticket.ticket_type },
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (ticket.is_used) {
      return new Response(JSON.stringify({
        result: "already_used",
        message: `Already scanned at ${new Date(ticket.used_at!).toLocaleTimeString("en-GB")}`,
        ticket: { ...ticket, ticket_label: TICKET_LABELS[ticket.ticket_type] || ticket.ticket_type },
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Atomic mark-used: only succeeds if still unused
    const { data: updated, error: updateErr } = await supabaseAdmin
      .from("tickets")
      .update({ is_used: true, used_at: new Date().toISOString(), scanned_by: userId })
      .eq("id", ticketId)
      .eq("is_used", false)
      .select("id, used_at")
      .maybeSingle();

    if (updateErr || !updated) {
      return new Response(JSON.stringify({
        result: "already_used",
        message: "Already scanned (race)",
        ticket: { ...ticket, ticket_label: TICKET_LABELS[ticket.ticket_type] || ticket.ticket_type },
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({
      result: "valid",
      message: "Admit one",
      ticket: {
        ...ticket,
        is_used: true,
        used_at: updated.used_at,
        ticket_label: TICKET_LABELS[ticket.ticket_type] || ticket.ticket_type,
      },
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    console.error("validate-ticket error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
