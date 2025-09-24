-- Remove latest draw results and reset for next draw at 12:50
DELETE FROM lottery_results WHERE draw_id IN (SELECT id FROM lottery_draws WHERE is_test_draw = false);
DELETE FROM lottery_draws WHERE is_test_draw = false;

-- Update lottery settings for next draw at 12:50
UPDATE lottery_settings 
SET setting_value = '12:50'
WHERE setting_key = 'draw_time';

UPDATE lottery_settings 
SET setting_value = '2025-09-24'
WHERE setting_key = 'next_draw_date';

-- Ensure we have current jackpot set
INSERT INTO lottery_settings (setting_key, setting_value) 
VALUES ('current_jackpot', '150') 
ON CONFLICT (setting_key) DO UPDATE SET setting_value = '150';