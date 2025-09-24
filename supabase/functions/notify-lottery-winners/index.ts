import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { LuckyDipWinnerEmail } from './_templates/lucky-dip-winner.tsx';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface LotteryDraw {
  id: string;
  draw_date: string;
  winning_numbers: number[];
  jackpot_amount: number;
  lucky_dip_amount: number;
}

interface LotteryEntry {
  id: string;
  user_id: string;
  numbers: number[];
  draw_date: string;
}

interface UserProfile {
  user_id: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== NOTIFY LOTTERY WINNERS STARTING ===");
    
    const { drawId, winners } = await req.json();
    console.log(`Processing notification for draw ${drawId} with ${winners.length} winners`);

    // Fetch draw details
    const { data: drawData, error: drawError } = await supabase
      .from('lottery_draws')
      .select('*')
      .eq('id', drawId)
      .single();

    if (drawError || !drawData) {
      throw new Error(`Failed to fetch draw details: ${drawError?.message}`);
    }

    const draw: LotteryDraw = drawData;
    console.log(`Draw details: ${draw.draw_date}, numbers: [${draw.winning_numbers.join(', ')}]`);

    // Separate winners by type
    const jackpotWinners = winners.filter((w: any) => w.matches === 4);
    const luckyDipWinners = winners.filter((w: any) => w.matches === 0 && w.isLuckyDip);

    console.log(`Found ${jackpotWinners.length} jackpot winners and ${luckyDipWinners.length} lucky dip winners`);

    // Get user emails for all winners
    const allWinnerIds = winners.map((w: any) => w.userId);
    const userEmails: UserProfile[] = [];

    console.log("=== FETCHING USER EMAILS ===");
    for (const userId of allWinnerIds) {
      console.log(`Fetching email for user: ${userId}`);
      
      const { data: authUser, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError) {
        console.error(`Error getting user ${userId}:`, userError);
        continue;
      }

      if (authUser?.user?.email) {
        userEmails.push({
          user_id: userId,
          email: authUser.user.email
        });
        console.log(`Found email for user ${userId}: ${authUser.user.email}`);
      } else {
        console.log(`No email found for user ${userId}`);
      }
    }

    // Send summary email to admin
    console.log("=== SENDING SUMMARY EMAIL TO ADMIN ===");
    const summaryEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 10px;">
          <h1>🎯 Lottery Draw Results Summary</h1>
        </div>
        
        <div style="padding: 20px 0;">
          <h2>Draw Details</h2>
          <p><strong>Date:</strong> ${draw.draw_date}</p>
          <p><strong>Winning Numbers:</strong> ${draw.winning_numbers.join(', ')}</p>
          <p><strong>Jackpot Amount:</strong> £${draw.jackpot_amount}</p>
          
          <h3>Results:</h3>
          <ul>
            <li><strong>Jackpot Winners:</strong> ${jackpotWinners.length}</li>
            <li><strong>Lucky Dip Winners:</strong> ${luckyDipWinners.length}</li>
            <li><strong>Total Winners:</strong> ${winners.length}</li>
          </ul>
          
