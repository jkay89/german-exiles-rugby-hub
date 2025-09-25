
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogFooter, DialogTrigger, DialogClose 
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client-extensions";
import { MediaFolder, MediaItem, fetchMediaFolders } from "@/utils/mediaUtils";
import { format } from "date-fns";
import { Folder, Images, Plus, Trash2, Upload, Edit, X } from "lucide-react";

const AdminMedia = () => {
  const { isAuthenticated, isUserAdmin } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<MediaFolder | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    } else {
      loadFolders();
    }
  }, [isAuthenticated, navigate]);

  const loadFolders = async () => {
    setLoading(true);
    try {
      const data = await fetchMediaFolders();
      setFolders(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading media folders",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMediaItems = async (folderId: string) => {
    try {
      const { data, error } = await supabase.rest
        .from('media_items')
        .select('*')
        .eq('folder_id', folderId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMediaItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading media items",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const folderData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        date: formData.get('date') as string,
      };
      
      const { data, error } = await supabase.rest
        .from('media_folders')
        .insert([folderData])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Folder created",
        description: "Media folder has been created successfully",
      });
      
      loadFolders();
      
      // Close the dialog by triggering a click on the DialogClose component
      const closeButton = document.querySelector('[data-dialog-close]');
      if (closeButton instanceof HTMLButtonElement) closeButton.click();
      
    } catch (error: any) {
      toast({
        title: "Error creating folder",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return;
    
    try {
      // First delete all media items in this folder
      const { error: itemsError } = await supabase.rest
        .from('media_items')
        .delete()
        .eq('folder_id', folderToDelete);
      
      if (itemsError) throw itemsError;
      
      // Then delete the folder itself
      const { error } = await supabase.rest
        .from('media_folders')
        .delete()
        .eq('id', folderToDelete);
      
      if (error) throw error;
      
      toast({
        title: "Folder deleted",
        description: "Media folder and its contents have been deleted",
      });
      
      setFolderToDelete(null);
      loadFolders();
      setSelectedFolder(null);
      setMediaItems([]);
      
    } catch (error: any) {
      toast({
        title: "Error deleting folder",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMediaItem = async () => {
    if (!itemToDelete) return;
    
    try {
      const { error } = await supabase.rest
        .from('media_items')
        .delete()
        .eq('id', itemToDelete);
      
      if (error) throw error;
      
      toast({
        title: "Media item deleted",
        description: "The media item has been deleted",
      });
      
      setItemToDelete(null);
      
      if (selectedFolder) {
        loadMediaItems(selectedFolder.id);
      }
      
    } catch (error: any) {
      toast({
        title: "Error deleting media item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (folder: MediaFolder, files: FileList) => {
    if (!files.length) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Update thumbnail if the folder doesn't have one yet
      let thumbnailUpdated = false;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${i}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
        
        const fileUrl = data.publicUrl;
        
        // Determine file type (image or video)
        const fileType = file.type.startsWith('image/') ? 'image' : 
                        file.type.startsWith('video/') ? 'video' : 'other';
        
        // Create media item entry
        const { error: itemError } = await supabase.rest
          .from('media_items')
          .insert([{
            folder_id: folder.id,
            url: fileUrl,
            type: fileType,
            title: file.name
          }]);
        
        if (itemError) throw itemError;
        
        // Update folder thumbnail if needed and this is an image
        if (!thumbnailUpdated && !folder.thumbnail_url && fileType === 'image') {
          const { error: thumbError } = await supabase.rest
            .from('media_folders')
            .update({ thumbnail_url: fileUrl })
            .eq('id', folder.id);
          
          if (!thumbError) thumbnailUpdated = true;
        }
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      toast({
        title: "Upload complete",
        description: `${files.length} files uploaded successfully`,
      });
      
      loadMediaItems(folder.id);
      
      if (thumbnailUpdated) {
        loadFolders();
      }
      
    } catch (error: any) {
      toast({
        title: "Error uploading files",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
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
          <h1 className="text-3xl font-bold text-white">Media Management</h1>
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Folders Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Media Folders</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-german-red hover:bg-german-gold">
                      <Plus className="h-4 w-4 mr-1" /> New
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Create New Media Folder</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateFolder}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input 
                            id="title" 
                            name="title" 
                            className="bg-gray-800 border-gray-700 text-white" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input 
                            id="description" 
                            name="description" 
                            className="bg-gray-800 border-gray-700 text-white" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input 
                            id="date" 
                            name="date" 
                            type="date" 
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="bg-gray-800 border-gray-700 text-white" 
                            required 
                          />
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-german-red hover:bg-german-gold">Create Folder</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-german-gold"></div>
                </div>
              ) : folders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No media folders found</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      onClick={() => {
                        setSelectedFolder(folder);
                        loadMediaItems(folder.id);
                      }}
                      className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                        selectedFolder?.id === folder.id
                          ? 'bg-gray-700'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <Folder className="h-4 w-4 text-german-gold mr-2" />
                        <span className="text-white text-sm truncate max-w-[150px]">{folder.title}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFolderToDelete(folder.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {selectedFolder ? (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedFolder.title}</h2>
                    <p className="text-gray-400 text-sm">
                      {format(new Date(selectedFolder.date), "MMMM dd, yyyy")}
                      {selectedFolder.description && ` - ${selectedFolder.description}`}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="file"
                      id="fileUpload"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileUpload(selectedFolder, e.target.files);
                          // Reset the input
                          e.target.value = '';
                        }
                      }}
                    />
                    <label htmlFor="fileUpload">
                      <Button 
                        variant="outline" 
                        className="cursor-pointer" 
                        disabled={isUploading}
                        onClick={() => document.getElementById('fileUpload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploading ? `Uploading ${uploadProgress}%` : "Upload Media"}
                      </Button>
                    </label>
                  </div>
                </div>

                {mediaItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Images className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No media items in this folder</p>
                    <p className="text-gray-500 text-sm mt-2">Upload images or videos to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mediaItems.map((item) => (
                      <Card key={item.id} className="bg-gray-800 border-gray-700 overflow-hidden group relative">
                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 w-7 p-0"
                            onClick={() => setItemToDelete(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {item.type === 'image' ? (
                          <div className="aspect-square bg-gray-700">
                            <img
                              src={item.url}
                              alt={item.title || "Media item"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-square bg-gray-700 flex items-center justify-center">
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                            />
                            <Play className="h-12 w-12 text-white absolute" />
                          </div>
                        )}
                        <CardContent className="p-2">
                          <p className="text-xs text-gray-400 truncate">{item.title}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center">
                <Images className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Select a Media Folder</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Choose a folder from the sidebar to manage its media content or create a new folder.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Folder Confirmation Dialog */}
      <AlertDialog open={!!folderToDelete} onOpenChange={(open) => !open && setFolderToDelete(null)}>
        <AlertDialogContent className="bg-gray-900 border border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this folder?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete the folder and all media items it contains. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteFolder}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Media Item Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent className="bg-gray-900 border border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete media item?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently remove this media item. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMediaItem}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const Play = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
);

export default AdminMedia;
