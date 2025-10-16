import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Images, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { MediaFolder, fetchMediaFolders } from "@/utils/mediaUtils";
import { format } from "date-fns";
import { PageWithPositionedElements } from "@/components/PageWithPositionedElements";

const Media = () => {
  const { t } = useLanguage();
  const [mediaFolders, setMediaFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFolders = async () => {
      setLoading(true);
      try {
        const folders = await fetchMediaFolders();
        setMediaFolders(folders);
      } catch (error) {
        console.error("Error loading media folders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFolders();
  }, []);

  return (
    <PageWithPositionedElements page="media">
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

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-german-gold"></div>
          </div>
        ) : mediaFolders.length > 0 ? (
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
                    {folder.thumbnail_url ? (
                      <img 
                        src={folder.thumbnail_url} 
                        alt={folder.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Folder className="h-16 w-16 text-gray-600" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-400">
                        {format(new Date(folder.date), "MMMM dd, yyyy")}
                      </p>
                      <div className="flex items-center gap-1">
                        <Images className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">{folder.title}</h3>
                    {folder.description && (
                      <p className="text-gray-400 mt-2">{folder.description}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">{t("no_media_content")}</p>
          </div>
        )}
      </motion.div>
    </PageWithPositionedElements>
  );
};

export default Media;
