-- Fix the function to have a secure search path
CREATE OR REPLACE FUNCTION public.increment_promo_usage(promo_name TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.lottery_promo_codes 
  SET used_count = used_count + 1 
  WHERE code_name = promo_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;