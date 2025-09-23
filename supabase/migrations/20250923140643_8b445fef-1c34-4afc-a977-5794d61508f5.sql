-- Fix RLS issues by enabling RLS on all public tables that don't have it
-- Enable RLS on all public tables that need it
ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Update existing functions to have proper search path
CREATE OR REPLACE FUNCTION public.update_lottery_updated_at()
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