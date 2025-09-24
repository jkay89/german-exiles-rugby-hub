-- Update next draw date to today for the live draw
UPDATE lottery_settings 
SET setting_value = CURRENT_DATE::text 
WHERE setting_key = 'next_draw_date';