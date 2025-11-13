
import SponsorTierHeader from "./SponsorTierHeader";
import SponsorCard from "./SponsorCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
  description: string | null;
}

interface AffiliateSponsorsProps {
  sponsors: Sponsor[];
}

const AffiliateSponsors = ({ sponsors }: AffiliateSponsorsProps) => {
  const { t } = useLanguage();
  
  if (sponsors.length === 0) return null;
  
  return (
    <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title={t("affiliate_sponsors")} delay={0.7} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sponsors.map((sponsor, index) => (
            <SponsorCard
              key={sponsor.id}
              name={sponsor.name}
              description={sponsor.description || ''}
              logoSrc={sponsor.logo_url || ''}
              websiteUrl={sponsor.website_url || undefined}
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

export default AffiliateSponsors;
