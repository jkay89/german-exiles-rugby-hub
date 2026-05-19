ALTER TABLE public.fixture_tickets
DROP CONSTRAINT IF EXISTS fixture_tickets_ticket_type_check;

ALTER TABLE public.fixture_tickets
ADD CONSTRAINT fixture_tickets_ticket_type_check
CHECK (ticket_type = ANY (ARRAY['adult'::text, 'concession'::text, 'child'::text, 'family'::text, 'hospitality'::text]));