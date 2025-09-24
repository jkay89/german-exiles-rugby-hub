-- Move players with GB heritage from Heritage Team to Community Team
UPDATE players 
SET team = 'community', updated_at = now()
WHERE team = 'heritage' AND heritage = 'GB';

-- Show the results of the migration
SELECT 
  name, 
  heritage, 
  team,
  CASE 
    WHEN team = 'heritage' THEN 'Heritage Team'
    WHEN team = 'community' THEN 'Community Team' 
    WHEN team = 'exiles9s' THEN 'Exiles 9s'
  END as team_display
FROM players 
WHERE heritage IN ('GB', 'DE')
ORDER BY team, heritage, name;