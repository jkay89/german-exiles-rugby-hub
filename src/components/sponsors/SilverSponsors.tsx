
import SponsorTierHeader from "./SponsorTierHeader";
import SponsorCard from "./SponsorCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { sponsorData } from "@/data/sponsorData";

const SilverSponsors = () => {
  const { t } = useLanguage();
  
  const silverSponsors = sponsorData.filter(sponsor => sponsor.tier === "silver");
  
  const getSponsorDescription = (id: string) => {
    if (id === "beaubijou") {
      return "Beau Bijou Design is a creative design studio specializing in elegant, bespoke graphic and web design solutions. With a passionate team dedicated to crafting visually stunning and functional designs, they help businesses and individuals bring their visions to life.";
    } else if (id === "forjosef") {
      return "ForJosef is in rememberance of Josef Russell whom rugby and the Russell family lost too soon! With thanks to Matt and Francoise Russell and Jim Fountain for the help to keep Joe's memory going in a special way with the Exiles.";
    } else if (id === "tudorjoinery") {
      return "Tudor Joinery Ltd provides expert joinery and building contractor services, delivering high-quality craftsmanship for all types of construction and woodworking projects.";
    } else if (id === "paulreadman") {
      return "This sponsorship is dedicated to the memory of Paul Readman, honoring his legacy and contribution to our community.";
    } else if (id === "adamsdecor") {
      return "Adams Decor is a professional painting and decorating service established in 2006, specializing in both domestic and commercial projects with a commitment to quality workmanship.";
    }
    return "";
  };
  
  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title={t("silver_sponsors")} delay={0.5} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {silverSponsors.map((sponsor, index) => (
            <SponsorCard
              key={sponsor.id}
              name={sponsor.name}
              description={getSponsorDescription(sponsor.id)}
              logoSrc={sponsor.logo}
              websiteUrl={sponsor.website || undefined}
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
