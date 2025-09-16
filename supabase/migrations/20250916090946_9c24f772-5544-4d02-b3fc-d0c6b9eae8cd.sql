-- Enable RLS on tables that are missing it
ALTER TABLE public.media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for media_folders
CREATE POLICY "Anyone can view media folders" 
ON public.media_folders 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage media folders" 
ON public.media_folders 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create RLS policies for media_items
CREATE POLICY "Anyone can view media items" 
ON public.media_items 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage media items" 
ON public.media_items 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create RLS policies for news
CREATE POLICY "Anyone can view news" 
ON public.news 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage news" 
ON public.news 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create RLS policies for players
CREATE POLICY "Anyone can view players" 
ON public.players 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage players" 
ON public.players 
FOR ALL 
USING (auth.role() = 'authenticated'::text);