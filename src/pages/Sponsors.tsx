import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SponsorHeader from "@/components/sponsors/SponsorHeader";
import PlatinumSponsors from "@/components/sponsors/PlatinumSponsors";
import GoldSponsors from "@/components/sponsors/GoldSponsors";
import SilverSponsors from "@/components/sponsors/SilverSponsors";
import MediaPartner from "@/components/sponsors/MediaPartner";
import AffiliateSponsors from "@/components/sponsors/AffiliateSponsors";
import BecomeSponsor from "@/components/sponsors/BecomeSponsor";
import { PositionedElements } from "@/components/PositionedElements";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { populateSponsors } from "@/utils/populateSponsors";
import { useToast } from "@/components/ui/use-toast";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
  description: string | null;
}

const Sponsors = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('tier', { ascending: true });

      if (error) throw error;

      // If no sponsors exist, populate with initial data
      if (!data || data.length === 0) {
        const result = await populateSponsors();
        if (result.success && result.data) {
          setSponsors(result.data);
        }
      } else {
        setSponsors(data);
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast({
        title: "Error loading sponsors",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter sponsors by tier
  const platinumSponsors = sponsors.filter(sponsor => sponsor.tier === "platinum");
  const goldSponsors = sponsors.filter(sponsor => sponsor.tier === "gold");
  const silverSponsors = sponsors.filter(sponsor => sponsor.tier === "silver");
  const mediaPartners = sponsors.filter(sponsor => sponsor.tier === "media");
  const affiliateSponsors = sponsors.filter(sponsor => sponsor.tier === "affiliate");
  
  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading sponsors...</div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-black">
      <PositionedElements page="sponsors" />
      <SponsorHeader />
      <PlatinumSponsors sponsors={platinumSponsors} />
      <GoldSponsors sponsors={goldSponsors} />
      <SilverSponsors sponsors={silverSponsors} />
      <MediaPartner sponsors={mediaPartners} />
      <AffiliateSponsors sponsors={affiliateSponsors} />
      <BecomeSponsor />
    </div>
  );
};

export default Sponsors;
