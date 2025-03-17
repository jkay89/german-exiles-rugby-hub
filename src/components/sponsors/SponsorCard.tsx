
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface SponsorCardProps {
  name: string;
  description: string;
  logoSrc: string;
  websiteUrl?: string;
  delay?: number;
  isMajorSponsor?: boolean;
  isAffiliate?: boolean;
}

const SponsorCard = ({ 
  name, 
  description, 
  logoSrc, 
  websiteUrl, 
  delay = 0.2,
  isMajorSponsor = true,
  isAffiliate = false
}: SponsorCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-black border border-german-red rounded-lg ${isMajorSponsor ? 'p-8' : 'p-6'} hover:border-german-gold transition-colors duration-300 h-full`}
    >
      <div className={`flex flex-col ${isMajorSponsor ? 'md:flex-row' : ''} items-center gap-${isMajorSponsor ? '8' : '4'}`}>
        {websiteUrl ? (
          <a 
            href={websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${isMajorSponsor ? 'w-full md:w-1/3' : 'w-full'} hover:opacity-90 transition-opacity`}
          >
            <img 
              src={logoSrc} 
              alt={`${name} Logo`}
              className={`w-full h-auto ${
                isAffiliate ? 'max-h-24 object-contain mx-auto' : 
                !isMajorSponsor ? 'max-h-32 object-contain mx-auto' : ''
              }`}
            />
          </a>
        ) : (
          <div className={`${isMajorSponsor ? 'w-full md:w-1/3' : 'w-full'} hover:opacity-90 transition-opacity`}>
            <img 
              src={logoSrc} 
              alt={`${name} Logo`}
              className={`w-full h-auto ${
                isAffiliate ? 'max-h-24 object-contain mx-auto' : 
                !isMajorSponsor ? 'max-h-32 object-contain mx-auto' : ''
              }`}
            />
          </div>
        )}
        <div className={`${isMajorSponsor ? 'w-full md:w-2/3' : 'text-center'}`}>
          <h3 className={`text-${isMajorSponsor ? '2xl' : 'xl'} font-bold text-german-gold mb-${isMajorSponsor ? '4' : '2'}`}>{name}</h3>
          <p className={`text-gray-300 ${isAffiliate ? 'text-xs' : !isMajorSponsor ? 'text-sm' : ''} mb-${isMajorSponsor ? '6' : '4'}`}>
            {description}
          </p>
          {websiteUrl && (
            <a 
              href={websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button 
                variant="default" 
                className="bg-german-red hover:bg-red-700 text-white"
                size={isMajorSponsor ? "default" : isAffiliate ? "sm" : "sm"}
              >
                Visit Website
              </Button>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SponsorCard;
