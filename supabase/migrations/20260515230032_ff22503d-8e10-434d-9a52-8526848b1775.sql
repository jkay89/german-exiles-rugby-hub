
-- Add tickets_on_sale flag to fixtures
ALTER TABLE public.fixtures
ADD COLUMN IF NOT EXISTS tickets_on_sale boolean NOT NULL DEFAULT false;

-- Per-fixture ticket pricing
CREATE TABLE IF NOT EXISTS public.fixture_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id uuid NOT NULL REFERENCES public.fixtures(id) ON DELETE CASCADE,
  ticket_type text NOT NULL CHECK (ticket_type IN ('adult','concession','child','family')),
  price numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (fixture_id, ticket_type)
);

ALTER TABLE public.fixture_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active fixture tickets"
ON public.fixture_tickets FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage fixture tickets"
ON public.fixture_tickets FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER update_fixture_tickets_updated_at
BEFORE UPDATE ON public.fixture_tickets
FOR EACH ROW EXECUTE FUNCTION public.update_lottery_updated_at();

-- Ticket orders
CREATE TABLE IF NOT EXISTS public.ticket_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id uuid NOT NULL REFERENCES public.fixtures(id) ON DELETE RESTRICT,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  subtotal numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  stripe_payment_intent_id text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all ticket orders"
ON public.ticket_orders FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage ticket orders"
ON public.ticket_orders FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER update_ticket_orders_updated_at
BEFORE UPDATE ON public.ticket_orders
FOR EACH ROW EXECUTE FUNCTION public.update_lottery_updated_at();

-- Ticket order items
CREATE TABLE IF NOT EXISTS public.ticket_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.ticket_orders(id) ON DELETE CASCADE,
  ticket_type text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all ticket order items"
ON public.ticket_order_items FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage ticket order items"
ON public.ticket_order_items FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_fixture_tickets_fixture ON public.fixture_tickets(fixture_id);
CREATE INDEX IF NOT EXISTS idx_ticket_orders_fixture ON public.ticket_orders(fixture_id);
CREATE INDEX IF NOT EXISTS idx_ticket_order_items_order ON public.ticket_order_items(order_id);
