-- Schedule new draw for today at 14:25 and move all entries to this draw
-- First, clear any existing draws and results for today to prevent conflicts
DELETE FROM lottery_results WHERE draw_id IN (
  SELECT id FROM lottery_draws WHERE draw_date = CURRENT_DATE
);
DELETE FROM lottery_draws WHERE draw_date = CURRENT_DATE;

-- Delete any existing lottery entries for today to prevent duplicate constraint violations
DELETE FROM lottery_entries WHERE draw_date = CURRENT_DATE;

-- Update lottery settings for today's draw at 14:25
UPDATE lottery_settings 
SET setting_value = CURRENT_DATE::text 
WHERE setting_key = 'next_draw_date';

UPDATE lottery_settings 
SET setting_value = '14:25' 
WHERE setting_key = 'draw_time';

-- Move all active lottery entries to today's draw date
UPDATE lottery_entries 
SET draw_date = CURRENT_DATE,
    updated_at = NOW()
WHERE is_active = true AND draw_date != CURRENT_DATE;