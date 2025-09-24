-- Reset lottery system and set up for 13:00 draw today
DELETE FROM lottery_results WHERE draw_id IN (SELECT id FROM lottery_draws WHERE is_test_draw = false);
DELETE FROM lottery_draws WHERE is_test_draw = false;

-- Update lottery settings for 13:00 draw today
UPDATE lottery_settings 
SET setting_value = '13:00'
WHERE setting_key = 'draw_time';

UPDATE lottery_settings 
SET setting_value = '2025-09-24'
WHERE setting_key = 'next_draw_date';

-- Increase jackpot for excitement
UPDATE lottery_settings 
SET setting_value = '200'
WHERE setting_key = 'current_jackpot';