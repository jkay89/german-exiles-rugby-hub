-- Create Eoin's entry for February 28th draw
INSERT INTO lottery_entries (
  user_id,
  numbers,
  line_number,
  draw_date,
  is_active,
  stripe_subscription_id
) VALUES (
  '083e799e-995f-41c6-b996-fd6556db5bd9',
  ARRAY[10, 13, 24, 25],
  1,
  '2026-02-28',
  true,
  'sub_1Smi4HBMVhaJwA6Cj09n7YsJ'
);