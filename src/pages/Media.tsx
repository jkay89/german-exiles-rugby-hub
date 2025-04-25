
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Images, Folder } from "lucide-react";

interface MediaFolder {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  type: "photo" | "video";
}

const mediaFolders: MediaFolder[] = [
  {
    id: "schlicht-exiles-9s-rotterdam-2025",
    title: "Schlicht Exiles 9s - Rotterdam 2025",
    thumbnail: "/lovable-uploads/dc8c46be-81e9-4ddf-9b23-adc3f72d2989.png",
    date: "April 22, 2025",
    type: "photo"
  },
];

const Media = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <Images className="h-8 w-8 text-german-gold" />
          <h1 className="text-4xl font-bold text-white">{t("media")}</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mediaFolders.map((folder) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-lg overflow-hidden border border-german-red hover:border-german-gold transition-colors duration-300"
            >
              <Link to={`/media/${folder.id}`}>
                <div className="aspect-video bg-gray-800 flex items-center justify-center overflow-hidden">
                  <img 
                    src={folder.thumbnail} 
                    alt={folder.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400">{folder.date}</p>
                    <div className="flex items-center gap-1">
                      {folder.type === "photo" ? (
                        <Images className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Folder className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{folder.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Media;
