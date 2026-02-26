
-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  has_sizes BOOLEAN NOT NULL DEFAULT false,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all products" ON public.products
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (is_admin(auth.uid()));

-- Product sizes table
CREATE TABLE public.product_sizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product sizes" ON public.product_sizes
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product sizes" ON public.product_sizes
  FOR ALL USING (is_admin(auth.uid()));

-- Shipping rates table
CREATE TABLE public.shipping_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rate NUMERIC NOT NULL DEFAULT 0,
  shipping_type TEXT NOT NULL DEFAULT 'standard',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active shipping rates" ON public.shipping_rates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage shipping rates" ON public.shipping_rates
  FOR ALL USING (is_admin(auth.uid()));

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipping_address_line1 TEXT NOT NULL,
  shipping_address_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_postcode TEXT NOT NULL,
  shipping_country TEXT NOT NULL DEFAULT 'GB',
  shipping_type TEXT NOT NULL DEFAULT 'standard',
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL USING (is_admin(auth.uid()));

-- Order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  size TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage order items" ON public.order_items
  FOR ALL USING (is_admin(auth.uid()));

-- Insert default shipping rates
INSERT INTO public.shipping_rates (name, rate, shipping_type) VALUES
  ('Standard Delivery (3-5 days)', 4.99, 'standard'),
  ('Next Day Delivery', 9.99, 'next_day'),
  ('International Shipping', 14.99, 'international');

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_lottery_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_lottery_updated_at();

CREATE TRIGGER update_shipping_rates_updated_at
  BEFORE UPDATE ON public.shipping_rates
  FOR EACH ROW EXECUTE FUNCTION public.update_lottery_updated_at();

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
