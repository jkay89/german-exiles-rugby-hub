
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

interface SilverSponsorsProps {
  sponsors: Sponsor[];
}

const SilverSponsors = ({ sponsors }: SilverSponsorsProps) => {
  const { t } = useLanguage();
  
  if (sponsors.length === 0) return null;
  
  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title={t("silver_sponsors")} delay={0.5} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <SponsorCard
              key={sponsor.id}
              name={sponsor.name}
              description={sponsor.description || ''}
              logoSrc={sponsor.logo_url || ''}
              websiteUrl={sponsor.website_url || undefined}
              delay={0.6 + (index * 0.1)}
              isMajorSponsor={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SilverSponsors;
