import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";

const Fixtures = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const fixtures = [
    {
      date: "2025-04-19",
      opponent: "Rotterdam 9s",
      location: "Rotterdam, Netherlands",
      time: "TBC",
    },
    {
      date: "2025-09-04",
      opponent: "German Domestic XIII",
      location: "Munich, Germany",
      time: "TBC",
    },
  ];

  return (
    <div className="pt-16 min-h-screen bg-black">
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
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-german-gold">Fixtures</h1>
          <p className="text-gray-300">View our upcoming games and past results</p>
        </div>
      </motion.section>

      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300">
              <h2 className="text-2xl font-bold mb-4 text-white">Match Calendar</h2>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border text-white"
              />
            </div>

            <div className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300">
              <h2 className="text-2xl font-bold mb-4 text-white">Upcoming Fixtures</h2>
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
                    <p className="text-sm text-german-gold">{fixture.location}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Fixtures;