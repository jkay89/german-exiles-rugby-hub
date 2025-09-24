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

    // Get ALL registered users for admin dashboard
    const { data: { users: allUsers }, error: allUsersError } = await supabaseClient.auth.admin.listUsers();
    
    if (allUsersError) {
      console.error('Error fetching all users:', allUsersError);
      throw allUsersError;
    }

    console.log(`Found ${allUsers?.length || 0} total registered users`);

    // Get user details with lottery participation data
    const users = [];
    for (const authUser of allUsers || []) {
      try {
        // Get user's lottery entries count
        const { data: entriesData } = await supabaseClient
          .from('lottery_entries')
          .select('id')
          .eq('user_id', authUser.id)
          .eq('is_active', true);

        // Get user's subscription status
        const { data: subscriptionData } = await supabaseClient
          .from('lottery_subscriptions')
          .select('status, created_at')
          .eq('user_id', authUser.id)
          .eq('status', 'active')
          .maybeSingle();

        users.push({
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at,
          entries_count: entriesData?.length || 0,
          has_subscription: !!subscriptionData,
          subscription_since: subscriptionData?.created_at || null
        });
      } catch (error) {
        console.error(`Failed to process user ${authUser.id}:`, error);
        continue;
      }
    }

    console.log(`Successfully processed ${users.length} user details`);

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