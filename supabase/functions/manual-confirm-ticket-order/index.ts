import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const isUuid = (value: unknown) =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userError } = await supabaseUser.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin, error: roleError } = await supabaseUser.rpc("is_admin", {
      _user_id: userData.user.id,
    });
    if (roleError || isAdmin !== true) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { orderId } = await req.json();
    if (!isUuid(orderId)) {
      return new Response(JSON.stringify({ error: "Valid orderId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: order, error: orderError } = await supabaseAdmin
      .from("ticket_orders")
      .select("id, status")
      .eq("id", orderId)
      .single();
    if (orderError || !order) throw new Error("Order not found");

    if (order.status === "fulfilled") {
      return new Response(JSON.stringify({ success: true, alreadyFulfilled: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (order.status !== "paid") {
      const { error: updateError } = await supabaseAdmin
        .from("ticket_orders")
        .update({ status: "paid", updated_at: new Date().toISOString() })
        .eq("id", orderId);
      if (updateError) throw updateError;
    }

    const notifyUrl = `${supabaseUrl}/functions/v1/send-ticket-confirmation`;
    const notifyRes = await fetch(notifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ orderId }),
    });
    const notifyBody = await notifyRes.json().catch(() => ({}));
    if (!notifyRes.ok || notifyBody?.error) {
      throw new Error(notifyBody?.error || "Failed to send ticket confirmation");
    }

    return new Response(JSON.stringify({ success: true, ...notifyBody }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("manual-confirm-ticket-order error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});