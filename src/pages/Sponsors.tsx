import { motion } from "framer-motion";
import SponsorHeader from "@/components/sponsors/SponsorHeader";
import PlatinumSponsors from "@/components/sponsors/PlatinumSponsors";
import GoldSponsors from "@/components/sponsors/GoldSponsors";
import SilverSponsors from "@/components/sponsors/SilverSponsors";
import MediaPartner from "@/components/sponsors/MediaPartner";
import AffiliateSponsors from "@/components/sponsors/AffiliateSponsors";
import BecomeSponsor from "@/components/sponsors/BecomeSponsor";
import { PositionedElements } from "@/components/PositionedElements";
import { sponsorData } from "@/data/sponsorData";
import { useLanguage } from "@/contexts/LanguageContext";

const Sponsors = () => {
  const { t } = useLanguage();
  
  // Filter sponsors by tier
  const platinumSponsors = sponsorData.filter(sponsor => sponsor.tier === "platinum");
  const goldSponsors = sponsorData.filter(sponsor => sponsor.tier === "gold");
  const silverSponsors = sponsorData.filter(sponsor => sponsor.tier === "silver");
  const mediaPartners = sponsorData.filter(sponsor => sponsor.tier === "media");
  const affiliateSponsors = sponsorData.filter(sponsor => sponsor.tier === "affiliate");
  
  return (
    <div className="pt-16 min-h-screen bg-black">
      <PositionedElements page="sponsors" />
      <SponsorHeader />
      <PlatinumSponsors />
      <GoldSponsors />
      <SilverSponsors />
      <MediaPartner />
      <AffiliateSponsors />
      <BecomeSponsor />
    </div>
  );
};

export default Sponsors;
