import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { drawDate } = await req.json();
    
    if (!drawDate) {
      throw new Error("Draw date is required");
    }

    console.log(`Processing draw completion for ${drawDate}`);

    // Get all active subscription entries for the completed draw
    const { data: subscriptionEntries, error: fetchError } = await supabaseClient
      .from('lottery_entries')
      .select('*')
      .eq('draw_date', drawDate)
      .not('stripe_subscription_id', 'is', null)
      .ilike('stripe_subscription_id', 'sub_%'); // Only subscription entries

    if (fetchError) throw fetchError;

    if (subscriptionEntries && subscriptionEntries.length > 0) {
      console.log(`Found ${subscriptionEntries.length} subscription entries to renew`);

      // Calculate next draw date (last day of next month)
      const nextDrawDate = new Date(drawDate);
      nextDrawDate.setMonth(nextDrawDate.getMonth() + 1);
      nextDrawDate.setDate(0); // Last day of next month

      // Create new entries for next draw for active subscriptions
      const newEntries = subscriptionEntries
        .filter(entry => entry.is_active)
        .map(entry => ({
          user_id: entry.user_id,
          numbers: entry.numbers,
          line_number: entry.line_number,
          is_active: true,
          stripe_subscription_id: entry.stripe_subscription_id,
          draw_date: nextDrawDate.toISOString().split('T')[0]
        }));

      if (newEntries.length > 0) {
        const { error: insertError } = await supabaseClient
          .from('lottery_entries')
          .insert(newEntries);

        if (insertError) throw insertError;

        console.log(`Created ${newEntries.length} new entries for next draw`);

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
          const userIds = [...new Set(newEntries.map(entry => entry.user_id))];
          
          // Get user emails
          const { data: { users } } = await supabaseClient.auth.admin.listUsers();
          
          for (const userId of userIds) {
            const user = users?.find(u => u.id === userId);
            const userEntries = newEntries.filter(entry => entry.user_id === userId);
            
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
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      processedEntries: subscriptionEntries?.length || 0,
      newEntriesCreated: subscriptionEntries?.filter(e => e.is_active).length || 0
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error processing draw completion:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});