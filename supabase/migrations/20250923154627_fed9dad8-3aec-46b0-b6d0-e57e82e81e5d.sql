-- Add draw_date column to lottery_entries to track which draw the numbers are for
ALTER TABLE public.lottery_entries 
ADD COLUMN draw_date DATE;

-- Set default draw_date for existing entries (current month's draw)
UPDATE public.lottery_entries 
SET draw_date = DATE(DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')
WHERE draw_date IS NULL;

-- Make draw_date NOT NULL for future entries
ALTER TABLE public.lottery_entries 
ALTER COLUMN draw_date SET NOT NULL;