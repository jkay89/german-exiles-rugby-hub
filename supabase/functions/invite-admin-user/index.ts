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

    const { email } = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    // Validate email domain
    if (!email.endsWith('@germanexilesrl.co.uk')) {
      throw new Error('Only @germanexilesrl.co.uk emails can be invited as admins');
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(user => user.email === email);

    if (existingUser) {
      // User exists, just promote to admin
      const { error: promoteError } = await supabaseClient.rpc('promote_to_admin', {
        _user_email: email
      });

      if (promoteError) throw promoteError;

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Existing user ${email} has been promoted to admin` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new user with admin role
    const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    });

    if (createError) throw createError;

    // Add admin role to user_roles table
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: 'admin'
      });

    if (roleError) throw roleError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Admin user ${email} has been created and invited` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in invite-admin-user:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: (error as Error).message || 'Failed to invite admin user'
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