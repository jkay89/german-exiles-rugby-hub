
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const MissionSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-8 text-german-gold">{t("our_mission")}</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            {t("mission_text")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;
