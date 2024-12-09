import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const Fixtures = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Placeholder fixtures data - replace with actual data
  const fixtures = [
    {
      date: "2024-03-15",
      opponent: "Team A",
      location: "Home",
      time: "14:00",
    },
    {
      date: "2024-03-22",
      opponent: "Team B",
      location: "Away",
      time: "15:30",
    },
  ];

  return (
    <div className="pt-16 min-h-screen bg-white">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-16 bg-black text-white"
      >
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Fixtures</h1>
          <p className="text-gray-300">View our upcoming games and past results</p>
        </div>
      </motion.section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Match Calendar</h2>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Upcoming Fixtures</h2>
              <div className="space-y-4">
                {fixtures.map((fixture, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-german-red p-4 bg-gray-50"
                  >
                    <p className="font-bold">{fixture.opponent}</p>
                    <p className="text-sm text-gray-600">
                      {fixture.date} at {fixture.time}
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