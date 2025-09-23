-- Create current jackpot setting if it doesn't exist
INSERT INTO public.lottery_settings (setting_key, setting_value)
VALUES ('current_jackpot', '50000')
ON CONFLICT (setting_key) DO NOTHING;