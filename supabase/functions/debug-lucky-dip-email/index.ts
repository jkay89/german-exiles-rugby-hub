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
    console.log("=== DEBUG LUCKY DIP EMAIL FUNCTION STARTING ===");
    
    const { drawId, winners } = await req.json();
    console.log("Request data:", JSON.stringify({ drawId, winners }, null, 2));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get draw details
    console.log(`Fetching draw details for: ${drawId}`);
    const { data: draw, error: drawError } = await supabase
      .from('lottery_draws')
      .select('*')
      .eq('id', drawId)
      .single();

    if (drawError || !draw) {
      console.error("Error fetching draw:", drawError);
      throw new Error("Could not fetch lottery draw");
    }

    console.log("Draw details:", JSON.stringify(draw, null, 2));

    // Filter lucky dip winners
    const luckyDipWinners = winners?.filter(w => w.type === 'lucky_dip') || [];
    console.log(`Found ${luckyDipWinners.length} lucky dip winners`);

    // Get emails for lucky dip winners
    for (const winner of luckyDipWinners) {
      console.log(`=== PROCESSING WINNER: ${winner.userId} ===`);
      
      // Get user email
      const { data: authUser, error: userError } = await supabase.auth.admin.getUserById(winner.userId);
      
      if (userError) {
        console.error(`Error getting user ${winner.userId}:`, userError);
        continue;
      }

      if (!authUser?.user?.email) {
        console.log(`No email found for user ${winner.userId}`);
        continue;
      }

      const userEmail = authUser.user.email;
      console.log(`Found email: ${userEmail}`);

      // Send simple email
      try {
        console.log(`Sending email to ${userEmail}...`);
        
        const emailResult = await resend.emails.send({
          from: "German Exiles RL <onboarding@resend.dev>",
          to: [userEmail],
          subject: "🎉 Lucky Dip Winner - Simple Test Email",
          html: `
            <h1>🎉 Congratulations! You're a Lucky Dip Winner!</h1>
            <p>This is a simplified test email to verify the email system is working.</p>
            <p><strong>Prize:</strong> £${winner.prizeAmount}</p>
            <p><strong>Draw Date:</strong> ${draw.draw_date}</p>
            <p><strong>Winning Numbers:</strong> ${draw.winning_numbers.join(', ')}</p>
            <p>Contact jay@germanexilesrl.co.uk to claim your prize.</p>
            <hr>
            <p><em>This is a test email sent at ${new Date().toISOString()}</em></p>
          `,
        });

        console.log(`SUCCESS: Email sent to ${userEmail}:`, emailResult);
      } catch (emailError) {
        console.error(`FAILED: Error sending email to ${userEmail}:`, emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${luckyDipWinners.length} lucky dip winners`,
        drawId,
        drawDate: draw.draw_date
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in debug function:", error);
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