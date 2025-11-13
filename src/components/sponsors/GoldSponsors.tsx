
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

interface GoldSponsorsProps {
  sponsors: Sponsor[];
}

const GoldSponsors = ({ sponsors }: GoldSponsorsProps) => {
  const { t } = useLanguage();
  
  if (sponsors.length === 0) return null;
  
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title={t("gold_sponsor")} delay={0.3} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sponsors.map((sponsor, index) => (
            <SponsorCard
              key={sponsor.id}
              name={sponsor.name}
              description={sponsor.description || ''}
              logoSrc={sponsor.logo_url || ''}
              websiteUrl={sponsor.website_url || undefined}
              delay={0.4 + (index * 0.1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoldSponsors;
