import { motion } from "framer-motion";

const Sponsors = () => {
  // Placeholder sponsors data - replace with actual sponsor information
  const sponsors = [
    {
      name: "Sponsor 1",
      tier: "Gold",
      logo: "/placeholder.svg",
    },
    {
      name: "Sponsor 2",
      tier: "Silver",
      logo: "/placeholder.svg",
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
          <h1 className="text-4xl font-bold mb-4">Our Sponsors</h1>
          <p className="text-gray-300">Supporting the growth of German Rugby League</p>
        </div>
      </motion.section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="w-48 h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-bold mb-2">{sponsor.name}</h3>
                <p className="text-german-gold">{sponsor.tier} Sponsor</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Become a Sponsor</h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-700 mb-8">
              Join us in supporting the development of Rugby League in Germany. 
              Contact us to learn more about our sponsorship opportunities.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-german-red text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              Contact for Sponsorship
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sponsors;