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
    const { draw_id } = await req.json();
    console.log("Processing draw ID:", draw_id);

    // Get the lottery draw details
    const { data: draw, error: drawError } = await supabase
      .from('lottery_draws')
      .select('*')
      .eq('id', draw_id)
      .single();

    if (drawError || !draw) {
      console.error("Error fetching draw:", drawError);
      throw new Error("Could not fetch lottery draw");
    }

    console.log("Draw details:", draw);

    // Get all active lottery entries
    const { data: entries, error: entriesError } = await supabase
      .from('lottery_entries')
      .select('*')
      .eq('is_active', true);

    if (entriesError) {
      console.error("Error fetching entries:", entriesError);
      throw new Error("Could not fetch lottery entries");
    }

    console.log(`Checking ${entries?.length || 0} entries for matches`);

    const winners: Array<{
      entry: LotteryEntry;
      matches: number;
      userEmail?: string;
    }> = [];

    // Check each entry for matches
    for (const entry of entries || []) {
      const matches = entry.numbers.filter((num: number) => 
        draw.winning_numbers.includes(num)
      ).length;

      if (matches >= 2) { // Consider 2+ matches as a win
        console.log(`Winner found! Entry ${entry.id} has ${matches} matches`);
        
        // Get user email from auth.users
        const { data: authUser, error: userError } = await supabase.auth.admin.getUserById(entry.user_id);
        
        winners.push({
          entry,
          matches,
          userEmail: authUser?.user?.email
        });
      }
    }

    console.log(`Found ${winners.length} winners`);

    if (winners.length > 0) {
      // Prepare email content
      const winnersList = winners.map(winner => {
        const prizeAmount = winner.matches === 4 ? draw.jackpot_amount : 
                          winner.matches === 3 ? 100 :
                          winner.matches === 2 ? 10 : 0;
        
        return `
          <li>
            <strong>Player:</strong> ${winner.userEmail || 'Unknown'}<br>
            <strong>Numbers:</strong> ${winner.entry.numbers.join(', ')}<br>
            <strong>Matches:</strong> ${winner.matches}<br>
            <strong>Prize:</strong> £${prizeAmount}<br>
            <strong>Line:</strong> ${winner.entry.line_number}
          </li>
        `;
      }).join('');

      const emailHtml = `
        <h1>🎉 Lottery Winners Alert!</h1>
        <p>The following players have winning numbers for the draw on ${draw.draw_date}:</p>
        
        <h2>Draw Details</h2>
        <p><strong>Winning Numbers:</strong> ${draw.winning_numbers.join(', ')}</p>
        <p><strong>Jackpot Amount:</strong> £${draw.jackpot_amount}</p>
        
        <h2>Winners (${winners.length})</h2>
        <ul>
          ${winnersList}
        </ul>
        
        <hr>
        <p><em>This is an automated notification from the German Exiles Rugby League Lottery system.</em></p>
      `;

      // Send notification email
      const emailResponse = await resend.emails.send({
        from: "German Exiles RL <lottery@germanexilesrl.co.uk>",
        to: ["jay@germanexilesrl.co.uk"],
        subject: `🎉 Lottery Winners - ${winners.length} winner(s) for ${draw.draw_date}`,
        html: emailHtml,
      });

      console.log("Email sent successfully:", emailResponse);

      // Send individual winner notifications
      for (const winner of winners) {
        if (winner.userEmail) {
          const prizeAmount = winner.matches === 4 ? draw.jackpot_amount : 
                            winner.matches === 3 ? 100 :
                            winner.matches === 2 ? 10 : 0;
          
          const winnerEmailHtml = `
            <h1>🎉 Congratulations! You're a Winner!</h1>
            <p>Great news! Your lottery numbers have won in the German Exiles Rugby League Lottery!</p>
            
            <h2>Draw Details</h2>
            <p><strong>Draw Date:</strong> ${draw.draw_date}</p>
            <p><strong>Winning Numbers:</strong> ${draw.winning_numbers.join(', ')}</p>
            
            <h2>Your Winning Entry</h2>
            <p><strong>Your Numbers:</strong> ${winner.entry.numbers.join(', ')}</p>
            <p><strong>Matches:</strong> ${winner.matches} out of 4</p>
            <p><strong>Prize Amount:</strong> £${prizeAmount}</p>
            <p><strong>Line Number:</strong> ${winner.entry.line_number}</p>
            
            <hr>
            <h3>Next Steps</h3>
            <p>Your prize will be paid via bank transfer within 2-3 working days.</p>
            <p>If you have any questions, please contact us at lottery@germanexilesrl.co.uk</p>
            
            <p><em>Congratulations again from the German Exiles Rugby League team!</em></p>
          `;

          await resend.emails.send({
            from: "German Exiles RL <lottery@germanexilesrl.co.uk>",
            to: [winner.userEmail],
            subject: `🎉 You Won! £${prizeAmount} Prize from German Exiles RL Lottery`,
            html: winnerEmailHtml,
          });

          console.log(`Winner notification sent to ${winner.userEmail}`);
        }
      }

      // Store lottery results in database
      for (const winner of winners) {
        const prizeAmount = winner.matches === 4 ? draw.jackpot_amount : 
                          winner.matches === 3 ? 100 :
                          winner.matches === 2 ? 10 : 0;

        const { error: resultError } = await supabase
          .from('lottery_results')
          .insert({
            user_id: winner.entry.user_id,
            draw_id: draw.id,
            entry_id: winner.entry.id,
            matches: winner.matches,
            prize_amount: prizeAmount,
            is_winner: true
          });

        if (resultError) {
          console.error("Error storing result:", resultError);
        }
      }
    } else {
      console.log("No winners found for this draw");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        winners_count: winners.length,
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