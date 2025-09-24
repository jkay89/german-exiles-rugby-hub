import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
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
    console.log("=== LUCKY DIP WINNERS EMAIL STARTING ===");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the most recent draw and its lucky dip winners
    const { data: drawData, error: drawError } = await supabase
      .from('lottery_draws')
      .select(`
        *,
        lottery_results!inner(
          user_id,
          prize_amount,
          is_winner
        )
      `)
      .eq('lottery_results.is_winner', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (drawError || !drawData || drawData.length === 0) {
      throw new Error(`No recent draw found: ${drawError?.message}`);
    }

    const draw = drawData[0];
    const winners = draw.lottery_results;
    
    console.log(`Found draw: ${draw.id} with ${winners.length} winners`);
    console.log("Winners:", JSON.stringify(winners, null, 2));

    let emailsSent = 0;
    const emailResults = [];

    // Send simplified lucky dip emails to each winner with rate limiting
    for (let i = 0; i < winners.length; i++) {
      const winner = winners[i];
      console.log(`=== PROCESSING WINNER ${i + 1}/${winners.length}: ${winner.user_id} ===`);
      
      // Add delay to respect Resend rate limit (2 requests per second)
      if (i > 0) {
        console.log("Waiting 600ms to respect rate limit...");
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      
      // Get user email
      const { data: authUser, error: userError } = await supabase.auth.admin.getUserById(winner.user_id);
      
      if (userError) {
        console.error(`Error getting user ${winner.user_id}:`, userError);
        emailResults.push({
          userId: winner.user_id,
          success: false,
          error: userError.message
        });
        continue;
      }

      if (!authUser?.user?.email) {
        console.log(`No email found for user ${winner.user_id}`);
        emailResults.push({
          userId: winner.user_id,
          success: false,
          error: "No email found"
        });
        continue;
      }

      const userEmail = authUser.user.email;
      console.log(`Found email: ${userEmail}`);

      // Send simplified lucky dip winner email
      try {
        console.log(`Sending lucky dip winner email to ${userEmail}...`);
        
        const emailResult = await resend.emails.send({
          from: "German Exiles RL <noreply@mail.germanexilesrl.co.uk>",
          to: [userEmail],
          subject: `🎉 Lucky Dip Winner! £${winner.prize_amount} - German Exiles RL`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #1e40af; color: white; padding: 30px; text-align: center; border-radius: 10px;">
                <h1 style="margin: 0; font-size: 28px;">🎉 Lucky Dip Winner!</h1>
                <p style="font-size: 18px; margin: 10px 0 0 0;">You've won £${winner.prize_amount}!</p>
              </div>
              
              <div style="padding: 30px 0;">
                <h2 style="color: #1e40af;">Congratulations!</h2>
                <p>You've been randomly selected as a Lucky Dip winner in the German Exiles Rugby League Lottery!</p>
                
                <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                  <h3 style="margin: 0; font-size: 32px;">£${winner.prize_amount}</h3>
                  <p style="margin: 5px 0 0 0;">Lucky Dip Prize</p>
                </div>
                
                <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1e40af; margin-top: 0;">Draw Details</h3>
                  <p><strong>Draw Date:</strong> ${draw.draw_date}</p>
                  <p><strong>Winning Numbers:</strong> ${draw.winning_numbers.join(', ')}</p>
                  <p><em>You were randomly selected - no number matching required!</em></p>
                </div>
                
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #92400e; margin-top: 0;">How to Claim Your Prize</h3>
                  <p>To receive your prize, please email <strong>jay@germanexilesrl.co.uk</strong> with:</p>
                  <ul>
                    <li>A clear photo of your government-issued ID</li>
                    <li>Your bank account details</li>
                    <li>A copy of this email</li>
                  </ul>
                  <p><strong>Prize will be processed within 5-7 working days</strong></p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-style: italic;">
                    Congratulations from everyone at German Exiles Rugby League! 🏉
                  </p>
                </div>
              </div>
              
              <div style="background: #1f2937; color: #9ca3af; text-align: center; padding: 20px; border-radius: 8px;">
                <p style="margin: 0; font-weight: bold;">German Exiles Rugby League</p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Lottery Draw - ${new Date().toISOString()}</p>
              </div>
            </div>
          `,
        });

        console.log(`SUCCESS: Email sent to ${userEmail}:`, emailResult);
        emailResults.push({
          userId: winner.user_id,
          email: userEmail,
          success: true,
          result: emailResult
        });
        emailsSent++;
        
      } catch (emailError) {
        console.error(`FAILED: Error sending email to ${userEmail}:`, emailError);
        emailResults.push({
          userId: winner.user_id,
          email: userEmail,
          success: false,
          error: emailError.message
        });
      }
    }

    console.log(`=== COMPLETED: ${emailsSent}/${winners.length} emails sent ===`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Live emails sent to ${emailsSent}/${winners.length} lucky dip winners`,
        drawId: draw.id,
        drawDate: draw.draw_date,
        totalWinners: winners.length,
        emailsSent,
        results: emailResults
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in test-lucky-dip-winners function:", error);
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