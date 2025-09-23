import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    // Get request body
    const { priceId, quantity, lotteryLines, promoCode, originalAmount, discountedAmount } = await req.json();
    
    if (!priceId || !quantity || !lotteryLines) {
      throw new Error("Missing required parameters: priceId, quantity, lotteryLines");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create line items - use custom pricing if promo code is applied
    const lineItems = [];
    
    if (promoCode && discountedAmount !== undefined) {
      // Use custom pricing with discount
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: `Monthly Lottery Entry${quantity > 1 ? ` (${quantity} lines)` : ''}`,
            description: promoCode ? `Applied promo code: ${promoCode}` : undefined,
          },
          unit_amount: Math.round((discountedAmount * 100) / quantity), // Convert to pence and divide by quantity
          recurring: {
            interval: "month"
          }
        },
        quantity: quantity,
      });
    } else {
      // Use standard pricing
      lineItems.push({
        price: priceId,
        quantity: quantity,
      });
    }

    // Create a subscription checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/lottery/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/lottery?cancelled=true`,
      metadata: {
        user_id: user.id,
        lottery_lines: JSON.stringify(lotteryLines),
        entry_type: "subscription",
        promo_code: promoCode || "",
        original_amount: originalAmount?.toString() || "",
        discounted_amount: discountedAmount?.toString() || ""
      }
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});