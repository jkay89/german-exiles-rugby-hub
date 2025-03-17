
import SponsorTierHeader from "./SponsorTierHeader";
import SponsorCard from "./SponsorCard";
import { useLanguage } from "@/contexts/LanguageContext";

const PlatinumSponsors = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title={t("platinum_sponsor")} delay={0.1} />
        
        <SponsorCard
          name="Safetech Innovations Global Services Ltd"
          description="Safetech Innovations is a global cybersecurity company dedicated to protecting organizations from 
          cyber threats and providing cutting-edge security solutions. Founded by a team of professionals with 
          extensive experience in information security, Safetech is committed to excellence, innovation, and 
          client satisfaction, offering comprehensive services including security monitoring, penetration testing, 
          and cybersecurity consulting to help businesses worldwide defend against evolving digital threats."
          logoSrc="/lovable-uploads/f79f5262-9a43-411e-85bf-4800b6fc4f3e.png"
          websiteUrl="https://www.safetechinnovations.com"
          delay={0.2}
        />
      </div>
    </section>
  );
};

export default PlatinumSponsors;
