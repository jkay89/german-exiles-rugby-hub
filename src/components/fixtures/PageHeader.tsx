
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const PageHeader = () => {
  const { t } = useLanguage();
  
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative py-16 bg-black text-white overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 opacity-10">
        <img 
          src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png" 
          alt="German Exiles Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-german-gold">{t("fixtures_results")}</h1>
        <p className="text-gray-300">{t("fixtures_description")}</p>
      </div>
    </motion.section>
  );
};

export default PageHeader;
