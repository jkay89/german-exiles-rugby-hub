import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TICKET_LABELS: Record<string, string> = {
  adult: "Adult",
  concession: "Concession",
  child: "Child",
  family: "Family (2 adults + 2 children)",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fixtureId, customer, items, notes } = await req.json();

    if (!fixtureId || !customer?.email || !customer?.name || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Re-fetch authoritative prices from DB (don't trust client)
    const { data: fixture, error: fixtureError } = await supabaseAdmin
      .from("fixtures")
      .select("id, opponent, team, date, location, tickets_on_sale")
      .eq("id", fixtureId)
      .single();
    if (fixtureError || !fixture) throw new Error("Fixture not found");
    if (!fixture.tickets_on_sale) throw new Error("Tickets are not on sale for this fixture");

    const { data: ticketTypes, error: ticketsError } = await supabaseAdmin
      .from("fixture_tickets")
      .select("ticket_type, price, is_active")
      .eq("fixture_id", fixtureId);
    if (ticketsError) throw ticketsError;

    const priceMap = new Map<string, number>();
    (ticketTypes || []).forEach((t: any) => {
      if (t.is_active) priceMap.set(t.ticket_type, Number(t.price));
    });

    let subtotal = 0;
    const validatedItems = items
      .filter((i: any) => i.quantity > 0 && priceMap.has(i.ticketType))
      .map((i: any) => {
        const price = priceMap.get(i.ticketType)!;
        const qty = Math.min(20, Math.max(1, parseInt(i.quantity)));
        subtotal += price * qty;
        return { ticket_type: i.ticketType, quantity: qty, unit_price: price };
      });

    if (validatedItems.length === 0) throw new Error("No valid tickets selected");

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("ticket_orders")
      .insert({
        fixture_id: fixtureId,
        customer_name: customer.name,
        customer_email: customer.email,
        subtotal,
        total: subtotal,
        status: "pending",
        notes: notes || null,
      })
      .select()
      .single();
    if (orderError) throw orderError;

    await supabaseAdmin.from("ticket_order_items").insert(
      validatedItems.map((i) => ({ order_id: order.id, ...i }))
    );

    const matchLabel = `${fixture.team} vs ${fixture.opponent}`;
    const dateLabel = new Date(fixture.date).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });

    const lineItems = validatedItems.map((i) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: `${TICKET_LABELS[i.ticket_type] || i.ticket_type} - ${matchLabel}`,
          description: `${dateLabel}${fixture.location ? ` · ${fixture.location}` : ""}`,
        },
        unit_amount: Math.round(i.unit_price * 100),
      },
      quantity: i.quantity,
    }));

    const origin = req.headers.get("origin") || "https://germanexilesrl.co.uk";

    const session = await stripe.checkout.sessions.create({
      customer_email: customer.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/tickets/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/tickets/${fixtureId}`,
      metadata: { ticket_order_id: order.id },
    });

    await supabaseAdmin.from("ticket_orders").update({ stripe_session_id: session.id }).eq("id", order.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("create-ticket-payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
