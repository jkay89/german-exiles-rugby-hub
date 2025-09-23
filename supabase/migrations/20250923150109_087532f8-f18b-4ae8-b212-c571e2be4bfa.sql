-- Create lottery settings table for managing current jackpot and other settings
CREATE TABLE public.lottery_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lottery_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view lottery settings" 
ON public.lottery_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage lottery settings" 
ON public.lottery_settings 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Insert default current jackpot setting
INSERT INTO public.lottery_settings (setting_key, setting_value) 
VALUES ('current_jackpot', '1000');

-- Create trigger for updated_at
CREATE TRIGGER update_lottery_settings_updated_at
BEFORE UPDATE ON public.lottery_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_lottery_updated_at();