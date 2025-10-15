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
  if (!url) return "#";
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
      try {
        const { data, error } = await supabase
          .from('player_sponsors')
          .select('*')
          .eq('player_id', playerId)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setSponsors(data || []);
      } catch (error) {
        console.error('Error fetching player sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, [playerId]);

  if (loading || sponsors.length === 0) return null;

  return (
    <div className="border-t border-gray-700 pt-3">
      <p className="text-gray-400 text-xs mb-2">
        {sponsors.length > 1 ? 'Sponsored by' : 'Sponsored by'}
      </p>
      <div className="flex flex-wrap gap-2">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id}>
            {sponsor.sponsor_logo_url ? (
              <a 
                href={formatSponsorUrl(sponsor.sponsor_website)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <img 
                  src={sponsor.sponsor_logo_url} 
                  alt={sponsor.sponsor_name}
                  className="h-16 object-contain hover:opacity-80 transition-opacity"
                />
              </a>
            ) : (
              <a 
                href={formatSponsorUrl(sponsor.sponsor_website)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-german-gold hover:underline"
              >
                {sponsor.sponsor_name}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
