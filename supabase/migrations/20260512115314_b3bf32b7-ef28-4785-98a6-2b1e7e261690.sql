ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes text;
INSERT INTO public.shipping_rates (name, rate, shipping_type, is_active)
SELECT 'Collect in person', 0, 'collect', true
WHERE NOT EXISTS (SELECT 1 FROM public.shipping_rates WHERE shipping_type = 'collect');