import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== SIMPLE EMAIL TEST STARTING ===");
    
    const { to } = await req.json();
    const testEmail = to || "jay@germanexilesrl.co.uk";
    
    console.log(`Sending simple test email to: ${testEmail}`);
    
    // Send very simple email
    const emailResult = await resend.emails.send({
      from: "German Exiles RL <noreply@germanexilesrl.co.uk>",
      to: [testEmail],
      subject: "Simple Test - Resend API Working",
      html: `
        <h1>Simple Test Email</h1>
        <p>This is a basic test to verify Resend is working.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
        <p>If you receive this, the Resend API is functioning correctly.</p>
      `,
    });

    console.log("Email sent successfully:", emailResult);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Simple test email sent",
        emailResult,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in simple email test:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
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