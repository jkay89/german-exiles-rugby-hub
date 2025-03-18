
import SponsorTierHeader from "./SponsorTierHeader";
import SponsorCard from "./SponsorCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { sponsorData } from "@/data/sponsorData";

const GoldSponsors = () => {
  const { t } = useLanguage();
  
  const goldSponsors = sponsorData.filter(sponsor => sponsor.tier === "gold");
  
  const getSponsorDescription = (id: string) => {
    if (id === "goldenguard") {
      return "Golden Guard VPN is a premium virtual private network service dedicated to providing secure, private, and unrestricted internet access to users worldwide. With military-grade encryption, a strict no-logs policy, and servers in multiple countries, Golden Guard VPN ensures that your online activities remain protected from surveillance and cyber threats.";
    } else if (id === "feet1st") {
      return "Feet 1st Physiotherapy provides expert physiotherapy services focusing on rehabilitative treatments and sports injury management. Their experienced team is dedicated to helping clients regain mobility and improve their quality of life through personalized care programs.";
    } else if (id === "ipropertygroup") {
      return "iProperty Group specializes in real estate solutions with a focus on innovative property management, development, and investment opportunities. Their comprehensive approach helps clients navigate the property market with confidence.";
    }
    return "";
  };
  
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title={t("gold_sponsor")} delay={0.3} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {goldSponsors.map((sponsor, index) => (
            <SponsorCard
              key={sponsor.id}
              name={sponsor.name}
              description={getSponsorDescription(sponsor.id)}
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
