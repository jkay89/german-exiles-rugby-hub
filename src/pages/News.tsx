
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

const News = () => {
  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <Newspaper className="h-8 w-8 text-german-gold" />
          <h1 className="text-4xl font-bold text-white">Latest News</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder news items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-lg overflow-hidden border border-german-red hover:border-german-gold transition-colors duration-300"
          >
            <div className="aspect-video bg-gray-800 flex items-center justify-center">
              <Newspaper className="h-12 w-12 text-gray-600" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-gray-400">Stay tuned for the latest news and updates about German Exiles Rugby League.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default News;
