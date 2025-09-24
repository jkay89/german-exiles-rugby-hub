-- Schedule next draw for today at 14:15 and move all entries to this draw
-- Update lottery settings for today's draw at 14:15
UPDATE lottery_settings 
SET setting_value = CURRENT_DATE::text 
WHERE setting_key = 'next_draw_date';

UPDATE lottery_settings 
SET setting_value = '14:15' 
WHERE setting_key = 'draw_time';

-- Move all active lottery entries to today's draw date
UPDATE lottery_entries 
SET draw_date = CURRENT_DATE,
    updated_at = NOW()
WHERE is_active = true;

-- Clear any existing draws for today to prevent conflicts
DELETE FROM lottery_results WHERE draw_id IN (
  SELECT id FROM lottery_draws WHERE draw_date = CURRENT_DATE
);
DELETE FROM lottery_draws WHERE draw_date = CURRENT_DATE;