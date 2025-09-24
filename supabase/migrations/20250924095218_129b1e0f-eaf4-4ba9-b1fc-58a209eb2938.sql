-- Set next draw date to today and time to 11am for live test
INSERT INTO public.lottery_settings (setting_key, setting_value)
VALUES 
  ('next_draw_date', CURRENT_DATE::text),
  ('draw_time', '11:00')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();