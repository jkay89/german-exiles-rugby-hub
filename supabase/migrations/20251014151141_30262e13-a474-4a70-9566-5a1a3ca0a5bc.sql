-- Add sponsor_website column to players table
ALTER TABLE public.players 
ADD COLUMN IF NOT EXISTS sponsor_website text;