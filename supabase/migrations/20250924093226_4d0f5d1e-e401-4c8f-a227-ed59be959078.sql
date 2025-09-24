-- Drop the existing constraint that expects 6 numbers
ALTER TABLE public.lottery_draws 
DROP CONSTRAINT lottery_draws_winning_numbers_check;

-- Add new constraint that expects 4 numbers (correct for our lottery)
ALTER TABLE public.lottery_draws 
ADD CONSTRAINT lottery_draws_winning_numbers_check 
CHECK (array_length(winning_numbers, 1) = 4);