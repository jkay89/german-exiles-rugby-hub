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
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log(`Attempting to delete user: ${userId}`);

    // First, delete all related data (cascade should handle this, but being explicit)
    
    // Delete lottery entries
    const { error: entriesError } = await supabaseClient
      .from('lottery_entries')
      .delete()
      .eq('user_id', userId);

    if (entriesError) {
      console.error('Error deleting lottery entries:', entriesError);
    }

    // Delete lottery subscriptions
    const { error: subscriptionsError } = await supabaseClient
      .from('lottery_subscriptions')
      .delete()
      .eq('user_id', userId);

    if (subscriptionsError) {
      console.error('Error deleting lottery subscriptions:', subscriptionsError);
    }

    // Delete lottery results
    const { error: resultsError } = await supabaseClient
      .from('lottery_results')
      .delete()
      .eq('user_id', userId);

    if (resultsError) {
      console.error('Error deleting lottery results:', resultsError);
    }

    // Delete user roles
    const { error: rolesError } = await supabaseClient
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (rolesError) {
      console.error('Error deleting user roles:', rolesError);
    }

    // Finally, delete the user from auth
    const { error: deleteUserError } = await supabaseClient.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error('Error deleting user from auth:', deleteUserError);
      throw deleteUserError;
    }

    console.log(`Successfully deleted user: ${userId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User and all associated data deleted successfully' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in delete-lottery-user:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to delete user',
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