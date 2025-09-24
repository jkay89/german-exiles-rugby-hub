-- Clear existing draws for fresh test
DELETE FROM lottery_results WHERE draw_id IN (SELECT id FROM lottery_draws);
DELETE FROM lottery_draws;

-- Insert fresh test data with existing user IDs
INSERT INTO lottery_entries (user_id, numbers, draw_date, created_at) VALUES
('899d2d53-5b87-4f03-84b7-72430b7d0b2a', ARRAY[1, 2, 3, 4], CURRENT_DATE, NOW()),
('9208a8bc-6a51-4ae8-a998-8b6d58123e99', ARRAY[5, 6, 7, 8], CURRENT_DATE, NOW()),
('45b37d2e-84c6-4bf8-98a0-f722db84c1ca', ARRAY[9, 10, 11, 12], CURRENT_DATE, NOW()),
('baf257dc-2a6d-4b59-8075-d507a54b05f7', ARRAY[13, 14, 15, 16], CURRENT_DATE, NOW()),
('899d2d53-5b87-4f03-84b7-72430b7d0b2a', ARRAY[17, 18, 19, 20], CURRENT_DATE, NOW());

-- Conduct new draw
SELECT net.http_post(
  url := 'https://hmjwfnsygwzijjgrygia.supabase.co/functions/v1/conduct-lottery-draw',
  headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtandmbnN5Z3d6aWpqZ3J5Z2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Njc4NzQsImV4cCI6MjA2MTE0Mzg3NH0.2Dq0R0-LZ4mjT0Wi5oueCIGOh__GDwoY7fJx4-YPEPo"}'::jsonb,
  body := json_build_object(
    'drawDate', CURRENT_DATE,
    'jackpotAmount', 200,
    'isTestDraw', true
  )::jsonb
);