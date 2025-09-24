-- Clear existing draws for fresh test
DELETE FROM lottery_results WHERE draw_id IN (SELECT id FROM lottery_draws);
DELETE FROM lottery_draws;

-- Conduct new draw directly
SELECT net.http_post(
  url := 'https://hmjwfnsygwzijjgrygia.supabase.co/functions/v1/conduct-lottery-draw',
  headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtandmbnN5Z3d6aWpqZ3J5Z2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Njc4NzQsImV4cCI6MjA2MTE0Mzg3NH0.2Dq0R0-LZ4mjT0Wi5oueCIGOh__GDwoY7fJx4-YPEPo"}'::jsonb,
  body := json_build_object(
    'drawDate', CURRENT_DATE,
    'jackpotAmount', 200,
    'isTestDraw', true
  )::jsonb
);