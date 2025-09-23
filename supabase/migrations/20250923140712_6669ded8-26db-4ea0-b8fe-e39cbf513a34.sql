-- Enable RLS on player_stats table which still has it disabled
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

-- Fix the remaining function search path issue
CREATE OR REPLACE FUNCTION public.update_player_stats_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;