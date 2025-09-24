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
    // Get request body with user IDs
    const { userIds } = await req.json();
    
    if (!userIds || !Array.isArray(userIds)) {
      throw new Error("userIds array is required");
    }

    // Fetch users using service role key
    const { data: { users }, error } = await supabaseClient.auth.admin.listUsers();
    
    if (error) throw error;

    // Filter users to only requested IDs and return email mapping
    const userEmails: Record<string, string> = {};
    users?.forEach(user => {
      if (userIds.includes(user.id) && user.email) {
        userEmails[user.id] = user.email;
      }
    });

    return new Response(JSON.stringify({ userEmails }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error fetching user emails:", error);
    return new Response(JSON.stringify({ 
      error: (error as Error).message,
      userEmails: {} 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});