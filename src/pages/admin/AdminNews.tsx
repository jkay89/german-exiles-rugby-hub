
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { newsArticles } from "@/data/newsData";
import { Plus, Edit, Upload } from "lucide-react";

const AdminNews = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">News Management</h1>
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Create New Article</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Article Title</label>
              <input type="text" className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" placeholder="Enter article title" />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Publication Date</label>
              <input type="date" className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Summary</label>
              <input type="text" className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" placeholder="Brief summary of the article" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Content</label>
              <textarea className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white min-h-[200px]" placeholder="Write your article content here"></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Featured Image</label>
              <div className="flex items-center space-x-4">
                <Button className="bg-gray-800 text-white flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Upload Image
                </Button>
                <p className="text-gray-400 text-sm">No image selected</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button className="bg-german-red hover:bg-german-gold flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Article
            </Button>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Existing Articles</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Summary</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {newsArticles.map(article => (
                  <tr key={article.id}>
                    <td className="px-4 py-3 text-sm text-gray-300">{article.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{article.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 truncate max-w-xs">{article.summary}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <Edit className="h-3 w-3" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive">Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminNews;
