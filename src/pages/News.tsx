
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { NewsArticle, fetchNewsArticles } from "@/utils/newsUtils";

const News = () => {
  const { t } = useLanguage();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const articles = await fetchNewsArticles();
        setNewsArticles(articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNews();
  }, []);
  
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
          <h1 className="text-4xl font-bold text-white">{t("latest_news")}</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-german-gold"></div>
          </div>
        ) : newsArticles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsArticles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-900 rounded-lg overflow-hidden border border-german-red hover:border-german-gold transition-colors duration-300"
              >
                <Link to={`/news/${article.id}`}>
                  <div className="aspect-video bg-gray-800 flex items-center justify-center overflow-hidden">
                    {article.image_url ? (
                      <img 
                        src={article.image_url} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Newspaper className="h-12 w-12 text-gray-600" />
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-400 mb-2">
                      {new Date(article.created_at).toLocaleDateString()}
                    </p>
                    <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                    <p className="text-gray-400">{article.summary}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
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
              <h3 className="text-xl font-bold text-white mb-2">{t("coming_soon")}</h3>
              <p className="text-gray-400">{t("news_coming_soon")}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default News;
