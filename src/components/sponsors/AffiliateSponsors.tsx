
import SponsorTierHeader from "./SponsorTierHeader";
import SponsorCard from "./SponsorCard";

const AffiliateSponsors = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <SponsorTierHeader title="Affiliate Sponsors" delay={0.7} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Elite Workforce Solutions */}
          <SponsorCard
            name="Elite Workforce Solutions"
            description="Elite Workforce Solutions specializes in providing staffing and recruitment services across various industries, connecting qualified candidates with businesses seeking talented professionals."
            logoSrc="/lovable-uploads/3e949f9d-3ac2-457d-aef1-de9e847d7819.png"
            websiteUrl="https://eliteworkforcesolutions.com"
            delay={0.8}
            isMajorSponsor={false}
            isAffiliate={true}
          />

          {/* Wellness Hub */}
          <SponsorCard
            name="Wellness Hub"
            description="Wellness Hub by Hampson & Co provides holistic wellness services, focusing on physical and mental health programs for individuals and corporate clients."
            logoSrc="/lovable-uploads/035a87e1-0bf3-41af-b5da-8f1cb7bb505d.png"
            websiteUrl="https://wellnesshub.co"
            delay={0.9}
            isMajorSponsor={false}
            isAffiliate={true}
          />

          {/* Specialist Wind Services */}
          <SponsorCard
            name="Specialist Wind Services"
            description="Specialist Wind Services delivers expert solutions for wind energy projects, offering technical consulting and operational support for sustainable energy initiatives."
            logoSrc="/lovable-uploads/65a024fb-0b0d-4198-9a6a-2d8c59564522.png"
            websiteUrl="https://specialistwindservices.com"
            delay={1.0}
            isMajorSponsor={false}
            isAffiliate={true}
          />
        </div>
      </div>
    </section>
  );
};

export default AffiliateSponsors;
