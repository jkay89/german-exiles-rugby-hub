
import { motion } from "framer-motion";
import SponsorHeader from "@/components/sponsors/SponsorHeader";
import PlatinumSponsors from "@/components/sponsors/PlatinumSponsors";
import GoldSponsors from "@/components/sponsors/GoldSponsors";
import SilverSponsors from "@/components/sponsors/SilverSponsors";
import AffiliateSponsors from "@/components/sponsors/AffiliateSponsors";
import BecomeSponsor from "@/components/sponsors/BecomeSponsor";

const Sponsors = () => {
  return (
    <div className="pt-16 min-h-screen bg-black">
      <SponsorHeader />
      <PlatinumSponsors />
      <GoldSponsors />
      <SilverSponsors />
      <AffiliateSponsors />
      <BecomeSponsor />
    </div>
  );
};

export default Sponsors;
