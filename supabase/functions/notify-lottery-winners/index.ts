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

    // Get user emails for all winners
    const allWinnerEmails = [];
    
    for (const winner of winners) {
      const { data: authUser, error: userError } = await supabase.auth.admin.getUserById(winner.userId);
      if (authUser?.user?.email) {
        allWinnerEmails.push({
          ...winner,
          email: authUser.user.email
        });
      }
    }

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
    for (const winner of allWinnerEmails.filter(w => w.type === 'lucky_dip')) {
      const luckyDipEmailHtml = `
        <h1>🎉 Lucky Dip Winner! Congratulations!</h1>
        <p>Great news! You've been selected as a Lucky Dip winner in the German Exiles Rugby League Lottery!</p>
        
        <h2>Draw Details</h2>
        <p><strong>Draw Date:</strong> ${draw.draw_date}</p>
        <p><strong>Winning Numbers:</strong> ${draw.winning_numbers.join(', ')}</p>
        
        <h2>Your Lucky Dip Win</h2>
        <p><strong>Prize Amount:</strong> £${winner.prizeAmount}</p>
        <p><strong>Type:</strong> Lucky Dip Winner (Randomly selected from all entries)</p>
        
        <hr>
        <h3>Next Steps</h3>
        <p><strong>To claim your prize, please email jay@germanexilesrl.co.uk with:</strong></p>
        <ul>
          <li>A copy of your photo ID (passport or driving licence)</li>
          <li>Your bank details for payment transfer</li>
          <li>This winning notification email</li>
        </ul>
        
        <p>Your prize will be processed and paid within 5-7 working days after verification.</p>
        
        <p><em>Well done and congratulations from the German Exiles Rugby League team!</em></p>
      `;

      await resend.emails.send({
        from: "German Exiles RL <onboarding@resend.dev>",
        to: [winner.email],
        subject: `🎉 Lucky Dip Winner! £${winner.prizeAmount} - German Exiles RL Lottery`,
        html: luckyDipEmailHtml,
      });

      console.log(`Lucky dip winner notification sent to ${winner.email}`);
    }
    }

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