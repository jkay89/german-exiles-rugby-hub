-- Update existing lottery entries to today's date so they can participate in the draw
UPDATE public.lottery_entries 
SET draw_date = CURRENT_DATE 
WHERE draw_date = '2025-09-30';