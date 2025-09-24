-- Clean up duplicate draws - keep only the most recent one per date
DELETE FROM public.lottery_draws 
WHERE id NOT IN (
  SELECT DISTINCT ON (draw_date, is_test_draw) id 
  FROM public.lottery_draws 
  WHERE is_test_draw = false 
  ORDER BY draw_date, is_test_draw, created_at DESC
)
AND is_test_draw = false;