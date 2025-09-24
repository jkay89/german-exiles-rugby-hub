-- Clear previous draw results and run new draw
DELETE FROM lottery_results WHERE draw_id IN (SELECT id FROM lottery_draws WHERE is_test_draw = false);
DELETE FROM lottery_draws WHERE is_test_draw = false;

-- Check current active entries count
DO $$
DECLARE
    entry_count integer;
BEGIN
    SELECT COUNT(*) INTO entry_count 
    FROM lottery_entries 
    WHERE draw_date = '2025-09-24' AND is_active = true;
    
    RAISE NOTICE 'Current active entries for today: %', entry_count;
END $$;