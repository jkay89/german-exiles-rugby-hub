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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { orderId } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: order } = await supabaseAdmin.from("ticket_orders").select("*").eq("id", orderId).single();
    if (!order) throw new Error("Order not found");

    const { data: items } = await supabaseAdmin
      .from("ticket_order_items").select("*").eq("order_id", orderId);

    const { data: fixture } = await supabaseAdmin
      .from("fixtures").select("opponent, team, date, time, location, competition")
      .eq("id", order.fixture_id).single();

    const matchLabel = fixture ? `${fixture.team} vs ${fixture.opponent}` : "Match";
    const dateLabel = fixture ? new Date(fixture.date).toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    }) : "";
    const timeLabel = fixture?.time || "";
    const venueLabel = fixture?.location || "";
    const competitionLabel = fixture?.competition || "";

    const shortId = order.id.slice(0, 8).toUpperCase();
    const totalTickets = (items || []).reduce((s: number, i: any) => s + i.quantity, 0);

    const itemsList = (items || []).map((i: any) =>
      `• ${TICKET_LABELS[i.ticket_type] || i.ticket_type} x${i.quantity} - £${(i.unit_price * i.quantity).toFixed(2)}`
    ).join("\n");

    const itemsHtml = (items || []).map((i: any) =>
      `<li>${TICKET_LABELS[i.ticket_type] || i.ticket_type} &times; ${i.quantity} — £${(i.unit_price * i.quantity).toFixed(2)}</li>`
    ).join("");

    const adminEmailBody = `
New Ticket Order!

Reference: ${shortId}
Match: ${matchLabel}${competitionLabel ? ` (${competitionLabel})` : ""}
Date: ${dateLabel}${timeLabel ? " · " + timeLabel : ""}
Venue: ${venueLabel}

Customer: ${order.customer_name}
Email: ${order.customer_email}

Tickets:
${itemsList}

Total tickets: ${totalTickets}
Total paid: £${order.total.toFixed(2)}
${order.notes ? "\nCustomer notes:\n" + order.notes : ""}
    `.trim();

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="color: #c8102e;">Your tickets are confirmed, ${order.customer_name}!</h2>
        <p>Thanks for booking. Show this email at the gate for entry.</p>

        <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0;">
          <p style="margin:0;font-size:18px;"><strong>${matchLabel}</strong></p>
          ${competitionLabel ? `<p style="margin:4px 0;color:#666;">${competitionLabel}</p>` : ""}
          <p style="margin:4px 0;">${dateLabel}${timeLabel ? " · " + timeLabel : ""}</p>
          ${venueLabel ? `<p style="margin:4px 0;">${venueLabel}</p>` : ""}
        </div>

        <p><strong>Booking reference:</strong> ${shortId}</p>
        <p><strong>Total tickets:</strong> ${totalTickets}</p>

        <h3>Your tickets</h3>
        <ul>${itemsHtml}</ul>

        <p><strong>Total paid:</strong> £${order.total.toFixed(2)}</p>

        <p>If you have any questions, just reply to this email.</p>
        <p>— German Exiles Rugby League</p>
      </div>
    `;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not set");

    const FROM = "German Exiles Tickets <noreply@germanexilesrl.co.uk>";
    const adminRecipients = ["jay@germanexilesrl.co.uk", "zak@germanexilesrl.co.uk"];

    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: FROM,
        to: adminRecipients,
        subject: `New Ticket Order ${shortId} - ${matchLabel} - ${totalTickets} ticket(s)`,
        text: adminEmailBody,
      }),
    });
    if (!adminRes.ok) console.error("Admin email error:", await adminRes.text());

    const custRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: FROM,
        to: [order.customer_email],
        subject: `Your tickets for ${matchLabel} - ${shortId}`,
        html: customerHtml,
      }),
    });
    if (!custRes.ok) console.error("Customer email error:", await custRes.text());

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("send-ticket-confirmation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
