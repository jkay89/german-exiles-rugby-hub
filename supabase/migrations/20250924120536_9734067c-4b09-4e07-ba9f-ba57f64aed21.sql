-- Trigger new lottery draw with current entries
DO $$
DECLARE
    draw_response jsonb;
    jackpot_amount numeric := 250;
    draw_date_val date := '2025-09-24';
BEGIN
    -- Make HTTP call to conduct-lottery-draw edge function
    SELECT net.http_post(
        url := 'https://hmjwfnsygwzijjgrygia.supabase.co/functions/v1/conduct-lottery-draw',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtandmbnN5Z3d6aWpqZ3J5Z2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Njc4NzQsImV4cCI6MjA2MTE0Mzg3NH0.2Dq0R0-LZ4mjT0Wi5oueCIGOh__GDwoY7fJx4-YPEPo"}'::jsonb,
        body := json_build_object(
            'drawDate', draw_date_val,
            'jackpotAmount', jackpot_amount,
            'isTestDraw', false
        )::jsonb
    ) INTO draw_response;
    
    RAISE NOTICE 'NEW LOTTERY DRAW TRIGGERED: %', draw_response;
END $$;