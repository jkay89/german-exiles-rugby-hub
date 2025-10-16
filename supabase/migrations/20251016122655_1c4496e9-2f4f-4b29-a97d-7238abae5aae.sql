-- Create site content management tables

-- Table for editable content sections
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  section_label TEXT NOT NULL,
  page TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'textarea', 'richtext', 'image', 'boolean')),
  content_value TEXT,
  published_value TEXT,
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for custom pages (template-based)
CREATE TABLE public.site_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL UNIQUE,
  page_title TEXT NOT NULL,
  page_path TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL DEFAULT 'default',
  is_active BOOLEAN DEFAULT true,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_content
CREATE POLICY "Anyone can view published content"
  ON public.site_content
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all content"
  ON public.site_content
  FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage content"
  ON public.site_content
  FOR ALL
  USING (is_admin(auth.uid()));

-- RLS Policies for site_pages
CREATE POLICY "Anyone can view active pages"
  ON public.site_pages
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage pages"
  ON public.site_pages
  FOR ALL
  USING (is_admin(auth.uid()));

-- Insert initial content sections for the home page
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('hero_title', 'Hero Title', 'home', 'text', 'Welcome to the Club', 'Welcome to the Club', true, 1),
('hero_subtitle', 'Hero Subtitle', 'home', 'textarea', 'Where passion meets performance', 'Where passion meets performance', true, 2),
('hero_video_enabled', 'Show Hero Video', 'home', 'boolean', 'true', 'true', true, 3),
('about_title', 'About Section Title', 'home', 'text', 'About Us', 'About Us', true, 10),
('about_text', 'About Section Text', 'home', 'richtext', 'We are a rugby club dedicated to excellence.', 'We are a rugby club dedicated to excellence.', true, 11),
('features_enabled', 'Show Features Section', 'home', 'boolean', 'true', 'true', true, 20);

-- Create trigger for updating timestamps
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lottery_updated_at();

CREATE TRIGGER update_site_pages_updated_at
  BEFORE UPDATE ON public.site_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lottery_updated_at();