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

  // Create Supabase client using the service role key for admin operations
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.id) throw new Error("User not authenticated");

    // Get request body
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Missing session ID");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session || session.payment_status !== 'paid') {
      throw new Error("Payment not completed or session not found");
    }

    // Check if entries already exist for this session
    const { data: existingEntries } = await supabaseClient
      .from('lottery_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('stripe_subscription_id', sessionId);

    if (existingEntries && existingEntries.length > 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Entries already processed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Extract lottery data from session metadata
    const metadata = session.metadata;
    if (!metadata?.lottery_lines) {
      throw new Error("No lottery lines found in session metadata");
    }

    const lotteryLines = JSON.parse(metadata.lottery_lines);
    const entryType = metadata.entry_type || 'one_time';
    const promoCode = metadata.promo_code || null;

    // Save lottery entries to database
    const entries = lotteryLines.map((numbers: number[], index: number) => ({
      user_id: user.id,
      numbers: numbers,
      line_number: index + 1,
      is_active: true,
      stripe_subscription_id: sessionId
    }));

    const { error: entriesError } = await supabaseClient
      .from('lottery_entries')
      .insert(entries);

    if (entriesError) throw entriesError;

    // If it's a subscription, also create/update subscription record
    if (entryType === 'subscription') {
      const { error: subscriptionError } = await supabaseClient
        .from('lottery_subscriptions')
        .upsert({
          user_id: user.id,
          lines_count: lotteryLines.length,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: sessionId,
          status: 'active'
        }, {
          onConflict: 'user_id'
        });

      if (subscriptionError) throw subscriptionError;
    }

    // If promo code was used, increment usage count
    if (promoCode) {
      const { error: promoError } = await supabaseClient
        .rpc('increment_promo_usage', { promo_name: promoCode });

      if (promoError) {
        console.error('Error updating promo code usage:', promoError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      entriesCreated: entries.length,
      entryType: entryType
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error processing lottery purchase:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});