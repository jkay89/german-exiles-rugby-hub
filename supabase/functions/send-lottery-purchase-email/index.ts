import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from 'npm:react@18.3.1';
import { PurchaseConfirmationEmail } from './_templates/purchase-confirmation.tsx';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { 
      userEmail, 
      userName, 
      numbers, 
      drawDate, 
      jackpotAmount, 
      lineNumber 
    } = await req.json();

    console.log('Sending purchase confirmation email to:', userEmail);

    // Render the email template
    const html = await renderAsync(
      React.createElement(PurchaseConfirmationEmail, {
        customerName: userName,
        numbers: numbers,
        drawDate: drawDate,
        jackpotAmount: jackpotAmount,
        lineNumber: lineNumber,
      })
    );

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'German Exiles Lottery <noreply@mail.germanexilesrl.co.uk>',
      to: [userEmail],
      subject: '🎰 Your Lottery Numbers Are Confirmed!',
      html: html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Purchase confirmation email sent successfully:', data);

    return new Response(JSON.stringify({ success: true, emailId: data?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error in send-lottery-purchase-email function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to send purchase confirmation email'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});