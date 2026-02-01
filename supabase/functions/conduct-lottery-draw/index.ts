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

    // Check if a draw already exists for this date 
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
            error: 'A real draw already exists for this date',
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
    } else {
      // For test draws, check if there's been a recent test draw (within last 10 seconds) to prevent spam
      const tenSecondsAgo = new Date(Date.now() - 10000).toISOString();
      const { data: recentTestDraw } = await supabaseClient
        .from('lottery_draws')
        .select('id, created_at')
        .eq('is_test_draw', true)
        .gte('created_at', tenSecondsAgo)
        .maybeSingle();

      if (recentTestDraw) {
        console.log('Recent test draw found, preventing spam');
        return new Response(
          JSON.stringify({
            error: 'Please wait a few seconds between test draws',
            recent_draw_time: recentTestDraw.created_at
          }),
          { 
            status: 429, // Too Many Requests
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
      
      // Check if it's a unique constraint violation (duplicate draw)
      if (drawError.code === '23505' && drawError.message.includes('unique_real_draw_per_date')) {
        console.log('Duplicate draw detected by database constraint');
        return new Response(
          JSON.stringify({
            error: 'A real draw already exists for this date',
            errorCode: 'DRAW_EXISTS',
            drawDate: drawDate
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
      
      throw drawError;
    }

    console.log('Draw result stored:', drawResult);

    // Update next draw date to end of next month (only for real draws, not test draws)
    if (!isTestDraw) {
      // Calculate next draw date correctly by using the first of the month to avoid date overflow
      // e.g., Jan 31 + 1 month would incorrectly give Mar 3 due to Feb 31 not existing
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      // Get the last day of next month by getting day 0 of the month after next
      // This avoids the date overflow issue with setMonth()
      const nextMonthIndex = currentMonth + 1;
      const yearForNextMonth = nextMonthIndex > 11 ? currentYear + 1 : currentYear;
      const adjustedMonthIndex = nextMonthIndex > 11 ? 0 : nextMonthIndex;
      
      // Day 0 of month N gives last day of month N-1, so we use month+1 with day 0
      const lastDayOfNextMonth = new Date(yearForNextMonth, adjustedMonthIndex + 1, 0);
      const nextDrawDate = lastDayOfNextMonth.toISOString().split('T')[0];

      console.log(`Current date: ${today.toISOString()}, calculating next draw date as: ${nextDrawDate}`);
      
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

    // Fetch the lucky dip winners count from settings
    const { data: luckyDipCountSetting } = await supabaseClient
      .from('lottery_settings')
      .select('setting_value')
      .eq('setting_key', 'lucky_dip_winners_count')
      .maybeSingle();
    
    const luckyDipWinnersCount = luckyDipCountSetting ? Number(luckyDipCountSetting.setting_value) : 5;
    console.log(`Lucky dip winners count setting: ${luckyDipWinnersCount}`);

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

    // Select random lucky dip winners from all entries (excluding jackpot winners)
    const eligibleForLuckyDip = entries?.filter(entry => 
      !jackpotWinners.some(winner => winner.id === entry.id)
    ) || [];

    const luckyDipWinners = [];
    const usedUserIds = new Set();
    
    // Shuffle eligible entries and select up to configured number of unique users
    const shuffled = [...eligibleForLuckyDip].sort(() => 0.5 - Math.random());
    
    for (const entry of shuffled) {
      if (luckyDipWinners.length >= luckyDipWinnersCount) break;
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
          isJackpot: true,
          isLuckyDip: false
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
          isJackpot: false,
          isLuckyDip: true
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
        details: (error as Error).message 
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