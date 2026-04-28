INSERT INTO storage.buckets (id, name, public)
VALUES ('match-sponsor-logos', 'match-sponsor-logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view match sponsor logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'match-sponsor-logos');

CREATE POLICY "Admins can upload match sponsor logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'match-sponsor-logos' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update match sponsor logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'match-sponsor-logos' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete match sponsor logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'match-sponsor-logos' AND public.is_admin(auth.uid()));