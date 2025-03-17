
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { SponsorLogo } from "./types";

interface SponsorCarouselProps {
  sponsorLogos: SponsorLogo[];
}

const SponsorCarousel = ({ sponsorLogos }: SponsorCarouselProps) => {
  return (
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
                  sponsor.tier === "affiliate" ? "basis-full sm:basis-1/3 md:basis-1/4 lg:basis-1/5" : 
                  "basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4", 
                  "flex items-center justify-center"
                )}>
                  <div className="p-2 h-full w-full">
                    <div className={cn(
                      "h-32 w-full bg-gray-900 rounded-lg flex items-center justify-center p-4",
                      "border", 
                      sponsor.tier === "platinum" ? "border-white" : 
                      sponsor.tier === "gold" ? "border-german-gold" : 
                      sponsor.tier === "silver" ? "border-german-red" :
                      "border-gray-600",
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
                            className={cn(
                              "max-w-full object-contain",
                              sponsor.tier === "affiliate" ? "max-h-16" : "max-h-full"
                            )}
                          />
                        </a>
                      ) : (
                        <img 
                          src={sponsor.logo}
                          alt={`${sponsor.name} Logo`}
                          className={cn(
                            "max-w-full object-contain",
                            sponsor.tier === "affiliate" ? "max-h-16" : "max-h-full"
                          )}
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
  );
};

export default SponsorCarousel;
