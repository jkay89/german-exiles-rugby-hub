-- Add a column to distinguish test draws from real draws
ALTER TABLE public.lottery_draws 
ADD COLUMN is_test_draw boolean NOT NULL DEFAULT false;

-- Update existing draws to mark them as test draws if they were created today
-- (assuming recent draws are test draws)
UPDATE public.lottery_draws 
SET is_test_draw = true 
WHERE draw_date = CURRENT_DATE;