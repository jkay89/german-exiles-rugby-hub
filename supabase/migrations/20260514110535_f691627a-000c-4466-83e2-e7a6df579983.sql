
CREATE TABLE public.kaiser_cup_event (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text,
  event_date date,
  event_time text,
  venue text,
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kaiser_cup_event ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view kaiser cup event"
  ON public.kaiser_cup_event FOR SELECT USING (true);

CREATE POLICY "Admins can manage kaiser cup event"
  ON public.kaiser_cup_event FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE TRIGGER kaiser_cup_event_updated_at
  BEFORE UPDATE ON public.kaiser_cup_event
  FOR EACH ROW EXECUTE FUNCTION public.update_lottery_updated_at();

INSERT INTO public.kaiser_cup_event (description) VALUES (
'The Kaiser Cup is an annual rugby league event created by the German Exiles and the Germany Rugby League programme. It provides a competitive platform for UK-based amateur players with German heritage to showcase their ability and earn selection to represent Germany under International Rugby League eligibility rules.

In its first year in 2025, the Kaiser Cup proved to be an immediate success, with seven German Exiles players selected to represent Germany. Those players went on to play a key role in the national team''s successful campaign, helping Germany win their group and secure promotion.

The Kaiser Cup is more than just a match. It serves as a vital talent identification pathway for Germany Rugby League and a fundraising platform for the German Exiles programme. Sponsorship and fundraising income is reinvested into player development, travel costs, and preparations for future seasons, giving eligible players the opportunity to progress from the UK amateur game to the international stage.'
);

CREATE TABLE public.kaiser_cup_sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website_url text,
  category text NOT NULL DEFAULT 'main',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kaiser_cup_sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view kaiser cup sponsors"
  ON public.kaiser_cup_sponsors FOR SELECT USING (true);

CREATE POLICY "Admins can manage kaiser cup sponsors"
  ON public.kaiser_cup_sponsors FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE TRIGGER kaiser_cup_sponsors_updated_at
  BEFORE UPDATE ON public.kaiser_cup_sponsors
  FOR EACH ROW EXECUTE FUNCTION public.update_lottery_updated_at();
