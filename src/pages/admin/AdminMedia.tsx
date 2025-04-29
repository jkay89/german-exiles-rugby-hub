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
import { Folder, Plus, Upload, Images, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { MediaFolder, MediaItem, fetchMediaFolders, fetchMediaItems, createMediaFolder, updateMediaFolder, deleteMediaFolder, createMediaItem, deleteMediaItem } from "@/utils/mediaUtils";

const AdminMedia = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mediaFolders, setMediaFolders] = useState<MediaFolder[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingFolder, setEditingFolder] = useState<MediaFolder | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'folder' | 'item'>('folder');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    } else {
      // First, create tables if they don't exist
      createMediaTablesIfNeeded().then(() => {
        loadMediaFolders();
      });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedFolder) {
      loadMediaItems(selectedFolder);
    }
  }, [selectedFolder]);

  const createMediaTablesIfNeeded = async () => {
    try {
      const { error } = await supabase.rpc('create_media_tables');
      if (error && !error.message.includes('already exists')) {
        console.error("Error creating media tables:", error);
      }
    } catch (err) {
      console.error("Error checking/creating media tables:", err);
    }
  };

  const loadMediaFolders = async () => {
    setLoading(true);
    try {
      const folders = await fetchMediaFolders();
      setMediaFolders(folders);
    } catch (error: any) {
      toast({
        title: "Error fetching media folders",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMediaItems = async (folderId: string) => {
    setLoading(true);
    try {
      const items = await fetchMediaItems(folderId);
      setMediaItems(items);
    } catch (error: any) {
      toast({
        title: "Error fetching media items",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      
      // Create a preview URL for the selected file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          setThumbnailPreview(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Handle thumbnail upload
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split('.').pop();
        const fileName = `folder_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, thumbnailFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);
          
        thumbnailUrl = data.publicUrl;
      }
      
      // Create the folder
      const folderData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string || null,
        date: formData.get('date') as string,
        thumbnail_url: thumbnailUrl,
      };
      
      const newFolder = await createMediaFolder(folderData);
      
      toast({
        title: "Folder created",
        description: "The media folder has been created successfully",
      });
      
      // Reset form and state
      setIsCreating(false);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      
      // Select the newly created folder
      setSelectedFolder(newFolder.id);
      
      loadMediaFolders();
    } catch (error: any) {
      toast({
        title: "Error creating folder",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingFolder) return;
    
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Handle thumbnail upload if there's a new one
      let thumbnailUrl = editingFolder.thumbnail_url;
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split('.').pop();
        const fileName = `folder_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, thumbnailFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);
          
        thumbnailUrl = data.publicUrl;
      }
      
      // Update the folder
      const folderData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string || null,
        date: formData.get('date') as string,
        thumbnail_url: thumbnailUrl,
      };
      
      await updateMediaFolder(editingFolder.id, folderData);
      
      toast({
        title: "Folder updated",
        description: "The media folder has been updated successfully",
      });
      
      // Reset form and state
      setEditingFolder(null);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      
      loadMediaFolders();
    } catch (error: any) {
      toast({
        title: "Error updating folder",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadMedia = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const folderId = (formData.get('folderSelect') as string) || selectedFolder;
    
    if (!folderId) {
      toast({
        title: "Select a folder",
        description: "Please select a folder to upload media to",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload each file
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);
        
        const fileUrl = data.publicUrl;
        
        // Determine file type (image or video)
        const fileType = file.type.startsWith('image/') ? 'image' : 
                         file.type.startsWith('video/') ? 'video' : 
                         'other';
        
        // Save media item in database
        await createMediaItem({
          folder_id: folderId,
          url: fileUrl,
          type: fileType,
          title: file.name,
        });
      }
      
      toast({
        title: "Media uploaded",
        description: `${selectedFiles.length} files uploaded successfully`,
      });
      
      // Reset state
      setSelectedFiles([]);
      if (folderId && folderId !== selectedFolder) {
        setSelectedFolder(folderId);
      } else if (folderId) {
        loadMediaItems(folderId);
      }
      
    } catch (error: any) {
      toast({
        title: "Error uploading media",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFolder = async () => {
    if (!deleteItemId) return;
    
    setIsDeleting(true);
    try {
      await deleteMediaFolder(deleteItemId);
      
      toast({
        title: "Folder deleted",
        description: "The folder and all its contents have been deleted",
      });
      
      if (selectedFolder === deleteItemId) {
        setSelectedFolder(null);
        setMediaItems([]);
      }
      
      setDeleteItemId(null);
      loadMediaFolders();
    } catch (error: any) {
      toast({
        title: "Error deleting folder",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteMediaItem = async () => {
    if (!deleteItemId) return;
    
    setIsDeleting(true);
    try {
      await deleteMediaItem(deleteItemId);
      
      toast({
        title: "Media item deleted",
        description: "The media item has been deleted successfully",
      });
      
      setDeleteItemId(null);
      
      if (selectedFolder) {
        loadMediaItems(selectedFolder);
      }
    } catch (error: any) {
      toast({
        title: "Error deleting media item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditFolder = (folder: MediaFolder) => {
    setEditingFolder(folder);
    setIsCreating(false);
    if (folder.thumbnail_url) {
      setThumbnailPreview(folder.thumbnail_url);
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

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {editingFolder ? "Edit Media Folder" : "Media Folders"}
            </h2>
            {!isCreating && !editingFolder && (
              <Button 
                onClick={() => {
                  setIsCreating(true);
                  setEditingFolder(null);
                  setThumbnailPreview(null);
                }} 
                className="bg-german-red hover:bg-german-gold flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Create New Folder
              </Button>
            )}
          </div>
          
          {(isCreating || editingFolder) && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-3">
                {editingFolder ? "Edit Media Folder" : "New Media Folder"}
              </h3>
              <form onSubmit={editingFolder ? handleUpdateFolder : handleCreateFolder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="block text-sm text-gray-400 mb-2">Folder Name</Label>
                    <Input 
                      name="title" 
                      type="text" 
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="Enter folder name"
                      required
                      defaultValue={editingFolder?.title || ""}
                    />
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-400 mb-2">Date</Label>
                    <Input 
                      name="date" 
                      type="date" 
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" 
                      required
                      defaultValue={editingFolder?.date || format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="block text-sm text-gray-400 mb-2">Description (Optional)</Label>
                    <Textarea 
                      name="description" 
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="Enter folder description"
                      defaultValue={editingFolder?.description || ""}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label className="block text-sm text-gray-400 mb-2">Cover Image</Label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded bg-gray-700 hover:bg-gray-600 transition">
                        <Upload className="h-4 w-4" /> Choose Image
                      </div>
                      <Input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleThumbnailChange}
                      />
                    </label>
                    <p className="text-sm text-gray-400">
                      {thumbnailFile ? thumbnailFile.name : thumbnailPreview ? "Current cover image" : "No image selected"}
                    </p>
                  </div>
                  {thumbnailPreview && (
                    <div className="mt-3">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="h-32 object-cover rounded border border-gray-700" 
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsCreating(false);
                      setEditingFolder(null);
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-german-red hover:bg-german-gold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : editingFolder ? "Update Folder" : "Create Folder"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-400 py-8">Loading folders...</p>
          ) : mediaFolders.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No folders yet. Create your first media folder.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaFolders.map((folder) => (
                <div
                  key={folder.id}
                  className={`bg-gray-800 rounded-lg overflow-hidden border ${
                    selectedFolder === folder.id ? 'border-german-gold' : 'border-gray-700'
                  } hover:border-german-gold transition-colors duration-300`}
                >
                  <div className="aspect-video bg-gray-700 flex items-center justify-center overflow-hidden">
                    {folder.thumbnail_url ? (
                      <img 
                        src={folder.thumbnail_url} 
                        alt={folder.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Folder className="h-16 w-16 text-gray-500" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-400">
                        {format(new Date(folder.date), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Images className="h-3 w-3" /> {mediaItems.length}
                      </p>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-3">{folder.title}</h3>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className={`flex-1 ${
                          selectedFolder === folder.id ? 'bg-german-gold' : 'bg-german-red'
                        } hover:bg-german-gold`}
                        onClick={() => setSelectedFolder(folder.id)}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleEditFolder(folder)}
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          setDeleteItemId(folder.id);
                          setDeleteType('folder');
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedFolder && (
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {mediaFolders.find(f => f.id === selectedFolder)?.title} - Media Items
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setSelectedFolder(null)}
              >
                Back to Folders
              </Button>
            </div>
            
            <div className="mb-6">
              <form onSubmit={handleUploadMedia} className="space-y-4">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-500 mb-2" />
                    <p className="text-gray-400 mb-2">Drag and drop files here, or click to select files</p>
                    <p className="text-sm text-gray-500 mb-4">Supported formats: JPG, PNG, GIF, MP4, WebM</p>
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded bg-gray-800 hover:bg-gray-700 transition">
                        Browse Files
                      </div>
                      <Input 
                        type="file" 
                        className="hidden" 
                        multiple 
                        accept="image/*,video/*"
                        onChange={handleFilesChange}
                      />
                    </label>
                    {selectedFiles.length > 0 && (
                      <p className="text-sm text-gray-400 mt-2">
                        {selectedFiles.length} files selected
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-german-red hover:bg-german-gold"
                    disabled={isUploading || selectedFiles.length === 0}
                  >
                    {isUploading ? `Uploading (${selectedFiles.length} files)...` : "Upload Files"}
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-white mb-4">Media Gallery</h3>
              {loading ? (
                <p className="text-center text-gray-400 py-8">Loading media...</p>
              ) : mediaItems.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No media in this folder yet. Upload some files.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mediaItems.map((item) => (
                    <div key={item.id} className="relative group">
                      <div className="aspect-square bg-gray-800 rounded overflow-hidden border border-gray-700">
                        {item.type === 'image' ? (
                          <img 
                            src={item.url} 
                            alt={item.title || 'Media item'} 
                            className="w-full h-full object-cover"
                          />
                        ) : item.type === 'video' ? (
                          <div className="relative w-full h-full flex items-center justify-center">
                            <video 
                              src={item.url} 
                              className="w-full h-full object-cover"
                              controls={false}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Folder className="h-12 w-12 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="flex items-center gap-1"
                          onClick={() => {
                            setDeleteItemId(item.id);
                            setDeleteType('item');
                          }}
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedFolder && (
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Upload Media</h2>
            <p className="text-gray-400 mb-4">Upload images or videos to an existing folder or create a new one.</p>
            
            <form onSubmit={handleUploadMedia} className="space-y-4">
              <div className="mb-4">
                <Label className="block text-sm text-gray-400 mb-2">Select Folder</Label>
                <select 
                  name="folderSelect"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  required
                >
                  <option value="">-- Select a folder --</option>
                  {mediaFolders.map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.title}</option>
                  ))}
                </select>
                {mediaFolders.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">No folders available. Please create a folder first.</p>
                )}
              </div>
              
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center mb-4">
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-500 mb-2" />
                  <p className="text-gray-400 mb-2">Drag and drop files here, or click to select files</p>
                  <p className="text-sm text-gray-500 mb-4">Supported formats: JPG, PNG, GIF, MP4, WebM</p>
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded bg-gray-800 hover:bg-gray-700 transition">
                      Browse Files
                    </div>
                    <Input 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept="image/*,video/*"
                      onChange={handleFilesChange}
                    />
                  </label>
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      {selectedFiles.length} files selected
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-german-red hover:bg-german-gold"
                  disabled={isUploading || selectedFiles.length === 0 || mediaFolders.length === 0}
                >
                  {isUploading ? `Uploading (${selectedFiles.length} files)...` : "Upload Files"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </motion.div>

      <AlertDialog 
        open={!!deleteItemId} 
        onOpenChange={(open) => !open && setDeleteItemId(null)}
      >
        <AlertDialogContent className="bg-gray-900 text-white border border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this {deleteType === 'folder' ? 'folder' : 'item'}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {deleteType === 'folder' 
                ? "This action cannot be undone. This will permanently delete the folder and all media files inside it."
                : "This action cannot be undone. This will permanently delete the media file."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteType === 'folder' ? handleDeleteFolder : handleDeleteMediaItem} 
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

export default AdminMedia;
