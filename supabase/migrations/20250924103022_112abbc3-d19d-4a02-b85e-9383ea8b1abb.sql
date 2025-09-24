-- Clear existing draws for today to allow fresh testing
DELETE FROM public.lottery_results WHERE draw_id IN (
  SELECT id FROM lottery_draws WHERE draw_date = '2025-09-24' AND is_test_draw = false
);

DELETE FROM public.lottery_draws WHERE draw_date = '2025-09-24' AND is_test_draw = false;