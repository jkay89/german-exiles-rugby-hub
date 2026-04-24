-- Create live_streams table
CREATE TABLE public.live_streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cloudflare_uid TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  rtmp_url TEXT,
  stream_key TEXT,
  playback_url TEXT,
  recording_url TEXT,
  is_live BOOLEAN NOT NULL DEFAULT false,
  scheduled_start TIMESTAMP WITH TIME ZONE,
  fixture_id UUID REFERENCES public.fixtures(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add stream link to fixtures
ALTER TABLE public.fixtures
ADD COLUMN stream_id UUID REFERENCES public.live_streams(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;

-- Public can view streams (but stream_key/rtmp_url should be hidden via the app layer / edge functions only)
CREATE POLICY "Anyone can view live streams"
ON public.live_streams
FOR SELECT
USING (true);

-- Only admins can manage
CREATE POLICY "Admins can insert live streams"
ON public.live_streams
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update live streams"
ON public.live_streams
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete live streams"
ON public.live_streams
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Updated_at trigger
CREATE TRIGGER update_live_streams_updated_at
BEFORE UPDATE ON public.live_streams
FOR EACH ROW
EXECUTE FUNCTION public.update_lottery_updated_at();

-- Index for fixture lookups
CREATE INDEX idx_live_streams_fixture_id ON public.live_streams(fixture_id);
CREATE INDEX idx_live_streams_is_live ON public.live_streams(is_live) WHERE is_live = true;