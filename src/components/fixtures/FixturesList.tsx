
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { MapPin, Loader2 } from "lucide-react";
import { Fixture } from "@/hooks/useFixtures";

interface FixturesListProps {
  fixtures: Fixture[];
  loading?: boolean;
}

const FixturesList = ({ fixtures, loading = false }: FixturesListProps) => {
  // Function to generate Google Maps URL from a location string
  const getGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMMM yyyy");
    } catch (error) {
      console.error("Error formatting date in FixturesList:", error, dateString);
      return dateString;
    }
  };

  return (
    <div className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-white">Upcoming Fixtures</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-german-gold animate-spin" />
        </div>
      ) : fixtures && fixtures.length > 0 ? (
        <div className="space-y-4">
          {fixtures.map((fixture, index) => (
            <motion.div
              key={fixture.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-l-4 border-german-red p-4 bg-gray-900"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-gray-800 text-german-gold px-2 py-0.5 rounded">
                      {fixture.team || "Team"}
                    </span>
                    <span className="text-xs font-medium bg-gray-800 text-white px-2 py-0.5 rounded">
                      {fixture.competition || "Friendly"}
                    </span>
                  </div>
                  <p className="font-bold text-white mt-1">
                    {fixture.is_home ? "German Exiles" : fixture.opponent} vs {fixture.is_home ? fixture.opponent : "German Exiles"}
                  </p>
                  <p className="text-sm text-gray-300">
                    {formatDate(fixture.date)} at {fixture.time || "TBC"}
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No fixtures available yet</p>
        </div>
      )}
    </div>
  );
};

export default FixturesList;
