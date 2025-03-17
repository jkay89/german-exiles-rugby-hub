
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Trophy, Users } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getNextFixture, Fixture } from "@/utils/fixtureUtils";
import { Link } from "react-router-dom";

interface SponsorLogo {
  id: string;
  name: string;
  logo: string;
  website: string | null;
  tier: "platinum" | "gold" | "silver";
}

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [nextFixture, setNextFixture] = useState<Fixture | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    setNextFixture(getNextFixture());
  }, []);

  // Sponsor data sourced from the sponsors page
  const sponsorLogos: SponsorLogo[] = [
    {
      id: "safetech",
      name: "Safetech Innovations",
      logo: "/lovable-uploads/f79f5262-9a43-411e-85bf-4800b6fc4f3e.png",
      website: "https://www.safetechinnovations.com",
      tier: "platinum"
    },
    {
      id: "goldenguard",
      name: "Golden Guard VPN",
      logo: "/lovable-uploads/5dc48408-4d0a-448f-93fe-ee8f8babb02d.png",
      website: "https://goldenguardvpn.com",
      tier: "gold"
    },
    {
      id: "beaubijou",
      name: "Beau Bijou Design",
      logo: "/lovable-uploads/f46f89dd-c0de-4241-8bcb-893623c26c05.png",
      website: "https://beaubijoudesign.com/",
      tier: "silver"
    },
    {
      id: "forjosef",
      name: "ForJosef",
      logo: "/lovable-uploads/86e094ab-21e7-4af4-8964-005499f0b682.png",
      website: null,
      tier: "silver"
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-[60vh] bg-black"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
        <div className="absolute inset-0">
          <img
            src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png"
            alt="German Exiles Rugby League"
            className="w-full h-full object-contain opacity-20"
          />
        </div>
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              German Exiles <span className="text-german-gold">Rugby League</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              Bridging German talent worldwide through Rugby League excellence
            </p>
          </div>
        </div>
      </motion.section>

      {/* Mission Statement */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-8 text-german-gold">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              German Exiles Rugby League serves as a pathway for German-eligible players 
              based in the UK to represent their heritage. We're committed to growing 
              Rugby League in Germany while providing opportunities for players to 
              compete at an international level.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300"
            >
              <Calendar className="h-12 w-12 text-german-red mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Next Fixture</h3>
              {nextFixture ? (
                <div>
                  <p className="text-german-gold font-semibold">
                    {nextFixture.opponent}
                  </p>
                  <p className="text-gray-300">
                    {format(new Date(nextFixture.date), "dd MMMM yyyy")}
                  </p>
                  <p className="text-gray-300">{nextFixture.location}</p>
                  <Link to="/fixtures" className="text-sm text-german-red hover:text-german-gold mt-2 inline-block">
                    View all fixtures
                  </Link>
                </div>
              ) : (
                <p className="text-gray-300">No upcoming fixtures</p>
              )}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300"
            >
              <Trophy className="h-12 w-12 text-german-gold mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Latest Result</h3>
              <p className="text-gray-300">Coming Soon</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300"
            >
              <Users className="h-12 w-12 text-white mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Join Us</h3>
              <p className="text-gray-300">Become part of our growing team</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sponsors Banner */}
      <section className="py-16 bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5">
          <img 
            src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png" 
            alt="German Exiles Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-german-gold">Our Sponsors</h2>
          
          {/* Sponsor Logo Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="max-w-5xl mx-auto mb-12"
          >
            <Carousel 
              opts={{
                align: "start",
                loop: true,
                skipSnaps: true,
                duration: 20,
              }}
              className="w-full"
            >
              <CarouselContent className="py-4">
                {sponsorLogos.map((sponsor) => (
                  <CarouselItem key={sponsor.id} className={cn(
                    "basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4", 
                    "flex items-center justify-center"
                  )}>
                    <div className="p-2 h-full w-full">
                      <div className={cn(
                        "h-32 w-full bg-gray-900 rounded-lg flex items-center justify-center p-4",
                        "border", 
                        sponsor.tier === "platinum" ? "border-white" : 
                        sponsor.tier === "gold" ? "border-german-gold" : "border-german-red",
                        "hover:border-german-gold transition-colors duration-300"
                      )}>
                        {sponsor.website ? (
                          <a 
                            href={sponsor.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-full h-full flex items-center justify-center"
                          >
                            <img 
                              src={sponsor.logo}
                              alt={`${sponsor.name} Logo`}
                              className="max-h-full max-w-full object-contain"
                            />
                          </a>
                        ) : (
                          <img 
                            src={sponsor.logo}
                            alt={`${sponsor.name} Logo`}
                            className="max-h-full max-w-full object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4">
                <CarouselPrevious className="relative inset-0 translate-y-0 left-0 mr-2" />
                <CarouselNext className="relative inset-0 translate-y-0 right-0 ml-2" />
              </div>
            </Carousel>
          </motion.div>

          <div className="text-center">
            <a href="/sponsors" className="text-german-gold hover:text-german-red transition-colors">
              View All Sponsors
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
