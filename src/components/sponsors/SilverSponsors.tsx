
import SponsorTierHeader from "./SponsorTierHeader";
import SponsorCard from "./SponsorCard";
import { useLanguage } from "@/contexts/LanguageContext";

const SilverSponsors = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title={t("silver_sponsors")} delay={0.5} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Beau Bijou Design Sponsor */}
          <SponsorCard
            name="Beau Bijou Design"
            description="Beau Bijou Design is a creative design studio specializing in elegant, 
            bespoke graphic and web design solutions. With a passionate team dedicated to 
            crafting visually stunning and functional designs, they help businesses and 
            individuals bring their visions to life."
            logoSrc="/lovable-uploads/f46f89dd-c0de-4241-8bcb-893623c26c05.png"
            websiteUrl="https://beaubijoudesign.com/"
            delay={0.6}
            isMajorSponsor={false}
          />

          {/* For Josef Sponsor */}
          <SponsorCard
            name="ForJosef"
            description="ForJosef is in rememberance of Josef Russell whom rugby and the Russell family 
            lost too soon! With thanks to Matt and Francoise Russell and Jim Fountain for 
            the help to keep Joe's memory going in a special way with the Exiles."
            logoSrc="/lovable-uploads/86e094ab-21e7-4af4-8964-005499f0b682.png"
            delay={0.7}
            isMajorSponsor={false}
          />
        </div>
      </div>
    </section>
  );
};

export default SilverSponsors;
