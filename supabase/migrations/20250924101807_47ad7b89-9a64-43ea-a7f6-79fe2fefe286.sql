-- Update lottery entries from September 30, 2025 to today's date (September 24, 2025)
UPDATE public.lottery_entries 
SET draw_date = '2025-09-24', 
    updated_at = now()
WHERE draw_date = '2025-09-30';