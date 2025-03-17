
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Fixture } from "@/utils/fixtureUtils";
import { motion } from "framer-motion";

interface NextFixtureCardProps {
  fixture: Fixture | null;
  delay?: number;
}

const NextFixtureCard = ({ fixture, delay = 0.3 }: NextFixtureCardProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300"
    >
      <Calendar className="h-12 w-12 text-german-red mb-4" />
      <h3 className="text-xl font-bold mb-2 text-white">Next Fixture</h3>
      {fixture ? (
        <div>
          <p className="text-german-gold font-semibold">
            {fixture.opponent}
          </p>
          <p className="text-gray-300">
            {format(new Date(fixture.date), "dd MMMM yyyy")}
          </p>
          <p className="text-gray-300">{fixture.location}</p>
          <Link to="/fixtures" className="text-sm text-german-red hover:text-german-gold mt-2 inline-block">
            View all fixtures
          </Link>
        </div>
      ) : (
        <p className="text-gray-300">No upcoming fixtures</p>
      )}
    </motion.div>
  );
};

export default NextFixtureCard;
