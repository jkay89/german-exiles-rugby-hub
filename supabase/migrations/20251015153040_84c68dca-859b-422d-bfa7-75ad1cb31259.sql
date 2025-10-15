-- Migrate old sponsor logos to player_sponsors table
-- For players who have sponsor_logo_url but no player_sponsors entry yet

INSERT INTO public.player_sponsors (player_id, sponsor_name, sponsor_logo_url, sponsor_website, display_order)
SELECT 
  p.id as player_id,
  COALESCE(p.sponsor_name, 'Player Sponsor') as sponsor_name,
  p.sponsor_logo_url,
  p.sponsor_website,
  0 as display_order
FROM public.players p
LEFT JOIN public.player_sponsors ps ON p.id = ps.player_id
WHERE p.sponsor_logo_url IS NOT NULL 
  AND ps.id IS NULL  -- Only insert if no player_sponsors entry exists
ON CONFLICT DO NOTHING;