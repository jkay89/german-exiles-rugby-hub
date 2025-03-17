
import SponsorTierHeader from "./SponsorTierHeader";
import SponsorCard from "./SponsorCard";
import { useLanguage } from "@/contexts/LanguageContext";

const GoldSponsors = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title={t("gold_sponsor")} delay={0.3} />
        
        <SponsorCard
          name="Golden Guard VPN"
          description="Golden Guard VPN is a premium virtual private network service dedicated to providing secure, 
          private, and unrestricted internet access to users worldwide. With military-grade encryption, 
          a strict no-logs policy, and servers in multiple countries, Golden Guard VPN ensures that your 
          online activities remain protected from surveillance and cyber threats. Their commitment to user 
          privacy, seamless streaming capabilities, and exceptional customer support makes them a trusted 
          choice for individuals and businesses seeking reliable online security solutions."
          logoSrc="/lovable-uploads/5dc48408-4d0a-448f-93fe-ee8f8babb02d.png"
          websiteUrl="https://goldenguardvpn.com"
          delay={0.4}
        />
      </div>
    </section>
  );
};

export default GoldSponsors;
