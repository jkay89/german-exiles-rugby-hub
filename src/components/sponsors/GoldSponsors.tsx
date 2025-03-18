
import SponsorTierHeader from "./SponsorTierHeader";
import SponsorCard from "./SponsorCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { sponsorData } from "@/data/sponsorData";

const GoldSponsors = () => {
  const { t } = useLanguage();
  
  const goldSponsors = sponsorData.filter(sponsor => sponsor.tier === "gold");
  
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title={t("gold_sponsor")} delay={0.3} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {goldSponsors.map((sponsor, index) => (
            <SponsorCard
              key={sponsor.id}
              name={sponsor.name}
              description=""
              logoSrc={sponsor.logo}
              websiteUrl={sponsor.website || undefined}
              delay={0.4 + (index * 0.1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoldSponsors;
