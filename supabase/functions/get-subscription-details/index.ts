import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    console.log('Getting subscription details for user:', user.email);

    // Get user's subscription from database
    const { data: subscriptionData, error: subscriptionError } = await supabaseClient
      .from('lottery_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      throw subscriptionError;
    }

    if (!subscriptionData) {
      return new Response(JSON.stringify({ 
        hasSubscription: false,
        message: 'No active subscription found'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get Stripe subscription details
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionData.stripe_subscription_id);
    
    // Calculate next payment date (1st of next month)
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1); 
    nextPaymentDate.setDate(1);
    nextPaymentDate.setHours(0, 0, 0, 0);

    // Get the price per line (from subscription items)
    const pricePerLine = stripeSubscription.items.data[0]?.price?.unit_amount || 500; // Default 500 pence = £5
    const totalAmount = (pricePerLine * subscriptionData.lines_count) / 100; // Convert pence to pounds

    const subscriptionDetails = {
      hasSubscription: true,
      status: stripeSubscription.status,
      linesCount: subscriptionData.lines_count,
      pricePerLine: pricePerLine / 100, // Convert to pounds
      totalAmount: totalAmount,
      currency: stripeSubscription.items.data[0]?.price?.currency || 'gbp',
      nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString().split('T')[0],
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      stripeSubscriptionId: subscriptionData.stripe_subscription_id,
      createdAt: subscriptionData.created_at
    };

    console.log('Subscription details retrieved:', subscriptionDetails);

    return new Response(JSON.stringify(subscriptionDetails), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error getting subscription details:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      hasSubscription: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});