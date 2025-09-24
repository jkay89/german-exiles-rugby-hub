-- Update the trigger_automatic_draw function to use end of month schedule
CREATE OR REPLACE FUNCTION public.trigger_automatic_draw()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  draw_date_val date;
  draw_time_val text;
  current_timestamp_val timestamp with time zone;
  draw_datetime timestamp with time zone;
  existing_draw_count int;
  jackpot_val numeric;
BEGIN
  -- Get next draw settings (should be end of month)
  SELECT setting_value::date INTO draw_date_val
  FROM lottery_settings 
  WHERE setting_key = 'next_draw_date';
  
  SELECT setting_value INTO draw_time_val
  FROM lottery_settings 
  WHERE setting_key = 'draw_time';
  
  -- Exit if no settings found
  IF draw_date_val IS NULL OR draw_time_val IS NULL THEN
    RAISE NOTICE 'No draw date or time settings found';
    RETURN;
  END IF;
  
  -- Combine date and time
  draw_datetime := (draw_date_val || ' ' || draw_time_val || ':00')::timestamp with time zone;
  current_timestamp_val := NOW();
  
  -- Check if it's time for the draw (within 1 minute window)
  IF current_timestamp_val >= draw_datetime 
     AND current_timestamp_val <= draw_datetime + INTERVAL '1 minute' THEN
    
    -- Check if draw already exists for this date
    SELECT COUNT(*) INTO existing_draw_count
    FROM lottery_draws 
    WHERE draw_date = draw_date_val AND is_test_draw = false;
    
    -- Only proceed if no draw exists yet
    IF existing_draw_count = 0 THEN
      -- Get current jackpot
      SELECT setting_value::numeric INTO jackpot_val
      FROM lottery_settings 
      WHERE setting_key = 'current_jackpot';
      
      RAISE NOTICE 'Triggering automatic draw for end-of-month date: %', draw_date_val;
      
      -- Trigger the draw via HTTP call
      PERFORM net.http_post(
        url := 'https://hmjwfnsygwzijjgrygia.supabase.co/functions/v1/conduct-lottery-draw',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtandmbnN5Z3d6aWpqZ3J5Z2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Njc4NzQsImV4cCI6MjA2MTE0Mzg3NH0.2Dq0R0-LZ4mjT0Wi5oueCIGOh__GDwoY7fJx4-YPEPo"}'::jsonb,
        body := json_build_object(
          'drawDate', draw_date_val,
          'jackpotAmount', COALESCE(jackpot_val, 100),
          'isTestDraw', false
        )::jsonb
      );
      
      RAISE NOTICE 'Automatic end-of-month draw triggered for date: %', draw_date_val;
    ELSE
      RAISE NOTICE 'Draw already exists for date: %, skipping automatic trigger', draw_date_val;
    END IF;
  ELSE
    RAISE NOTICE 'Not yet time for automatic draw. Current: %, Target: %', current_timestamp_val, draw_datetime;
  END IF;
END;
$function$;