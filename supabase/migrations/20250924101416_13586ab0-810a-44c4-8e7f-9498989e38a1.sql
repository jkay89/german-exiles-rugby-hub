-- Create a partial unique index to prevent multiple real draws on the same date
CREATE UNIQUE INDEX unique_real_draw_per_date 
ON public.lottery_draws (draw_date) 
WHERE is_test_draw = false;