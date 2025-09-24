import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface LotteryDraw {
  id: string;
  draw_date: string;
  winning_numbers: number[];
  jackpot_amount: number;
}

interface LotteryEntry {
  id: string;
  user_id: string;
  numbers: number[];
  line_number: number;
}

interface UserProfile {
  user_id: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Lottery winner notification function triggered");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { drawId, winners } = await req.json();
    console.log("Processing draw ID:", drawId, "with", winners?.length || 0, "winners");

    // Get the lottery draw details
    const { data: draw, error: drawError } = await supabase
      .from('lottery_draws')
      .select('*')
      .eq('id', drawId)
      .single();

    if (drawError || !draw) {
      console.error("Error fetching draw:", drawError);
      throw new Error("Could not fetch lottery draw");
    }

    console.log("Draw details:", draw);

    if (!winners || winners.length === 0) {
      console.log("No winners to notify");
      return new Response(
        JSON.stringify({ success: true, message: "No winners to notify" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Separate jackpot and lucky dip winners
    const jackpotWinners = winners.filter(w => w.type === 'jackpot');
    const luckyDipWinners = winners.filter(w => w.type === 'lucky_dip');

    console.log(`Processing ${jackpotWinners.length} jackpot winners and ${luckyDipWinners.length} lucky dip winners`);
    console.log("All winners data:", JSON.stringify(winners, null, 2));

    // Get user emails for all winners
    const allWinnerEmails = [];
    
    console.log(`Starting to fetch emails for ${winners.length} winners...`);
    
    for (const winner of winners) {
      console.log(`Fetching email for user: ${winner.userId}`);
      const { data: authUser, error: userError } = await supabase.auth.admin.getUserById(winner.userId);
      
      if (userError) {
        console.error(`Error fetching user ${winner.userId}:`, userError);
      } else if (authUser?.user?.email) {
        console.log(`Found email for ${winner.userId}: ${authUser.user.email}`);
        allWinnerEmails.push({
          ...winner,
          email: authUser.user.email
        });
      } else {
        console.log(`No email found for user ${winner.userId}`);
      }
    }

    console.log(`Total emails collected: ${allWinnerEmails.length}`);
    console.log("Winner emails with types:", JSON.stringify(allWinnerEmails.map(w => ({ type: w.type, email: w.email })), null, 2));

    // Send summary email to Jay
    if (allWinnerEmails.length > 0) {
      const winnersList = allWinnerEmails.map(winner => {
        return `
          <li>
            <strong>Type:</strong> ${winner.type === 'jackpot' ? 'Jackpot Winner' : 'Lucky Dip Winner'}<br>
            <strong>Player:</strong> ${winner.email}<br>
            <strong>Prize:</strong> £${winner.prizeAmount}<br>
            <strong>User ID:</strong> ${winner.userId}
          </li>
        `;
      }).join('');

      const summaryEmailHtml = `
        <h1>🎉 Lottery Winners Alert!</h1>
        <p>The following players have won prizes for the draw on ${draw.draw_date}:</p>
        
        <h2>Draw Details</h2>
        <p><strong>Winning Numbers:</strong> ${draw.winning_numbers.join(', ')}</p>
        <p><strong>Jackpot Amount:</strong> £${draw.jackpot_amount}</p>
        
        <h2>Winners Summary</h2>
        <p><strong>Jackpot Winners:</strong> ${jackpotWinners.length}</p>
        <p><strong>Lucky Dip Winners:</strong> ${luckyDipWinners.length}</p>
        <p><strong>Total Winners:</strong> ${allWinnerEmails.length}</p>
        
        <h2>Winner Details</h2>
        <ul>
          ${winnersList}
        </ul>
        
        <hr>
        <p><em>This is an automated notification from the German Exiles Rugby League Lottery system.</em></p>
      `;

      await resend.emails.send({
        from: "German Exiles RL <onboarding@resend.dev>",
        to: ["jay@germanexilesrl.co.uk"],
        subject: `🎉 Lottery Winners - ${allWinnerEmails.length} winner(s) for ${draw.draw_date}`,
        html: summaryEmailHtml,
      });

      console.log("Summary email sent to Jay");
    }

    // Send emails to jackpot winners
    for (const winner of allWinnerEmails.filter(w => w.type === 'jackpot')) {
      const winnerEmailHtml = `
        <h1>🎉 JACKPOT WINNER! Congratulations!</h1>
        <p>INCREDIBLE NEWS! You've won the JACKPOT in the German Exiles Rugby League Lottery!</p>
        
        <h2>Draw Details</h2>
        <p><strong>Draw Date:</strong> ${draw.draw_date}</p>
        <p><strong>Winning Numbers:</strong> ${draw.winning_numbers.join(', ')}</p>
        
        <h2>Your Jackpot Win</h2>
        <p><strong>Prize Amount:</strong> £${winner.prizeAmount}</p>
        <p><strong>Type:</strong> Jackpot Winner (All 4 numbers matched!)</p>
        
        <hr>
        <h3>Next Steps</h3>
        <p><strong>To claim your prize, please email jay@germanexilesrl.co.uk with:</strong></p>
        <ul>
          <li>A copy of your photo ID (passport or driving licence)</li>
          <li>Your bank details for payment transfer</li>
          <li>This winning notification email</li>
        </ul>
        
        <p>Your prize will be processed and paid within 5-7 working days after verification.</p>
        
        <p><em>Congratulations from everyone at German Exiles Rugby League! This is a fantastic win!</em></p>
      `;

      await resend.emails.send({
        from: "German Exiles RL <onboarding@resend.dev>",
        to: [winner.email],
        subject: `🎉 JACKPOT WINNER! £${winner.prizeAmount} - German Exiles RL Lottery`,
        html: winnerEmailHtml,
      });

      console.log(`Jackpot winner notification sent to ${winner.email}`);
    }

    // Send emails to lucky dip winners
    console.log("=== STARTING LUCKY DIP EMAIL SECTION ===");
    const luckyDipEmailWinners = allWinnerEmails.filter(w => w.type === 'lucky_dip');
    console.log(`Found ${luckyDipEmailWinners.length} lucky dip winners to email`);
    console.log("Lucky dip winners:", JSON.stringify(luckyDipEmailWinners.map(w => ({ email: w.email, prizeAmount: w.prizeAmount })), null, 2));
    
    for (const winner of luckyDipEmailWinners) {
      console.log(`=== PROCESSING LUCKY DIP EMAIL FOR ${winner.email} ===`);
      const luckyDipEmailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lucky Dip Winner - German Exiles RL</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              background-color: #f8f9fa;
              padding: 20px;
            }
            .email-container {
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .winner-badge {
              background: #fbbf24;
              color: #92400e;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: bold;
              font-size: 14px;
              margin-top: 15px;
              display: inline-block;
            }
            .content {
              padding: 40px 30px;
            }
            .congratulations {
              text-align: center;
              margin-bottom: 30px;
            }
            .congratulations h2 {
              color: #1e40af;
              font-size: 24px;
              margin-bottom: 10px;
            }
            .prize-box {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 25px;
              border-radius: 10px;
              text-align: center;
              margin: 25px 0;
            }
            .prize-amount {
              font-size: 36px;
              font-weight: bold;
              margin: 0;
            }
            .prize-label {
              font-size: 16px;
              opacity: 0.9;
              margin-top: 5px;
            }
            .draw-details {
              background: #f1f5f9;
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
            }
            .draw-details h3 {
              color: #1e40af;
              margin-top: 0;
              margin-bottom: 15px;
            }
            .winning-numbers {
              display: flex;
              gap: 10px;
              justify-content: center;
              margin: 15px 0;
            }
            .number-ball {
              background: #3b82f6;
              color: white;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 16px;
            }
            .next-steps {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 20px;
              margin: 25px 0;
              border-radius: 0 8px 8px 0;
            }
            .next-steps h3 {
              color: #92400e;
              margin-top: 0;
            }
            .requirements {
              list-style: none;
              padding: 0;
            }
            .requirements li {
              background: white;
              padding: 12px 15px;
              margin: 8px 0;
              border-radius: 6px;
              border-left: 3px solid #f59e0b;
            }
            .requirements li:before {
              content: "✓";
              color: #10b981;
              font-weight: bold;
              margin-right: 10px;
            }
            .contact-info {
              background: #e0f2fe;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 25px 0;
            }
            .contact-email {
              color: #1e40af;
              font-weight: bold;
              font-size: 18px;
              text-decoration: none;
            }
            .footer {
              background: #1f2937;
              color: #9ca3af;
              text-align: center;
              padding: 30px;
              font-size: 14px;
            }
            .footer .logo {
              color: white;
              font-weight: bold;
              font-size: 18px;
              margin-bottom: 10px;
            }
            .timeline {
              color: #10b981;
              font-weight: bold;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🎉 Lucky Dip Winner!</h1>
              <div class="winner-badge">YOU'VE WON £${winner.prizeAmount}!</div>
            </div>
            
            <div class="content">
              <div class="congratulations">
                <h2>Congratulations!</h2>
                <p>You've been randomly selected as a Lucky Dip winner in the German Exiles Rugby League Lottery!</p>
              </div>
              
              <div class="prize-box">
                <div class="prize-amount">£${winner.prizeAmount}</div>
                <div class="prize-label">Lucky Dip Prize</div>
              </div>
              
              <div class="draw-details">
                <h3>📅 Draw Details</h3>
                <p><strong>Draw Date:</strong> ${new Date(draw.draw_date).toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p><strong>Winning Numbers:</strong></p>
                <div class="winning-numbers">
                  ${draw.winning_numbers.map(num => `<div class="number-ball">${num}</div>`).join('')}
                </div>
                <p style="text-align: center; margin-top: 15px;"><em>You were randomly selected from all entries - no number matching required!</em></p>
              </div>
              
              <div class="next-steps">
                <h3>🏆 How to Claim Your Prize</h3>
                <p>To receive your prize, please send the following to our lottery coordinator:</p>
                <ul class="requirements">
                  <li>A clear photo of your government-issued ID (passport or driving licence)</li>
                  <li>Your bank account details for the prize transfer</li>
                  <li>A copy of this winning notification email</li>
                </ul>
              </div>
              
              <div class="contact-info">
                <p><strong>Send your claim details to:</strong></p>
                <a href="mailto:jay@germanexilesrl.co.uk" class="contact-email">jay@germanexilesrl.co.uk</a>
                <p style="margin-top: 15px;">
                  <span class="timeline">⏱️ Prize will be processed within 5-7 working days</span>
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-style: italic;">
                  "Well done and congratulations from everyone at German Exiles Rugby League! 🏉"
                </p>
              </div>
            </div>
            
            <div class="footer">
              <div class="logo">German Exiles Rugby League</div>
              <p>Supporting rugby league in Germany</p>
              <p style="font-size: 12px; margin-top: 15px;">
                This email was sent to confirm your lottery win. Please keep this email as proof of your prize.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        console.log(`Attempting to send email to ${winner.email}...`);
        const emailResult = await resend.emails.send({
          from: "German Exiles RL <onboarding@resend.dev>",
          to: [winner.email],
          subject: `🎉 Lucky Dip Winner! £${winner.prizeAmount} - German Exiles RL Lottery`,
          html: luckyDipEmailHtml,
        });

        console.log(`Email sent successfully to ${winner.email}:`, emailResult);
      } catch (emailError) {
        console.error(`Failed to send email to ${winner.email}:`, emailError);
      }
    }
    
    console.log("=== FINISHED LUCKY DIP EMAIL SECTION ===");

    return new Response(
      JSON.stringify({ 
        success: true, 
        jackpot_winners: jackpotWinners.length,
        lucky_dip_winners: luckyDipWinners.length,
        total_winners: winners.length,
        draw_date: draw.draw_date 
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);