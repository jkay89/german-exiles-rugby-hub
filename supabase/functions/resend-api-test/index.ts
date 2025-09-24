import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== RESEND API TEST STARTING ===");
    
    // Check if API key exists
    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log("API Key present:", !!apiKey);
    console.log("API Key length:", apiKey?.length || 0);
    console.log("API Key starts with:", apiKey?.substring(0, 10) || "N/A");

    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable not found");
    }

    const resend = new Resend(apiKey);
    console.log("Resend client created successfully");

    // Send test email
    console.log("Attempting to send test email...");
    const result = await resend.emails.send({
      from: "German Exiles RL <onboarding@resend.dev>",
      to: ["jay@germanexilesrl.co.uk"],
      subject: "🔧 Resend API Test",
      html: `
        <h1>Resend API Test</h1>
        <p>This email was sent to test the Resend API configuration.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>Function: resend-api-test</p>
      `,
    });

    console.log("Email send result:", result);

    return new Response(
      JSON.stringify({ 
        success: true, 
        result,
        apiKeyPresent: !!apiKey,
        message: "Resend API test completed successfully"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Resend API test error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        name: error.name
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);