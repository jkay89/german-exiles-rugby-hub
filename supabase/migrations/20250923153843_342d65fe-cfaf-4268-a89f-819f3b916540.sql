-- Create a function to safely increment promo code usage
CREATE OR REPLACE FUNCTION public.increment_promo_usage(promo_name TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.lottery_promo_codes 
  SET used_count = used_count + 1 
  WHERE code_name = promo_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;