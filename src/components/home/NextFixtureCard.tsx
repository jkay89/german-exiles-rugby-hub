
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Fixture } from "@/utils/fixtureUtils";
import { motion } from "framer-motion";

interface NextFixtureCardProps {
  fixture: Fixture | null;
  delay?: number;
}

const NextFixtureCard = ({ fixture, delay = 0.3 }: NextFixtureCardProps) => {
  // Function to generate Google Maps URL from a location string
  const getGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03 }}
      className="bg-gradient-to-br from-gray-900 to-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-all duration-300 shadow-lg relative overflow-hidden h-full"
    >
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-german-red/10 rounded-full blur-2xl"></div>
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-german-gold/10 rounded-full blur-2xl"></div>
      
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="h-8 w-8 text-german-red" />
        <h3 className="text-2xl font-bold text-white">Next Fixture</h3>
      </div>
      
      {fixture ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="space-y-3"
        >
          <p className="text-german-gold font-semibold text-xl">
            German Exiles vs {fixture.opponent}
          </p>
          
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="h-4 w-4 text-german-red" />
            <p>{format(new Date(fixture.date), "dd MMMM yyyy")}{fixture.time !== "TBC" ? `, ${fixture.time}` : " (TBC)"}</p>
          </div>
          
          <div className="flex items-start gap-2 text-gray-300">
            <MapPin className="h-4 w-4 text-german-red min-w-4 mt-1" />
            <a 
              href={getGoogleMapsUrl(fixture.location)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-german-gold transition-colors"
            >
              {fixture.location}
            </a>
          </div>
          
          <motion.div 
            whileHover={{ x: 5 }}
            className="pt-3"
          >
            <Link 
              to="/fixtures" 
              className="text-german-red hover:text-german-gold transition-colors inline-flex items-center font-medium"
            >
              View all fixtures
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <p className="text-gray-300">No upcoming fixtures</p>
          <Link 
            to="/fixtures" 
            className="text-german-red hover:text-german-gold transition-colors mt-2 inline-block font-medium"
          >
            View fixture schedule
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default NextFixtureCard;
