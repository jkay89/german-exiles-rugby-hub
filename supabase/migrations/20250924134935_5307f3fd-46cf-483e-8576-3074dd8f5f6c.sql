-- Clear all existing lottery entries and subscriptions
DELETE FROM lottery_results;
DELETE FROM lottery_entries;
DELETE FROM lottery_subscriptions;

-- Update next draw date to end of current month
UPDATE lottery_settings 
SET setting_value = (
  SELECT TO_CHAR(
    (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE, 
    'YYYY-MM-DD'
  )
) 
WHERE setting_key = 'next_draw_date';

-- Update draw time to end of month at 8 PM
UPDATE lottery_settings 
SET setting_value = '20:00'
WHERE setting_key = 'draw_time';

-- Add or update setting for draw schedule type
INSERT INTO lottery_settings (setting_key, setting_value, created_at, updated_at)
VALUES ('draw_schedule', 'end_of_month', NOW(), NOW())
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = 'end_of_month',
  updated_at = NOW();