import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PlayerSponsor {
  id: string;
  sponsor_name: string;
  sponsor_logo_url?: string;
  sponsor_website?: string;
  display_order: number;
}

interface PlayerSponsorsDisplayProps {
  playerId: string;
}

const formatSponsorUrl = (url?: string) => {
  if (!url) return "/";
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

export const PlayerSponsorsDisplay = ({ playerId }: PlayerSponsorsDisplayProps) => {
  const [sponsors, setSponsors] = useState<PlayerSponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      console.log('Fetching sponsors for player:', playerId);
      try {
        const { data, error } = await supabase
          .from('player_sponsors')
          .select('*')
          .eq('player_id', playerId)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching sponsors:', error);
          throw error;
        }
        
        console.log('Fetched sponsors:', data);
        setSponsors(data || []);
      } catch (error) {
        console.error('Error fetching player sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, [playerId]);

  if (loading) return null;

  return (
    <div className="border-t border-gray-700 pt-3">
      <p className="text-gray-400 text-xs mb-2">Sponsored by</p>
      {sponsors.length === 0 ? (
        <div className="flex items-center gap-2 text-gray-500 italic text-sm">
          <span>Available to sponsor</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sponsors
            .filter(sponsor => sponsor.sponsor_logo_url)
            .map((sponsor) => (
              <a 
                key={sponsor.id}
                href={formatSponsorUrl(sponsor.sponsor_website)} 
                target={sponsor.sponsor_website ? "_blank" : "_self"}
                rel={sponsor.sponsor_website ? "noopener noreferrer" : undefined}
                className="block"
              >
                <img 
                  src={sponsor.sponsor_logo_url} 
                  alt={sponsor.sponsor_name || "Sponsor"}
                  className="h-16 object-contain hover:opacity-80 transition-opacity"
                />
              </a>
            ))}
        </div>
      )}
    </div>
  );
};
