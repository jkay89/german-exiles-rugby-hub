-- Debug Resend API with detailed logging
SELECT net.http_post(
  url := 'https://hmjwfnsygwzijjgrygia.supabase.co/functions/v1/resend-debug-test',
  headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtandmbnN5Z3d6aWpqZ3J5Z2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Njc4NzQsImV4cCI6MjA2MTE0Mzg3NH0.2Dq0R0-LZ4mjT0Wi5oueCIGOh__GDwoY7fJx4-YPEPo"}'::jsonb,
  body := json_build_object(
    'to', 'jay@germanexilesrl.co.uk'
  )::jsonb
);