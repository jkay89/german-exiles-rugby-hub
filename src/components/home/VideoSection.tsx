import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const VideoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-12 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-german-gold/20">
            <video
              className="w-full h-auto"
              controls
              preload="metadata"
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Decorative overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;