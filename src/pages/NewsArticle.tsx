
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Newspaper, Calendar, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { NewsArticle as NewsArticleType, fetchNewsArticle } from "@/utils/newsUtils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const NewsArticle = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [article, setArticle] = useState<NewsArticleType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const loadArticle = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await fetchNewsArticle(id);
        setArticle(data);
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
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

  if (!article) {
    return (
      <div className="pt-16 min-h-screen bg-black">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-white text-center">{t("article_not_found")}</h1>
          <div className="flex justify-center mt-6">
            <Link to="/news">
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                {t("back_to_news")}
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
        <div className="mb-6">
          <Link to="/news">
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              {t("back_to_news")}
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <Newspaper className="h-8 w-8 text-german-gold" />
          <h1 className="text-4xl font-bold text-white">{article.title}</h1>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="h-4 w-4" />
            <p>{format(new Date(article.created_at), "MMMM dd, yyyy")}</p>
          </div>
        </div>

        {article.image_url && (
          <div className="w-full max-w-4xl mx-auto mb-8">
            <img 
              src={article.image_url} 
              alt={article.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        <div className="prose prose-invert max-w-4xl mx-auto">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NewsArticle;
