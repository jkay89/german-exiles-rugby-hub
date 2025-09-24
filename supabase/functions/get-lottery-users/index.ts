import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all unique user IDs from lottery entries and subscriptions
    const { data: lotteryUsers, error: lotteryError } = await supabaseClient
      .from('lottery_entries')
      .select('user_id')
      .eq('is_active', true);

    const { data: subscriptionUsers, error: subscriptionError } = await supabaseClient
      .from('lottery_subscriptions')  
      .select('user_id')
      .eq('status', 'active');

    if (lotteryError) {
      console.error('Error fetching lottery users:', lotteryError);
      throw lotteryError;
    }

    if (subscriptionError) {
      console.error('Error fetching subscription users:', subscriptionError);
      throw subscriptionError;
    }

    // Combine and get unique user IDs
    const allUserIds = new Set([
      ...(lotteryUsers?.map(u => u.user_id) || []),
      ...(subscriptionUsers?.map(u => u.user_id) || [])
    ]);

    console.log(`Found ${allUserIds.size} unique lottery users`);

    // Get user details from auth.users for each unique user ID
    const users = [];
    for (const userId of allUserIds) {
      try {
        const { data: user, error: userError } = await supabaseClient.auth.admin.getUserById(userId);
        
        if (userError) {
          console.error(`Error fetching user ${userId}:`, userError);
          continue;
        }

        if (user?.user) {
          // Get user's lottery entries count
          const { data: entriesData } = await supabaseClient
            .from('lottery_entries')
            .select('id')
            .eq('user_id', userId)
            .eq('is_active', true);

          // Get user's subscription status
          const { data: subscriptionData } = await supabaseClient
            .from('lottery_subscriptions')
            .select('status, created_at')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();

          users.push({
            id: user.user.id,
            email: user.user.email,
            created_at: user.user.created_at,
            last_sign_in_at: user.user.last_sign_in_at,
            entries_count: entriesData?.length || 0,
            has_subscription: !!subscriptionData,
            subscription_since: subscriptionData?.created_at || null
          });
        }
      } catch (error) {
        console.error(`Failed to fetch user ${userId}:`, error);
        continue;
      }
    }

    console.log(`Successfully fetched ${users.length} user details`);

    return new Response(
      JSON.stringify({ users }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in get-lottery-users:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch lottery users',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})