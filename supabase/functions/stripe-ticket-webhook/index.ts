import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

// Stripe webhook — bulletproof "paid → email" trigger.
// Stripe POSTs here when a checkout session completes, regardless of whether
// the customer's browser ever returns to the success page.
//
// Setup: in Stripe Dashboard → Developers → Webhooks, add endpoint:
//   https://hmjwfnsygwzijjgrygia.supabase.co/functions/v1/stripe-ticket-webhook
// Subscribe to: checkout.session.completed
// Copy the signing secret into the STRIPE_TICKET_WEBHOOK_SECRET edge function secret.

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_TICKET_WEBHOOK_SECRET");
  if (!signature || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return new Response("Webhook not configured", { status: 400 });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Only act on completed checkout sessions where payment actually succeeded
  if (event.type !== "checkout.session.completed") {
    return new Response(JSON.stringify({ received: true, ignored: event.type }), { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.ticket_order_id;
  if (!orderId) {
    // Not a ticket session (could be lottery / shop) — ignore silently
    return new Response(JSON.stringify({ received: true, ignored: "no_ticket_order_id" }), { status: 200 });
  }

  if (session.payment_status !== "paid") {
    console.log(`Webhook for order ${orderId} but payment_status=${session.payment_status}`);
    return new Response(JSON.stringify({ received: true, paid: false }), { status: 200 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { data: existing } = await supabaseAdmin
    .from("ticket_orders").select("status").eq("id", orderId).single();

  if (existing?.status === "pending") {
    await supabaseAdmin.from("ticket_orders").update({
      status: "paid",
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
    }).eq("id", orderId);
  }

  // Idempotent: send fn checks status and won't double-send / double-create tickets
  if (existing?.status !== "fulfilled") {
    try {
      const notifyUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-ticket-confirmation`;
      await fetch(notifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({ orderId }),
      });
    } catch (e) {
      console.error("Failed to invoke send-ticket-confirmation:", e);
    }
  }

  return new Response(JSON.stringify({ received: true, orderId }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
});
