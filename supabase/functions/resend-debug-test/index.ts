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
    console.log("=== RESEND DEBUG TEST STARTING ===");
    
    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log("API Key exists:", !!apiKey);
    console.log("API Key first 10 chars:", apiKey?.substring(0, 10));
    
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable not set");
    }

    const resend = new Resend(apiKey);
    console.log("Resend client initialized");

    const { to } = await req.json();
    const testEmail = to || "jay@germanexilesrl.co.uk";
    
    console.log(`Attempting to send email to: ${testEmail}`);
    
    const emailPayload = {
      from: "German Exiles RL <noreply@mail.germanexilesrl.co.uk>",
      to: [testEmail],
      subject: "DEBUG: Resend API Test",
      html: `
        <h1>Resend Debug Test</h1>
        <p>This is a minimal test to debug Resend API issues.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>If you receive this, Resend is working correctly.</p>
      `,
    };
    
    console.log("Email payload:", JSON.stringify(emailPayload, null, 2));
    
    // Try to send email and log everything
    console.log("Calling resend.emails.send...");
    const emailResult = await resend.emails.send(emailPayload);
    console.log("Resend API response:", JSON.stringify(emailResult, null, 2));
    
    if (emailResult.error) {
      console.error("Resend API returned error:", emailResult.error);
      throw new Error(`Resend API error: ${JSON.stringify(emailResult.error)}`);
    }
    
    if (emailResult.data) {
      console.log("Email sent successfully! ID:", emailResult.data.id);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Debug email sent successfully",
        emailId: emailResult.data?.id,
        result: emailResult,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("=== ERROR IN RESEND DEBUG TEST ===");
    console.error("Error type:", typeof error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        errorType: typeof error,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);