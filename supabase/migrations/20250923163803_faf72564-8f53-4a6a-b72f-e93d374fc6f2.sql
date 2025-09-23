-- Add unique constraint on user_id for lottery_subscriptions table
-- This will allow the upsert operation in the process-lottery-purchase function to work properly
ALTER TABLE lottery_subscriptions 
ADD CONSTRAINT lottery_subscriptions_user_id_unique UNIQUE (user_id);