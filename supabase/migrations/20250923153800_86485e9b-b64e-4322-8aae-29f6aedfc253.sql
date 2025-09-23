-- Remove the existing constraint that's causing issues
ALTER TABLE public.lottery_entries DROP CONSTRAINT IF EXISTS lottery_entries_numbers_check;

-- Add a more flexible constraint that allows arrays of integers between 1 and 49
ALTER TABLE public.lottery_entries 
ADD CONSTRAINT lottery_entries_numbers_check 
CHECK (
  array_length(numbers, 1) BETWEEN 1 AND 6 AND
  numbers <@ ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49]
);