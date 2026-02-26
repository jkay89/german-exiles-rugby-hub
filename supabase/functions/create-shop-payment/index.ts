import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, customer, shippingType, shippingCost, subtotal, total } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create order in database
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_email: customer.email,
        customer_name: customer.name,
        shipping_address_line1: customer.addressLine1,
        shipping_address_line2: customer.addressLine2 || null,
        shipping_city: customer.city,
        shipping_postcode: customer.postcode,
        shipping_country: customer.country,
        shipping_type: shippingType,
        shipping_cost: shippingCost,
        subtotal,
        total,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      size: item.size || null,
      quantity: item.quantity,
      unit_price: item.price,
    }));

    await supabaseAdmin.from("order_items").insert(orderItems);

    // Build Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name + (item.size ? ` (${item.size})` : ""),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: { name: `Shipping (${shippingType.replace("_", " ")})` },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const origin = req.headers.get("origin") || "https://germanexilesrl.co.uk";

    const session = await stripe.checkout.sessions.create({
      customer_email: customer.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/shop/success`,
      cancel_url: `${origin}/shop/cart`,
      metadata: {
        order_id: order.id,
      },
    });

    // Update order with stripe session id
    await supabaseAdmin.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);

    // Send order notification email
    try {
      const notifyUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-order-notification`;
      await fetch(notifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({ orderId: order.id }),
      });
    } catch (e) {
      console.error("Failed to send notification:", e);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
