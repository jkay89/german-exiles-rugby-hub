-- Clean up duplicate entries for subscriptions
-- Keep only the most recent entry for each subscription + draw_date combination
WITH duplicates AS (
  SELECT id, 
         ROW_NUMBER() OVER (
           PARTITION BY user_id, stripe_subscription_id, draw_date 
           ORDER BY created_at DESC
         ) as rn
  FROM lottery_entries 
  WHERE stripe_subscription_id IS NOT NULL 
    AND stripe_subscription_id != ''
)
DELETE FROM lottery_entries 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);