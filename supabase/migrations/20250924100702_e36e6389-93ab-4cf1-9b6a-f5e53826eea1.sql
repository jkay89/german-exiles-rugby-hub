-- Set next draw to happen in 5 minutes from now
UPDATE public.lottery_settings 
SET setting_value = CURRENT_DATE::text,
updated_at = now()
WHERE setting_key = 'next_draw_date';

-- Set draw time to 5 minutes from now
UPDATE public.lottery_settings 
SET setting_value = TO_CHAR(NOW() + INTERVAL '5 minutes', 'HH24:MI'),
updated_at = now()
WHERE setting_key = 'draw_time';