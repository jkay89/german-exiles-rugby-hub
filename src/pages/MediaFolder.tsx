
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { images, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// This is a sample collection, in a real app this would be loaded from a database
const folderContent = {
  "schlicht-exiles-9s-rotterdam-2025": {
    title: "Schlicht Exiles 9s - Rotterdam 2025",
    date: "April 22, 2025",
    images: [
      "/lovable-uploads/dc8c46be-81e9-4ddf-9b23-adc3f72d2989.png",
      "/lovable-uploads/2c677fd8-f43a-45a8-b0a1-491ba2d9eae4.png",
      "/lovable-uploads/9c438e26-41cf-42af-90d6-4797bbc5f8b0.png",
      "/lovable-uploads/dd1e1552-347d-4fc8-a19f-4f4e00b56168.png",
      "/lovable-uploads/5bf2f50a-6738-4cc5-804e-fb82f4d1634b.png",
      "/lovable-uploads/a2d09cab-2bb3-49ff-9913-9d7108a38278.png",
      "/lovable-uploads/b469f12d-4b0e-4ec7-a440-89ef8e502500.png"
    ]
  }
};

const MediaFolder = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  
  // Type guard
  const isFolderContent = (id: string | undefined): id is keyof typeof folderContent => {
    return !!id && id in folderContent;
  };
  
  if (!isFolderContent(id)) {
    return (
      <div className="pt-16 min-h-screen bg-black">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-white text-center">{t("folder_not_found")}</h1>
        </div>
      </div>
    );
  }
  
  const folder = folderContent[id];

  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <images className="h-8 w-8 text-german-gold" />
          <h1 className="text-4xl font-bold text-white">{folder.title}</h1>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="h-4 w-4" />
            <p>{folder.date}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folder.images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-lg border border-gray-800 hover:border-german-gold transition-colors duration-300"
            >
              <img 
                src={image} 
                alt={`${folder.title} - Image ${index + 1}`}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MediaFolder;
