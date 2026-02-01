import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

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
    const { drawDate } = await req.json();
    
    if (!drawDate) {
      throw new Error("Draw date is required");
    }

    console.log(`Processing draw completion for ${drawDate}`);

    // Get ALL subscription entries for the completed draw (regardless of is_active status)
    // We validate with Stripe to determine if entries should be renewed
    const { data: subscriptionEntries, error: fetchError } = await supabaseClient
      .from('lottery_entries')
      .select('*')
      .eq('draw_date', drawDate)
      .not('stripe_subscription_id', 'is', null)
      .ilike('stripe_subscription_id', 'sub_%'); // Only subscription entries

    if (fetchError) throw fetchError;

    let validatedEntries = [];

    if (subscriptionEntries && subscriptionEntries.length > 0) {
      console.log(`Found ${subscriptionEntries.length} subscription entries to process`);

      // Initialize Stripe
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
        apiVersion: "2025-08-27.basil",
      });

      // Calculate next draw date (last day of next month)
      const nextDrawDate = new Date(drawDate);
      nextDrawDate.setMonth(nextDrawDate.getMonth() + 1);
      nextDrawDate.setDate(0); // Last day of next month

      // Group entries by subscription ID to avoid duplicate Stripe API calls
      const entriesBySubscription = new Map<string, typeof subscriptionEntries>();
      for (const entry of subscriptionEntries) {
        if (!entry.stripe_subscription_id) continue;
        
        const existing = entriesBySubscription.get(entry.stripe_subscription_id) || [];
        existing.push(entry);
        entriesBySubscription.set(entry.stripe_subscription_id, existing);
      }

      // Validate each subscription with Stripe FIRST, then decide what to do
      for (const [subscriptionId, entries] of entriesBySubscription) {
        try {
          // Check subscription status with Stripe - this is the source of truth
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          console.log(`Stripe subscription ${subscriptionId}: status=${subscription.status}, period_end=${new Date(subscription.current_period_end * 1000).toISOString()}`);
          
          // Only proceed if subscription is active and paid through
          if (subscription.status === 'active' && subscription.current_period_end * 1000 > Date.now()) {
            // Create new entries for next draw for all lines in this subscription
            for (const entry of entries) {
              validatedEntries.push({
                user_id: entry.user_id,
                numbers: entry.numbers,
                line_number: entry.line_number,
                is_active: true,
                stripe_subscription_id: subscriptionId,
                draw_date: nextDrawDate.toISOString().split('T')[0]
              });
            }
            console.log(`Validated active subscription ${subscriptionId} for user ${entries[0].user_id}, renewing ${entries.length} line(s)`);
          } else {
            console.log(`Subscription ${subscriptionId} is ${subscription.status}, not renewing entries`);
            
            // Deactivate all local lottery entries since subscription is not active
            for (const entry of entries) {
              await supabaseClient
                .from('lottery_entries')
                .update({ is_active: false })
                .eq('id', entry.id);
            }
          }
        } catch (stripeError) {
          console.error(`Error validating subscription ${subscriptionId}:`, stripeError);
          // If we can't validate with Stripe, don't create new entry to be safe
        }
      }

      if (validatedEntries.length > 0) {
        const { error: insertError } = await supabaseClient
          .from('lottery_entries')
          .insert(validatedEntries);

        if (insertError) throw insertError;

        console.log(`Created ${validatedEntries.length} new entries for next draw (validated with Stripe)`);

        // Send monthly reminder emails for renewed subscriptions
        try {
          // Get current jackpot for email
          const { data: jackpotData } = await supabaseClient
            .from('lottery_settings')
            .select('setting_value')
            .eq('setting_key', 'current_jackpot')
            .maybeSingle();
          
          const currentJackpot = jackpotData ? Number(jackpotData.setting_value) : 1000;

          // Get all unique user IDs from the renewed entries
          const userIds = [...new Set(validatedEntries.map(entry => entry.user_id))];
          
          // Get user emails
          const { data: { users } } = await supabaseClient.auth.admin.listUsers();
          
          for (const userId of userIds) {
            const user = users?.find(u => u.id === userId);
            const userEntries = validatedEntries.filter(entry => entry.user_id === userId);
            
            if (user?.email && userEntries.length > 0) {
              await supabaseClient.functions.invoke('send-lottery-subscription-email', {
                body: {
                  userEmail: user.email,
                  userName: user.user_metadata?.full_name || user.email?.split('@')[0],
                  numbers: userEntries[0].numbers,
                  drawDate: userEntries[0].draw_date,
                  jackpotAmount: currentJackpot,
                  lineNumber: userEntries[0].line_number,
                  emailType: 'monthly',
                  paymentAmount: 5 // Standard lottery price per line
                }
              });
              console.log(`Monthly reminder email sent to ${user.email}`);
            }
          }
        } catch (emailError) {
          console.error('Failed to send monthly emails:', emailError);
          // Don't fail the process if email fails
        }
      } else {
        console.log('No active subscriptions found to renew');
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      processedEntries: subscriptionEntries?.length || 0,
      newEntriesCreated: validatedEntries?.length || 0
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error processing draw completion:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: (error as Error).message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});