-- Remove the trigger that's causing the net extension error
DROP TRIGGER IF EXISTS trigger_notify_lottery_winners ON public.lottery_draws;

-- Remove the function that uses net extension since we handle notifications in edge functions
DROP FUNCTION IF EXISTS public.notify_lottery_winners();