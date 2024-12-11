import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    });
  };

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
          <h1 className="text-4xl font-bold mb-4 text-german-gold">Contact Us</h1>
          <p className="text-gray-300">Get in touch with German Exiles Rugby League</p>
        </div>
      </motion.section>

      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300"
            >
              <h2 className="text-2xl font-bold mb-6 text-german-gold">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 text-white focus:border-german-red focus:ring-german-red"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 text-white focus:border-german-red focus:ring-german-red"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 text-white focus:border-german-red focus:ring-german-red"
                    required
                  ></textarea>
                </div>
                <Button type="submit" className="w-full bg-german-red hover:bg-red-700">
                  Send Message
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300"
            >
              <h2 className="text-2xl font-bold mb-6 text-german-gold">Connect with us</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2 text-white">Social Media</h3>
                  <div className="space-y-2">
                    <a href="#" className="text-german-red hover:text-red-700 block">
                      Facebook
                    </a>
                    <a href="#" className="text-german-red hover:text-red-700 block">
                      Twitter
                    </a>
                    <a href="#" className="text-german-red hover:text-red-700 block">
                      Instagram
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-white">Email</h3>
                  <a href="mailto:contact@germanexilesrl.com" className="text-german-red hover:text-red-700">
                    contact@germanexilesrl.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;