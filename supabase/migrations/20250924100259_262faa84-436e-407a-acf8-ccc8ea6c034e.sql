-- Reset next draw date to end of month instead of today
UPDATE public.lottery_settings 
SET setting_value = (
  SELECT TO_CHAR(
    DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') - INTERVAL '1 day', 
    'YYYY-MM-DD'
  )
),
updated_at = now()
WHERE setting_key = 'next_draw_date';

-- Reset draw time back to evening
UPDATE public.lottery_settings 
SET setting_value = '19:50',
updated_at = now()
WHERE setting_key = 'draw_time';