
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Newspaper, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { newsArticles } from "@/data/newsData";

const NewsArticle = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const article = newsArticles.find(article => article.id === id);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!article) {
    return (
      <div className="pt-16 min-h-screen bg-black">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-white text-center">{t("article_not_found")}</h1>
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
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <Newspaper className="h-8 w-8 text-german-gold" />
          <h1 className="text-4xl font-bold text-white">{article.title}</h1>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="h-4 w-4" />
            <p>{article.date}</p>
          </div>
        </div>

        {article.featuredImage && (
          <div className="w-full max-w-4xl mx-auto mb-8">
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        <div className="prose prose-invert max-w-4xl mx-auto">
          {article.contentParagraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {article.images && article.images.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Photo Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {article.images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg">
                  <img 
                    src={image} 
                    alt={`${article.title} - Image ${index + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NewsArticle;
