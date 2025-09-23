-- Update the function to fix the search path security issue
CREATE OR REPLACE FUNCTION public.notify_lottery_winners()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Call the edge function using pg_net
  PERFORM
    net.http_post(
      url := 'https://hmjwfnsygwzijjgrygia.supabase.co/functions/v1/notify-lottery-winners',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtandmbnN5Z3d6aWpqZ3J5Z2lhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTU2Nzg3NCwiZXhwIjoyMDYxMTQzODc0fQ.z7P4m6EBljEeJUy56X1NmYmgCi5sUTooFBHN-wR6WbQ'
      ),
      body := jsonb_build_object('draw_id', NEW.id::text)
    );
  
  RETURN NEW;
END;
$$;