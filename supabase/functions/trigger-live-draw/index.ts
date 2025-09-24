import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== TRIGGERING LIVE LOTTERY DRAW ===");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get current lottery settings
    const { data: settings, error: settingsError } = await supabase
      .from('lottery_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['current_jackpot', 'next_draw_date']);

    if (settingsError) {
      throw new Error(`Failed to fetch lottery settings: ${settingsError.message}`);
    }

    const jackpot = settings?.find(s => s.setting_key === 'current_jackpot')?.setting_value || '100';
    const drawDate = settings?.find(s => s.setting_key === 'next_draw_date')?.setting_value || new Date().toISOString().split('T')[0];

    console.log(`Using jackpot: £${jackpot}, draw date: ${drawDate}`);

    // Call the conduct-lottery-draw function
    const { data: drawResult, error: drawError } = await supabase.functions.invoke('conduct-lottery-draw', {
      body: {
        drawDate: drawDate,
        jackpotAmount: parseInt(jackpot),
        isTestDraw: false
      }
    });

    if (drawError) {
      console.error("Draw error:", drawError);
      throw new Error(`Failed to conduct draw: ${drawError.message}`);
    }

    console.log("✅ Live draw completed successfully!");
    console.log("Draw result:", JSON.stringify(drawResult, null, 2));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Live lottery draw completed successfully!",
        drawResult
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in trigger-live-draw function:", error);
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