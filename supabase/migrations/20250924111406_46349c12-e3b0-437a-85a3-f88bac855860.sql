-- Test lucky dip email sending directly
SELECT net.http_post(
  url := 'https://hmjwfnsygwzijjgrygia.supabase.co/functions/v1/debug-lucky-dip-email',
  headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtandmbnN5Z3d6aWpqZ3J5Z2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Njc4NzQsImV4cCI6MjA2MTE0Mzg3NH0.2Dq0R0-LZ4mjT0Wi5oueCIGOh__GDwoY7fJx4-YPEPo"}'::jsonb,
  body := json_build_object(
    'drawId', (SELECT id FROM lottery_draws WHERE is_test_draw = true ORDER BY created_at DESC LIMIT 1),
    'winners', json_build_array(
      json_build_object('userId', '9208a8bc-6a51-4ae8-a998-8b6d58123e99', 'type', 'lucky_dip', 'prizeAmount', 10),
      json_build_object('userId', '45b37d2e-84c6-4bf8-98a0-f722db84c1ca', 'type', 'lucky_dip', 'prizeAmount', 10),
      json_build_object('userId', 'baf257dc-2a6d-4b59-8075-d507a54b05f7', 'type', 'lucky_dip', 'prizeAmount', 10),
      json_build_object('userId', '899d2d53-5b87-4f03-84b7-72430b7d0b2a', 'type', 'lucky_dip', 'prizeAmount', 10)
    )
  )::jsonb
);