
import SponsorTierHeader from "./SponsorTierHeader";
import SponsorCard from "./SponsorCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { sponsorData } from "@/data/sponsorData";

const MediaPartner = () => {
  const { t } = useLanguage();
  
  const mediaPartners = sponsorData.filter(sponsor => sponsor.tier === "media");
  
  if (mediaPartners.length === 0) return null;
  
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title={t("media_partner")} delay={0.6} />
        
        <div className="max-w-3xl mx-auto">
          {mediaPartners.map((sponsor) => (
            <SponsorCard
              key={sponsor.id}
              name={sponsor.name}
              description="Official media partner providing video content and coverage for German Exiles Rugby League events and matches."
              logoSrc={sponsor.logo}
              websiteUrl={sponsor.website || undefined}
              delay={0.7}
              isMajorSponsor={true}
              isMediaPartner={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaPartner;
