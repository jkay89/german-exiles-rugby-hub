
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Upload, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const AdminNews = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    } else {
      fetchNewsArticles();
    }
  }, [isAuthenticated, navigate]);

  const fetchNewsArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsArticles(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching news articles",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingArticle(null);
    setIsCreating(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL for the selected file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          setPreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleCreateArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Handle file upload if there's an image
      let imageUrl = null;
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('news')
          .upload(fileName, selectedFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('news')
          .getPublicUrl(fileName);
          
        imageUrl = data.publicUrl;
      }
      
      // Create the news article
      const articleData = {
        title: formData.get('title') as string,
        summary: formData.get('summary') as string,
        content: formData.get('content') as string,
        image_url: imageUrl,
      };
      
      const { error } = await supabase
        .from('news')
        .insert([articleData]);
        
      if (error) throw error;
      
      toast({
        title: "Article created",
        description: "The news article has been created successfully",
      });
      
      resetForm();
      fetchNewsArticles();
    } catch (error: any) {
      toast({
        title: "Error creating article",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingArticle) return;
    
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Handle file upload if there's a new image
      let imageUrl = editingArticle.image_url;
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('news')
          .upload(fileName, selectedFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('news')
          .getPublicUrl(fileName);
          
        imageUrl = data.publicUrl;
      }
      
      // Update the news article
      const articleData = {
        title: formData.get('title') as string,
        summary: formData.get('summary') as string,
        content: formData.get('content') as string,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('news')
        .update(articleData)
        .eq('id', editingArticle.id);
        
      if (error) throw error;
      
      toast({
        title: "Article updated",
        description: "The news article has been updated successfully",
      });
      
      resetForm();
      fetchNewsArticles();
    } catch (error: any) {
      toast({
        title: "Error updating article",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!deleteArticleId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', deleteArticleId);
        
      if (error) throw error;
      
      toast({
        title: "Article deleted",
        description: "The news article has been deleted successfully",
      });
      
      setDeleteArticleId(null);
      fetchNewsArticles();
    } catch (error: any) {
      toast({
        title: "Error deleting article",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    setIsCreating(false);
    setPreviewUrl(article.image_url || null);
  };

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {editingArticle ? "Edit Article" : "Create New Article"}
            </h2>
            {!isCreating && !editingArticle && (
              <Button 
                onClick={() => setIsCreating(true)} 
                className="bg-german-red hover:bg-german-gold flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Create Article
              </Button>
            )}
          </div>
          
          {(isCreating || editingArticle) && (
            <form onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm text-gray-400 mb-2">Article Title</Label>
                  <Input 
                    type="text" 
                    name="title"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" 
                    placeholder="Enter article title" 
                    required
                    defaultValue={editingArticle?.title || ""}
                  />
                </div>
                
                <div>
                  <Label className="block text-sm text-gray-400 mb-2">Publication Date</Label>
                  <Input 
                    type="date" 
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    disabled 
                    value={
                      editingArticle ? 
                      format(new Date(editingArticle.created_at), 'yyyy-MM-dd') : 
                      format(new Date(), 'yyyy-MM-dd')
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Date is set automatically</p>
                </div>
                
                <div className="md:col-span-2">
                  <Label className="block text-sm text-gray-400 mb-2">Summary</Label>
                  <Input 
                    type="text" 
                    name="summary"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" 
                    placeholder="Brief summary of the article" 
                    required
                    defaultValue={editingArticle?.summary || ""}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label className="block text-sm text-gray-400 mb-2">Content</Label>
                  <Textarea 
                    name="content"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white min-h-[200px]" 
                    placeholder="Write your article content here"
                    required
                    defaultValue={editingArticle?.content || ""}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label className="block text-sm text-gray-400 mb-2">Featured Image</Label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded bg-gray-800 hover:bg-gray-700 transition">
                        <Upload className="h-4 w-4" /> Upload Image
                      </div>
                      <Input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-gray-400 text-sm">
                      {selectedFile ? selectedFile.name : previewUrl ? "Current image" : "No image selected"}
                    </p>
                  </div>
                  {previewUrl && (
                    <div className="mt-4">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-60 rounded border border-gray-700"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-german-red hover:bg-german-gold flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 
                    "Saving..." : 
                    editingArticle ? 
                    <>
                      <Edit className="h-4 w-4" /> Update Article
                    </> : 
                    <>
                      <Plus className="h-4 w-4" /> Create Article
                    </>
                  }
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Existing Articles</h2>
          
          {loading ? (
            <p className="text-gray-400 text-center py-4">Loading articles...</p>
          ) : newsArticles.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No articles found. Create an article to get started.</p>
          ) : (
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
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {format(new Date(article.created_at), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300 truncate max-w-xs">{article.summary}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex items-center gap-1"
                            onClick={() => handleEditArticle(article)}
                          >
                            <Edit className="h-3 w-3" /> Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => setDeleteArticleId(article.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      <AlertDialog open={!!deleteArticleId} onOpenChange={(open) => !open && setDeleteArticleId(null)}>
        <AlertDialogContent className="bg-gray-900 text-white border border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this article?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the article and remove its data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteArticle} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminNews;