          ${winners.length > 0 ? `
            <h3>Winner Details:</h3>
            <ul>
              ${winners.map((w: any) => {
                const userEmail = userEmails.find(u => u.user_id === w.userId);
                return `<li>${userEmail?.email || 'Unknown'} - ${w.matches === 4 ? 'Jackpot' : 'Lucky Dip'} - £${w.prizeAmount}</li>`;
              }).join('')}
            </ul>
          ` : '<p>No winners for this draw.</p>'}
        </div>
      </div>
    `;

    try {
      await resend.emails.send({
        from: "German Exiles RL <noreply@mail.germanexilesrl.co.uk>",
        to: ["jay@germanexilesrl.co.uk"],
        subject: `🎯 Lottery Draw Results - ${draw.draw_date} - ${winners.length} Winners`,
        html: summaryEmailHtml,
      });
      console.log("Summary email sent to admin successfully");
    } catch (summaryError) {
      console.error("Failed to send summary email:", summaryError);
    }

    // Send jackpot winner emails (if any)
    console.log("=== SENDING JACKPOT WINNER EMAILS ===");
    for (let i = 0; i < jackpotWinners.length; i++) {
      const winner = jackpotWinners[i];
      const userEmail = userEmails.find(u => u.user_id === winner.userId);
      
      if (!userEmail) {
        console.log(`No email found for jackpot winner ${winner.userId}`);
        continue;
      }

      console.log(`Processing jackpot winner ${i + 1}/${jackpotWinners.length}: ${userEmail.email}`);
      
      // Add delay between emails to respect rate limits
      if (i > 0) {
        console.log("Waiting 600ms to respect rate limit...");
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      const jackpotEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="margin: 0; font-size: 32px;">🎉 JACKPOT WINNER! 🎉</h1>
            <p style="font-size: 24px; margin: 15px 0;">YOU'VE WON £${winner.prizeAmount}!</p>
          </div>
          
          <div style="padding: 30px 0;">
            <h2 style="color: #dc2626;">Congratulations!</h2>
            <p>You've matched all 4 numbers in the German Exiles Rugby League Lottery and won the JACKPOT!</p>
            
            <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="margin: 0; font-size: 36px;">£${winner.prizeAmount}</h3>
              <p style="margin: 5px 0 0 0;">JACKPOT PRIZE!</p>
            </div>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Draw Details</h3>
              <p><strong>Draw Date:</strong> ${draw.draw_date}</p>
              <p><strong>Winning Numbers:</strong> ${draw.winning_numbers.join(', ')}</p>
              <p><strong>Your Numbers:</strong> ${winner.numbers ? winner.numbers.join(', ') : 'Matched all 4!'}</p>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">How to Claim Your Prize</h3>
              <p>To receive your jackpot prize, please email <strong>jay@germanexilesrl.co.uk</strong> with:</p>
              <ul>
                <li>A clear photo of your government-issued ID</li>
                <li>Your bank account details</li>
                <li>A copy of this email</li>
              </ul>
              <p><strong>Prize will be processed within 5-7 working days</strong></p>
            </div>
          </div>
        </div>
      `;

      try {
        await resend.emails.send({
          from: "German Exiles RL <noreply@mail.germanexilesrl.co.uk>",
          to: [userEmail.email],
          subject: `🎉 JACKPOT WINNER! £${winner.prizeAmount} - German Exiles RL`,
          html: jackpotEmailHtml,
        });
        console.log(`Jackpot email sent to ${userEmail.email}`);
      } catch (emailError) {
        console.error(`Failed to send jackpot email to ${userEmail.email}:`, emailError);
      }
    }

    // Send lucky dip winner emails using React Email template
    console.log("=== SENDING LUCKY DIP WINNER EMAILS ===");
    for (let i = 0; i < luckyDipWinners.length; i++) {
      const winner = luckyDipWinners[i];
      const userEmail = userEmails.find(u => u.user_id === winner.userId);
      
      if (!userEmail) {
        console.log(`No email found for lucky dip winner ${winner.userId}`);
        continue;
      }

      console.log(`Processing lucky dip winner ${i + 1}/${luckyDipWinners.length}: ${userEmail.email}`);
      
      // Add delay between emails to respect rate limits
      if (i > 0) {
        console.log("Waiting 600ms to respect rate limit...");
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      try {
        // Render the React Email template for lucky dip winners
        const luckyDipEmailHtml = await renderAsync(
          React.createElement(LuckyDipWinnerEmail, {
            winnerName: userEmail.email.split('@')[0] || 'Lucky Winner',
            prizeAmount: winner.prizeAmount,
            drawDate: draw.draw_date,
            winningNumbers: draw.winning_numbers,
          })
        );

        await resend.emails.send({
          from: "German Exiles RL <noreply@mail.germanexilesrl.co.uk>",
          to: [userEmail.email],
          subject: `🎉 LUCKY DIP WINNER! £${winner.prizeAmount} Prize! 🍀 German Exiles RL`,
          html: luckyDipEmailHtml,
        });

        console.log(`Exciting lucky dip email sent to ${userEmail.email}`);
      } catch (emailError) {
        console.error(`Failed to send lucky dip email to ${userEmail.email}:`, emailError);
      }
    }
    
    console.log("=== FINISHED EMAIL NOTIFICATIONS ===");

    return new Response(
      JSON.stringify({ 
        success: true, 
        jackpot_winners: jackpotWinners.length,
        lucky_dip_winners: luckyDipWinners.length,
        total_winners: winners.length,
        draw_date: draw.draw_date,
        emails_attempted: userEmails.length
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in notify-lottery-winners function:", error);
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