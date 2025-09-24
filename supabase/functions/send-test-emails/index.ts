import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailAddress } = await req.json();
    
    if (!emailAddress) {
      throw new Error("Email address is required");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Sample data for test emails
    const testData = {
      customerName: "John Doe",
      numbers: [7, 14, 21, 28],
      drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
      lineNumber: 12345,
      paymentAmount: 5
    };

    // Send purchase confirmation email
    const purchaseEmailResponse = await supabase.functions.invoke('send-lottery-purchase-email', {
      body: {
        userEmail: emailAddress,
        userName: testData.customerName,
        numbers: testData.numbers,
        drawDate: testData.drawDate,
        lineNumber: testData.lineNumber
      }
    });

    // Send subscription confirmation email
    const subscriptionEmailResponse = await supabase.functions.invoke('send-lottery-subscription-email', {
      body: {
        userEmail: emailAddress,
        userName: testData.customerName,
        numbers: testData.numbers,
        drawDate: testData.drawDate,
        lineNumber: testData.lineNumber,
        paymentAmount: testData.paymentAmount,
        emailType: 'confirmation',
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Next month
      }
    });

    // Send monthly reminder email
    const reminderEmailResponse = await supabase.functions.invoke('send-lottery-subscription-email', {
      body: {
        userEmail: emailAddress,
        userName: testData.customerName,
        numbers: testData.numbers,
        drawDate: testData.drawDate,
        lineNumber: testData.lineNumber,
        paymentAmount: testData.paymentAmount,
        emailType: 'monthly'
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Test emails sent to ${emailAddress}`,
        responses: {
          purchase: purchaseEmailResponse,
          subscription: subscriptionEmailResponse,
          reminder: reminderEmailResponse
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending test emails:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});