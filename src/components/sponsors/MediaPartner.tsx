
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

interface MediaPartnerProps {
  sponsors: Sponsor[];
}

const MediaPartner = ({ sponsors }: MediaPartnerProps) => {
  const { t } = useLanguage();
  
  if (sponsors.length === 0) return null;
  
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title={t("media_partner")} delay={0.6} />
        
        <div className="max-w-3xl mx-auto">
          {sponsors.map((sponsor) => (
            <SponsorCard
              key={sponsor.id}
              name={sponsor.name}
              description={sponsor.description || ''}
              logoSrc={sponsor.logo_url || ''}
              websiteUrl={sponsor.website_url || undefined}
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
