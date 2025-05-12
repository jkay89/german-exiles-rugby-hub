
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdmin } from "@/contexts/AdminContext";
import EditSponsorForm from "./EditSponsorForm";

interface SponsorCardProps {
  name: string;
  description: string;
  logoSrc: string;
  websiteUrl?: string;
  delay?: number;
  isMajorSponsor?: boolean;
  isAffiliate?: boolean;
  isMediaPartner?: boolean;
}

const SponsorCard = ({ 
  name, 
  description, 
  logoSrc, 
  websiteUrl, 
  delay = 0.2,
  isMajorSponsor = true,
  isAffiliate = false,
  isMediaPartner = false
}: SponsorCardProps) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAdmin();
  
  const handleSave = (data: any) => {
    // TODO: Implement save functionality when backend is connected
    console.log("Saving sponsor data:", data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-black border ${isMediaPartner ? 'border-blue-500' : 'border-german-red'} rounded-lg ${isMajorSponsor ? 'p-8' : 'p-6'} ${isMediaPartner ? 'hover:border-blue-400' : 'hover:border-german-gold'} transition-colors duration-300 h-full relative`}
    >
      {isAuthenticated && (
        <EditSponsorForm
          id={name.toLowerCase().replace(/\s+/g, '-')}
          name={name}
          description={description}
          logoSrc={logoSrc}
          websiteUrl={websiteUrl}
          tier={isMediaPartner ? "media" : (isMajorSponsor ? (isAffiliate ? "affiliate" : "gold") : "silver")}
          onSave={handleSave}
        />
      )}

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
                isMediaPartner ? 'max-h-40 object-contain mx-auto' :
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
                isMediaPartner ? 'max-h-40 object-contain mx-auto' :
                !isMajorSponsor ? 'max-h-32 object-contain mx-auto' : ''
              }`}
            />
          </div>
        )}
        <div className={`${isMajorSponsor ? 'w-full md:w-2/3' : 'text-center'}`}>
          <h3 className={`text-${isMajorSponsor ? '2xl' : 'xl'} font-bold ${isMediaPartner ? 'text-blue-400' : 'text-german-gold'} mb-${isMajorSponsor ? '4' : '2'}`}>{name}</h3>
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
                className={`${isMediaPartner ? 'bg-blue-500 hover:bg-blue-600' : 'bg-german-red hover:bg-red-700'} text-white`}
                size={isMajorSponsor ? "default" : isAffiliate ? "sm" : "sm"}
              >
                {t("visit_website")}
              </Button>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SponsorCard;
