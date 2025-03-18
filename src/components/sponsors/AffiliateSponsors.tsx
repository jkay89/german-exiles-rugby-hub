
import SponsorTierHeader from "./SponsorTierHeader";
import SponsorCard from "./SponsorCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { sponsorData } from "@/data/sponsorData";

const AffiliateSponsors = () => {
  const { t } = useLanguage();
  
  const affiliateSponsors = sponsorData.filter(sponsor => sponsor.tier === "affiliate");
  
  return (
    <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title={t("affiliate_sponsors")} delay={0.7} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {affiliateSponsors.map((sponsor, index) => (
            <SponsorCard
              key={sponsor.id}
              name={sponsor.name}
              description={getSponsorDescription(sponsor.name)}
              logoSrc={sponsor.logo}
              websiteUrl={sponsor.website || undefined}
              delay={0.8 + (index * 0.1)}
              isMajorSponsor={false}
              isAffiliate={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper function to get sponsor descriptions
const getSponsorDescription = (name: string) => {
  const descriptions: { [key: string]: string } = {
    "Elite Workforce Solutions": "Elite Workforce Solutions specializes in providing staffing and recruitment services across various industries.",
    "Wellness Hub": "Wellness Hub provides holistic wellness services, focusing on physical and mental health programs.",
    "Specialist Wind Services": "Specialist Wind Services delivers expert solutions for wind energy projects and technical consulting.",
    "CMS Yorkshire Ltd": "Commercial and quantity surveying services providing professional expertise across Yorkshire.",
    "Schlicht": "Innovative design and manufacturing solutions.",
    "Maka Construction": "Professional construction and development services.",
    "Fellowes Farriery": "Expert farriery services by Ivan Fellowes DipWCF.",
    "White Hart Halstead": "Traditional pub and restaurant in Halstead.",
    "EMEA Channels": "Professional channel management and distribution services.",
    "Pronto Rugby": "Rugby equipment and accessories supplier."
  };
  
  return descriptions[name] || name;
};

export default AffiliateSponsors;

