import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RandomOrgResponse {
  jsonrpc: string;
  result: {
    random: {
      data: number[];
      completionTime: string;
    };
    bitsUsed: number;
    bitsLeft: number;
    requestsLeft: number;
    advisoryDelay: number;
    signature: string;
  };
  id: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { drawDate, jackpotAmount, isTestDraw = false } = await req.json();

    if (!drawDate || !jackpotAmount) {
      return new Response(
        JSON.stringify({ error: 'Draw date and jackpot amount are required' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log(`Conducting lottery draw for date: ${drawDate}, jackpot: ${jackpotAmount}`);

    // Check if a draw already exists for this date (for non-test draws)
    if (!isTestDraw) {
      const { data: existingDraw } = await supabaseClient
        .from('lottery_draws')
        .select('id')
        .eq('draw_date', drawDate)
        .eq('is_test_draw', false)
        .maybeSingle();

      if (existingDraw) {
        console.log('Draw already exists for this date, returning existing draw');
        return new Response(
          JSON.stringify({
            error: 'Draw already exists for this date',
            existing_draw_id: existingDraw.id
          }),
          { 
            status: 409, // Conflict
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }
    }

    // Generate 4 random numbers between 1-32 using RANDOM.ORG
    const randomOrgPayload = {
      jsonrpc: "2.0",
      method: "generateSignedIntegers",
      params: {
        apiKey: Deno.env.get('RANDOM_ORG_API_KEY'),
        n: 4,
        min: 1,
        max: 32,
        replacement: false, // No duplicate numbers
        base: 10,
        userData: {
          lottery: "German Exiles Rugby League",
          drawDate: drawDate,
          timestamp: new Date().toISOString()
        }
      },
      id: 1
    };

    console.log('Calling RANDOM.ORG API...');
    
    const randomOrgResponse = await fetch('https://api.random.org/json-rpc/2/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(randomOrgPayload)
    });

    if (!randomOrgResponse.ok) {
      throw new Error(`RANDOM.ORG API error: ${randomOrgResponse.statusText}`);
    }

    const randomOrgData: RandomOrgResponse = await randomOrgResponse.json();
    console.log('RANDOM.ORG response:', randomOrgData);

    if (!randomOrgData.result || !randomOrgData.result.random) {
      throw new Error('Invalid response from RANDOM.ORG');
    }

    const winningNumbers = randomOrgData.result.random.data.sort((a, b) => a - b);
    console.log('Winning numbers:', winningNumbers);

    // Store the draw result in the database
    console.log('About to insert draw result with data:', {
      draw_date: drawDate,
      winning_numbers: winningNumbers,
      jackpot_amount: jackpotAmount,
      lucky_dip_amount: 10,
      random_org_signature: randomOrgData.result.signature?.substring(0, 50) + '...'
    });

    const { data: drawResult, error: drawError } = await supabaseClient
      .from('lottery_draws')
      .insert({
        draw_date: drawDate,
        winning_numbers: winningNumbers,
        jackpot_amount: jackpotAmount,
        lucky_dip_amount: 10,
        random_org_signature: randomOrgData.result.signature,
        is_test_draw: isTestDraw
      })
      .select()
      .single();

    if (drawError) {
      console.error('Error storing draw result:', drawError);
      console.error('Full error object:', JSON.stringify(drawError, null, 2));
      throw drawError;
    }

    console.log('Draw result stored:', drawResult);

    // Update next draw date to end of next month (only for real draws, not test draws)
    if (!isTestDraw) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const lastDayOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
      const nextDrawDate = lastDayOfNextMonth.toISOString().split('T')[0];

      console.log(`Updating next draw date to: ${nextDrawDate}`);
      
      const { error: settingsError } = await supabaseClient
        .from('lottery_settings')
        .update({ 
          setting_value: nextDrawDate,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', 'next_draw_date');

      if (settingsError) {
        console.error('Error updating next draw date:', settingsError);
      } else {
        console.log('Successfully updated next draw date');
      }
    }

    // Find all winners (jackpot and lucky dip)
    const { data: entries, error: entriesError } = await supabaseClient
      .from('lottery_entries')
      .select('*')
      .eq('draw_date', drawDate)
      .eq('is_active', true);

    if (entriesError) {
      console.error('Error fetching entries:', entriesError);
      throw entriesError;
    }

    console.log(`Found ${entries?.length || 0} entries for this draw`);

    // Check for jackpot winners (match all 4 numbers)
    const jackpotWinners = entries?.filter(entry => {
      const sortedEntryNumbers = [...entry.numbers].sort((a, b) => a - b);
      return JSON.stringify(sortedEntryNumbers) === JSON.stringify(winningNumbers);
    }) || [];

    console.log(`Jackpot winners: ${jackpotWinners.length}`);

    // Select 5 random lucky dip winners from all entries (excluding jackpot winners)
    const eligibleForLuckyDip = entries?.filter(entry => 
      !jackpotWinners.some(winner => winner.id === entry.id)
    ) || [];

    const luckyDipWinners = [];
    const usedUserIds = new Set();
    
    // Shuffle eligible entries and select up to 5 unique users
    const shuffled = [...eligibleForLuckyDip].sort(() => 0.5 - Math.random());
    
    for (const entry of shuffled) {
      if (luckyDipWinners.length >= 5) break;
      if (!usedUserIds.has(entry.user_id)) {
        luckyDipWinners.push(entry);
        usedUserIds.add(entry.user_id);
      }
    }

    console.log(`Lucky dip winners: ${luckyDipWinners.length}`);

    // Store winner results
    const winnerResults = [];

    // Store jackpot winners
    for (const winner of jackpotWinners) {
      const prizeAmount = jackpotWinners.length > 1 
        ? jackpotAmount / jackpotWinners.length 
        : jackpotAmount;

      const { error: resultError } = await supabaseClient
        .from('lottery_results')
        .insert({
          user_id: winner.user_id,
          draw_id: drawResult.id,
          entry_id: winner.id,
          matches: 4,
          prize_amount: prizeAmount,
          is_winner: true
        });

      if (resultError) {
        console.error('Error storing jackpot winner result:', resultError);
      } else {
        winnerResults.push({
          type: 'jackpot',
          entryId: winner.id,
          userId: winner.user_id,
          prizeAmount: prizeAmount,
          matches: 4,
          isJackpot: true
        });
      }
    }

    // Store lucky dip winners
    for (const winner of luckyDipWinners) {
      const { error: resultError } = await supabaseClient
        .from('lottery_results')
        .insert({
          user_id: winner.user_id,
          draw_id: drawResult.id,
          entry_id: winner.id,
          matches: 0, // Lucky dip doesn't require matches
          prize_amount: 10,
          is_winner: true
        });

      if (resultError) {
        console.error('Error storing lucky dip winner result:', resultError);
      } else {
        winnerResults.push({
          type: 'lucky_dip',
          entryId: winner.id,
          userId: winner.user_id,
          prizeAmount: 10,
          matches: 0,
          isJackpot: false
        });
      }
    }

    // Send notification emails to winners
    if (winnerResults.length > 0) {
      try {
        const { error: emailError } = await supabaseClient.functions.invoke('notify-lottery-winners', {
          body: { 
            drawId: drawResult.id,
            winners: winnerResults
          }
        });

        if (emailError) {
          console.error('Error sending winner notifications:', emailError);
        } else {
          console.log('Winner notification emails sent successfully');
        }
      } catch (emailError) {
        console.error('Error invoking winner notification function:', emailError);
      }
    }

    // Trigger draw completion processing for subscriptions (only for real draws)
    if (!isTestDraw) {
      try {
        const { error: completionError } = await supabaseClient.functions.invoke('process-draw-completion', {
          body: { drawDate: drawDate }
        });

        if (completionError) {
          console.error('Error processing draw completion:', completionError);
        } else {
          console.log('Draw completion processing triggered successfully');
        }
      } catch (completionError) {
        console.error('Error invoking draw completion function:', completionError);
      }
    }

    // Process draw completion for subscription renewals (only for real draws)
    if (!isTestDraw) {
      try {
        const { error: completionError } = await supabaseClient.functions.invoke('process-draw-completion', {
          body: { 
            drawDate: drawDate
          }
        });

        if (completionError) {
          console.error('Error processing draw completion:', completionError);
        } else {
          console.log('Draw completion processed successfully - subscriptions renewed');
        }
      } catch (completionError) {
        console.error('Error invoking draw completion function:', completionError);
      }
    }

    // Process draw completion for subscriptions (only for real draws, not test draws)
    if (!isTestDraw) {
      try {
        const { error: completionError } = await supabaseClient.functions.invoke('process-draw-completion', {
          body: { 
            drawDate: drawDate
          }
        });

        if (completionError) {
          console.error('Error processing draw completion:', completionError);
        } else {
          console.log('Draw completion processed successfully');
        }
      } catch (completionError) {
        console.error('Error invoking draw completion function:', completionError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        drawResult: {
          id: drawResult.id,
          drawDate: drawDate,
          winningNumbers: winningNumbers,
          jackpotAmount: jackpotAmount,
          jackpotWinners: jackpotWinners.length,
          luckyDipWinners: luckyDipWinners.length,
          signature: randomOrgData.result.signature
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in conduct-lottery-draw:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to conduct lottery draw',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})