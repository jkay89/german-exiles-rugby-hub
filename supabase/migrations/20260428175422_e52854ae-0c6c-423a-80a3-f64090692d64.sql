ALTER TABLE public.fixtures
  ADD COLUMN IF NOT EXISTS match_sponsor_name text,
  ADD COLUMN IF NOT EXISTS match_sponsor_logo_url text,
  ADD COLUMN IF NOT EXISTS match_sponsor_url text,
  ADD COLUMN IF NOT EXISTS motm_sponsor_name text,
  ADD COLUMN IF NOT EXISTS motm_sponsor_logo_url text,
  ADD COLUMN IF NOT EXISTS motm_sponsor_url text,
  ADD COLUMN IF NOT EXISTS ball_sponsor_name text,
  ADD COLUMN IF NOT EXISTS ball_sponsor_logo_url text,
  ADD COLUMN IF NOT EXISTS ball_sponsor_url text;

ALTER TABLE public.results
  ADD COLUMN IF NOT EXISTS match_sponsor_name text,
  ADD COLUMN IF NOT EXISTS match_sponsor_logo_url text,
  ADD COLUMN IF NOT EXISTS match_sponsor_url text,
  ADD COLUMN IF NOT EXISTS motm_sponsor_name text,
  ADD COLUMN IF NOT EXISTS motm_sponsor_logo_url text,
  ADD COLUMN IF NOT EXISTS motm_sponsor_url text,
  ADD COLUMN IF NOT EXISTS ball_sponsor_name text,
  ADD COLUMN IF NOT EXISTS ball_sponsor_logo_url text,
  ADD COLUMN IF NOT EXISTS ball_sponsor_url text;