-- Set next draw for 11:20 today
UPDATE public.lottery_settings 
SET setting_value = CURRENT_DATE::text,
updated_at = now()
WHERE setting_key = 'next_draw_date';

UPDATE public.lottery_settings 
SET setting_value = '11:20',
updated_at = now()
WHERE setting_key = 'draw_time';