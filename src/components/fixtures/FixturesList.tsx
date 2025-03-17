
import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin } from "lucide-react";
import { Fixture } from "@/utils/fixtureUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface FixturesListProps {
  fixtures: Fixture[];
}

const FixturesList = ({ fixtures }: FixturesListProps) => {
  const { t } = useLanguage();
  
  // Function to generate Google Maps URL from a location string
  const getGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  return (
    <div className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-white">{t("upcoming_fixtures")}</h2>
      <div className="space-y-4">
        {fixtures.map((fixture, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-l-4 border-german-red p-4 bg-gray-900"
          >
            <p className="font-bold text-white">{fixture.opponent}</p>
            <p className="text-sm text-gray-300">
              {format(new Date(fixture.date), "dd MMMM yyyy")} at {fixture.time}
            </p>
            <p className="text-sm text-german-gold flex items-start gap-1">
              <MapPin className="h-3 w-3 min-w-3 mt-1" /> 
              <a 
                href={getGoogleMapsUrl(fixture.location)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline hover:text-white transition-colors"
              >
                {fixture.location}
              </a>
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FixturesList;
