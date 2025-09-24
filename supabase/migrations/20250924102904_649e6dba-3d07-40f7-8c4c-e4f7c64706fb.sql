-- Set next draw to 11:30 today for full system test
UPDATE public.lottery_settings 
SET setting_value = '11:30', 
    updated_at = now()
WHERE setting_key = 'draw_time';

-- Ensure next draw date is today  
UPDATE public.lottery_settings 
SET setting_value = '2025-09-24', 
    updated_at = now()
WHERE setting_key = 'next_draw_date';

-- Ensure all lottery entries are active and set for today's draw
UPDATE public.lottery_entries 
SET draw_date = '2025-09-24', 
    is_active = true,
    updated_at = now()
WHERE is_active = true;