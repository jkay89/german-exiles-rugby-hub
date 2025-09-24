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
    console.log("Testing email sending...");
    
    const { email } = await req.json();
    const testEmail = email || "jay@germanexilesrl.co.uk";
    
    console.log(`Sending test email to: ${testEmail}`);
    
    const result = await resend.emails.send({
      from: "German Exiles RL <noreply@mail.germanexilesrl.co.uk>",
      to: [testEmail],
      subject: "🧪 Test Email - Lucky Dip System",
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify the lucky dip email system is working.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    });

    console.log("Email sent successfully:", result);

    return new Response(
      JSON.stringify({ 
        success: true, 
        result,
        message: `Test email sent to ${testEmail}` 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error sending test email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);