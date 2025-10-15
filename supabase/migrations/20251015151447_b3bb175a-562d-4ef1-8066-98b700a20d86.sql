-- Create player_sponsors table for multiple sponsors per player
CREATE TABLE IF NOT EXISTS public.player_sponsors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  sponsor_name TEXT NOT NULL,
  sponsor_logo_url TEXT,
  sponsor_website TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.player_sponsors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view player sponsors"
  ON public.player_sponsors
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage player sponsors"
  ON public.player_sponsors
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

-- Create index for faster queries
CREATE INDEX idx_player_sponsors_player_id ON public.player_sponsors(player_id);

-- Migrate existing sponsor data from players table to player_sponsors table
INSERT INTO public.player_sponsors (player_id, sponsor_name, sponsor_logo_url, sponsor_website, display_order)
SELECT 
  id,
  sponsor_name,
  sponsor_logo_url,
  sponsor_website,
  0
FROM public.players
WHERE sponsor_name IS NOT NULL;

-- Note: We're keeping the sponsor columns in players table for backwards compatibility
-- They can be dropped in a future migration once all code is updated