import { motion } from "framer-motion";

const NRLD = () => {
  return (
    <div className="pt-16 min-h-screen bg-white">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-16 bg-black text-white"
      >
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">German National Rugby League</h1>
          <p className="text-gray-300">Supporting the growth of Rugby League in Germany</p>
        </div>
      </motion.section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-4">About NRLD</h2>
              <p className="text-gray-700 leading-relaxed">
                The National Rugby League Deutschland (NRLD) is dedicated to developing 
                and promoting Rugby League across Germany. Working closely with the German 
                Exiles, we aim to strengthen the national team and create pathways for 
                players to represent their country.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-4">National Team</h2>
              <p className="text-gray-700 leading-relaxed">
                The German national team represents the pinnacle of Rugby League in 
                Germany. Through collaboration with the German Exiles, we identify and 
                develop talent both within Germany and among German-eligible players 
                worldwide.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NRLD;