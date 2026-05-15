
CREATE TABLE public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  fixture_id uuid NOT NULL,
  ticket_type text NOT NULL,
  holder_name text,
  is_used boolean NOT NULL DEFAULT false,
  used_at timestamptz,
  scanned_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tickets_order_id ON public.tickets(order_id);
CREATE INDEX idx_tickets_fixture_id ON public.tickets(fixture_id);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tickets"
  ON public.tickets FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));
