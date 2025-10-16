-- Add content sections for all remaining pages

-- Heritage Team page
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('heritage_hero_title', 'Hero Title', 'heritage-team', 'text', 'Heritage Team', 'Heritage Team', true, 1),
('heritage_subtitle', 'Subtitle', 'heritage-team', 'textarea', 'Our first team roster', 'Our first team roster', true, 2),
('heritage_intro_text', 'Introduction Text', 'heritage-team', 'richtext', 'Meet our Heritage team players', 'Meet our Heritage team players', true, 3)
ON CONFLICT (section_key) DO NOTHING;

-- Community Team page
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('community_hero_title', 'Hero Title', 'community-team', 'text', 'Community Team', 'Community Team', true, 1),
('community_subtitle', 'Subtitle', 'community-team', 'textarea', 'Our second team roster', 'Our second team roster', true, 2),
('community_intro_text', 'Introduction Text', 'community-team', 'richtext', 'Meet our Community team players', 'Meet our Community team players', true, 3)
ON CONFLICT (section_key) DO NOTHING;

-- Exiles 9s page
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('exiles9s_hero_title', 'Hero Title', 'exiles-9s', 'text', 'Exiles 9s', 'Exiles 9s', true, 1),
('exiles9s_subtitle', 'Subtitle', 'exiles-9s', 'textarea', 'Our touch rugby team', 'Our touch rugby team', true, 2),
('exiles9s_intro_text', 'Introduction Text', 'exiles-9s', 'richtext', 'Meet our Exiles 9s players', 'Meet our Exiles 9s players', true, 3)
ON CONFLICT (section_key) DO NOTHING;

-- Coaching Team page
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('coaching_hero_title', 'Hero Title', 'coaching-team', 'text', 'Coaching Team', 'Coaching Team', true, 1),
('coaching_subtitle', 'Subtitle', 'coaching-team', 'textarea', 'Meet our coaching staff', 'Meet our coaching staff', true, 2),
('coaching_intro_text', 'Introduction Text', 'coaching-team', 'richtext', 'Our dedicated coaching team', 'Our dedicated coaching team', true, 3)
ON CONFLICT (section_key) DO NOTHING;

-- Committee Members page
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('committee_hero_title', 'Hero Title', 'committee-members', 'text', 'Committee Members', 'Committee Members', true, 1),
('committee_subtitle', 'Subtitle', 'committee-members', 'textarea', 'Meet our committee', 'Meet our committee', true, 2),
('committee_intro_text', 'Introduction Text', 'committee-members', 'richtext', 'The people who run the club', 'The people who run the club', true, 3)
ON CONFLICT (section_key) DO NOTHING;

-- Documents page
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('documents_hero_title', 'Hero Title', 'documents', 'text', 'Documents', 'Documents', true, 1),
('documents_subtitle', 'Subtitle', 'documents', 'textarea', 'Club documents and resources', 'Club documents and resources', true, 2),
('documents_intro_text', 'Introduction Text', 'documents', 'richtext', 'Access important club documents', 'Access important club documents', true, 3)
ON CONFLICT (section_key) DO NOTHING;

-- NRLD page
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('nrld_hero_title', 'Hero Title', 'nrld', 'text', 'NRLD', 'NRLD', true, 1),
('nrld_subtitle', 'Subtitle', 'nrld', 'textarea', 'National Rugby League Deutschland', 'National Rugby League Deutschland', true, 2),
('nrld_intro_text', 'Introduction Text', 'nrld', 'richtext', 'Learn about NRLD', 'Learn about NRLD', true, 3),
('nrld_main_content', 'Main Content', 'nrld', 'richtext', 'NRLD information and details', 'NRLD information and details', true, 4)
ON CONFLICT (section_key) DO NOTHING;

-- Media page
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('media_hero_title', 'Hero Title', 'media', 'text', 'Media Gallery', 'Media Gallery', true, 1),
('media_subtitle', 'Subtitle', 'media', 'textarea', 'Photos and videos from our matches', 'Photos and videos from our matches', true, 2)
ON CONFLICT (section_key) DO NOTHING;

-- Lottery page
INSERT INTO public.site_content (section_key, section_label, page, content_type, content_value, published_value, is_published, display_order) VALUES
('lottery_hero_title', 'Hero Title', 'lottery', 'text', 'Club Lottery', 'Club Lottery', true, 1),
('lottery_subtitle', 'Subtitle', 'lottery', 'textarea', 'Support the club and win prizes', 'Support the club and win prizes', true, 2),
('lottery_intro_text', 'Introduction Text', 'lottery', 'richtext', 'Join our monthly lottery draw', 'Join our monthly lottery draw', true, 3)
ON CONFLICT (section_key) DO NOTHING;