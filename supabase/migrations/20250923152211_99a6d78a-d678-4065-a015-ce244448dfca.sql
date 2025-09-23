-- Create lottery promo codes table
CREATE TABLE public.lottery_promo_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code_name text NOT NULL UNIQUE,
  reason text NOT NULL,
  discount_percentage integer NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  is_active boolean NOT NULL DEFAULT true,
  usage_limit integer DEFAULT NULL,
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamp with time zone DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lottery_promo_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active promo codes" 
ON public.lottery_promo_codes 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage promo codes" 
ON public.lottery_promo_codes 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create trigger for updated_at
CREATE TRIGGER update_lottery_promo_codes_updated_at
BEFORE UPDATE ON public.lottery_promo_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_lottery_updated_at();