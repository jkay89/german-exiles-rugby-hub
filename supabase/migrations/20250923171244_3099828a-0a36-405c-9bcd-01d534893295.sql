-- Add unique constraint to prevent duplicate entries for same user, subscription, line, and draw date
ALTER TABLE lottery_entries 
ADD CONSTRAINT unique_subscription_entry 
UNIQUE (user_id, stripe_subscription_id, line_number, draw_date);