-- Add more content sections for different pages

-- About page sections
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('about_hero_title', 'About Hero Title', 'about', 'text', 'About Us', 'About Us', true, 1),
('about_hero_subtitle', 'About Hero Subtitle', 'about', 'textarea', 'Learn more about our club', 'Learn more about our club', true, 2),
('about_main_content', 'Main About Content', 'about', 'richtext', 'We are a passionate rugby club...', 'We are a passionate rugby club...', true, 3),
('about_image', 'About Image', 'about', 'image', '', '', true, 4),
('about_mission_title', 'Mission Title', 'about', 'text', 'Our Mission', 'Our Mission', true, 5),
('about_mission_text', 'Mission Text', 'about', 'richtext', 'To promote rugby excellence...', 'To promote rugby excellence...', true, 6)
ON CONFLICT (section_key) DO NOTHING;

-- Sponsors page sections
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('sponsors_hero_title', 'Sponsors Hero Title', 'sponsors', 'text', 'Our Sponsors', 'Our Sponsors', true, 1),
('sponsors_intro_text', 'Introduction Text', 'sponsors', 'richtext', 'Thank you to our amazing sponsors...', 'Thank you to our amazing sponsors...', true, 2),
('sponsors_cta_enabled', 'Show Become Sponsor CTA', 'sponsors', 'boolean', 'true', 'true', true, 3),
('sponsors_cta_title', 'CTA Title', 'sponsors', 'text', 'Become a Sponsor', 'Become a Sponsor', true, 4),
('sponsors_cta_text', 'CTA Text', 'sponsors', 'richtext', 'Support our club by becoming a sponsor', 'Support our club by becoming a sponsor', true, 5)
ON CONFLICT (section_key) DO NOTHING;

-- Contact page sections
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('contact_hero_title', 'Contact Hero Title', 'contact', 'text', 'Get In Touch', 'Get In Touch', true, 1),
('contact_subtitle', 'Contact Subtitle', 'contact', 'textarea', 'Have a question? We''d love to hear from you', 'Have a question? We''d love to hear from you', true, 2),
('contact_info_text', 'Contact Information Text', 'contact', 'richtext', 'Reach out to us using the form below', 'Reach out to us using the form below', true, 3),
('contact_email', 'Contact Email', 'contact', 'text', 'info@club.com', 'info@club.com', true, 4),
('contact_phone', 'Contact Phone', 'contact', 'text', '+44 123 456 7890', '+44 123 456 7890', true, 5),
('contact_address', 'Address', 'contact', 'textarea', 'Club Address Here', 'Club Address Here', true, 6)
ON CONFLICT (section_key) DO NOTHING;

-- News page sections
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('news_hero_title', 'News Hero Title', 'news', 'text', 'Latest News', 'Latest News', true, 1),
('news_subtitle', 'News Subtitle', 'news', 'textarea', 'Stay up to date with club news', 'Stay up to date with club news', true, 2),
('news_featured_enabled', 'Show Featured Article', 'news', 'boolean', 'true', 'true', true, 3)
ON CONFLICT (section_key) DO NOTHING;

-- Fixtures page sections
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('fixtures_hero_title', 'Fixtures Hero Title', 'fixtures', 'text', 'Fixtures & Results', 'Fixtures & Results', true, 1),
('fixtures_subtitle', 'Fixtures Subtitle', 'fixtures', 'textarea', 'View upcoming matches and past results', 'View upcoming matches and past results', true, 2)
ON CONFLICT (section_key) DO NOTHING;