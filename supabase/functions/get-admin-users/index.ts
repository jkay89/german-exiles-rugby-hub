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

    // Get ALL registered users for admin management
    const { data, error: allUsersError } = await supabaseClient.auth.admin.listUsers();
    
    if (allUsersError) {
      console.error('Error fetching all users:', allUsersError);
      throw allUsersError;
    }

    const allUsers = data?.users || [];
    console.log(`Found ${allUsers.length} total registered users`);

    // Filter users to only @germanexilesrl.co.uk emails
    const filteredUsers = allUsers.filter(user => 
      user.email && user.email.endsWith('@germanexilesrl.co.uk')
    );

    console.log(`Found ${filteredUsers.length} @germanexilesrl.co.uk users`);

    // Get user details with admin status
    const users = [];
    for (const authUser of filteredUsers) {
      try {
        // Check if user has admin role
        const { data: adminRoleData } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', authUser.id)
          .eq('role', 'admin')
          .maybeSingle();

        users.push({
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at,
          is_admin: !!adminRoleData,
          email_confirmed: !!authUser.email_confirmed_at
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
    console.error('Error in get-admin-users:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch admin users',
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