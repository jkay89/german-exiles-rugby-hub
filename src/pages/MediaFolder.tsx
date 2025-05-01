
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Images, Calendar, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MediaFolder, MediaItem, fetchMediaItems } from "@/utils/mediaUtils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client-extensions";

const MediaFolderPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [folder, setFolder] = useState<MediaFolder | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadFolderContent = async () => {
      setLoading(true);
      try {
        if (id) {
          // Fetch folder details
          const { data: folderData, error: folderError } = await supabase.rest
            .from('media_folders')
            .select('*')
            .eq('id', id)
            .single();
            
          if (folderError) {
            console.error("Error fetching folder:", folderError);
          } else {
            setFolder(folderData as MediaFolder);
            
            // Fetch media items for this folder
            const items = await fetchMediaItems(id);
            setMediaItems(items);
          }
        }
      } catch (error) {
        console.error("Error loading media folder content:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFolderContent();
  }, [id]);
  
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-black">
        <div className="container mx-auto px-6 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-german-gold"></div>
        </div>
      </div>
    );
  }
  
  if (!folder) {
    return (
      <div className="pt-16 min-h-screen bg-black">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-white text-center">{t("folder_not_found")}</h1>
          <div className="flex justify-center mt-6">
            <Link to="/media">
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                {t("back_to_media")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="flex justify-between items-center mb-6">
          <Link to="/media">
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              {t("back_to_media")}
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <Images className="h-8 w-8 text-german-gold" />
          <h1 className="text-4xl font-bold text-white">{folder.title}</h1>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="h-4 w-4" />
            <p>{format(new Date(folder.date), "MMMM dd, yyyy")}</p>
          </div>
          {folder.description && (
            <p className="text-gray-300 max-w-2xl">{folder.description}</p>
          )}
        </div>

        {mediaItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">{t("no_media_items")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="overflow-hidden rounded-lg border border-gray-800 hover:border-german-gold transition-colors duration-300"
              >
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={item.title || "Media item"}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                    <video 
                      src={item.url}
                      controls
                      className="max-w-full max-h-full"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MediaFolderPage;
