-- Fix RLS issues for existing tables
ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Fix the existing function's search path
DROP FUNCTION IF EXISTS public.update_player_stats_updated_at();
CREATE OR REPLACE FUNCTION public.update_player_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;