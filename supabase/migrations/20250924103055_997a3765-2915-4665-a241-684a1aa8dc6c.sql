-- Clear ALL draws for today (both test and real) for clean testing
DELETE FROM public.lottery_results WHERE draw_id IN (
  SELECT id FROM lottery_draws WHERE draw_date = '2025-09-24'
);

DELETE FROM public.lottery_draws WHERE draw_date = '2025-09-24';