import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { renderAsync } from "https://esm.sh/@react-email/components@0.0.22";
import React from 'https://esm.sh/react@18.3.1';
import { SubscriptionConfirmationEmail } from './_templates/subscription-confirmation.tsx';
import { MonthlyReminderEmail } from './_templates/monthly-reminder.tsx';

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
      lineNumber,
      nextPaymentDate,
      emailType = 'confirmation', // 'confirmation' or 'monthly'
      paymentAmount = 5 // Default lottery price
    } = await req.json();

    console.log(`Sending ${emailType} email to:`, userEmail);

    // Get current jackpot amount from database
    const { data: jackpotData, error: jackpotError } = await supabaseClient
      .from('lottery_settings')
      .select('setting_value')
      .eq('setting_key', 'current_jackpot')
      .maybeSingle();

    const currentJackpot = jackpotData ? parseInt(jackpotData.setting_value) : 50000;
    
    if (jackpotError) {
      console.warn('Could not fetch current jackpot, using default:', jackpotError);
    }

    let html;
    let subject;

    if (emailType === 'monthly') {
      // Monthly reminder email
      html = await renderAsync(
        React.createElement(MonthlyReminderEmail, {
          customerName: userName,
          numbers: numbers,
          drawDate: drawDate,
          jackpotAmount: currentJackpot,
          lineNumber: lineNumber,
          paymentAmount: paymentAmount,
        })
      );
      subject = '📅 Monthly Lottery Entry Confirmed';
    } else {
      // Initial subscription confirmation
      html = await renderAsync(
        React.createElement(SubscriptionConfirmationEmail, {
          customerName: userName,
          numbers: numbers,
          drawDate: drawDate,
          jackpotAmount: currentJackpot,
          lineNumber: lineNumber,
          nextPaymentDate: nextPaymentDate,
        })
      );
      subject = '🎯 Lottery Subscription Confirmed!';
    }

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'German Exiles Lottery <noreply@germanexilesrl.co.uk>',
      to: [userEmail],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log(`${emailType} email sent successfully:`, data);

    return new Response(JSON.stringify({ success: true, emailId: data?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error in send-lottery-subscription-email function:', error);
    return new Response(JSON.stringify({ 
      error: (error as Error).message,
      details: 'Failed to send subscription email'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});