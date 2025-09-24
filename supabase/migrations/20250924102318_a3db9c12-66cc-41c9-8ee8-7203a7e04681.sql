-- Reset next draw to 11:24 today
UPDATE public.lottery_settings 
SET setting_value = '11:24', 
    updated_at = now()
WHERE setting_key = 'draw_time';

-- Ensure next draw date is today
UPDATE public.lottery_settings 
SET setting_value = '2025-09-24', 
    updated_at = now()
WHERE setting_key = 'next_draw_date';