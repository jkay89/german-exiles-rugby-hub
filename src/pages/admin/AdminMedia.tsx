
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { folder, plus, upload, images } from "lucide-react";

// Sample media folders
const mediaFolders = [
  {
    id: "schlicht-exiles-9s-rotterdam-2025",
    title: "Schlicht Exiles 9s - Rotterdam 2025",
    date: "April 22, 2025",
    count: 7,
    thumbnail: "/lovable-uploads/dc8c46be-81e9-4ddf-9b23-adc3f72d2989.png"
  }
];

const AdminMedia = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

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
          <h1 className="text-3xl font-bold text-white">Media Management</h1>
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Media Folders</h2>
            <Button 
              onClick={() => setIsCreating(!isCreating)} 
              className="bg-german-red hover:bg-german-gold flex items-center gap-2"
            >
              <plus className="h-4 w-4" /> Create New Folder
            </Button>
          </div>
          
          {isCreating && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-3">New Media Folder</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Folder Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    placeholder="Enter folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date</label>
                  <input type="date" className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Cover Image</label>
                <Button className="bg-gray-700 text-white flex items-center gap-2">
                  <upload className="h-4 w-4" /> Choose Image
                </Button>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button className="bg-german-red hover:bg-german-gold">Create Folder</Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaFolders.map((folder) => (
              <div
                key={folder.id}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-german-gold transition-colors duration-300"
              >
                <div className="aspect-video bg-gray-700 flex items-center justify-center overflow-hidden">
                  <img 
                    src={folder.thumbnail} 
                    alt={folder.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400">{folder.date}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <images className="h-3 w-3" /> {folder.count}
                    </p>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-3">{folder.title}</h3>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-german-red hover:bg-german-gold">Edit</Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <upload className="h-3 w-3" /> Add Files
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Upload Media</h2>
          <p className="text-gray-400 mb-4">Upload images or videos to an existing folder or create a new one.</p>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Select Folder</label>
            <select className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white">
              <option value="">-- Select a folder --</option>
              {mediaFolders.map(folder => (
                <option key={folder.id} value={folder.id}>{folder.title}</option>
              ))}
              <option value="new">Create New Folder</option>
            </select>
          </div>
          
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center mb-4">
            <div className="flex flex-col items-center">
              <upload className="h-12 w-12 text-gray-500 mb-2" />
              <p className="text-gray-400 mb-2">Drag and drop files here, or click to select files</p>
              <p className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF, MP4, WebM</p>
              <Button className="mt-4 bg-gray-800 text-white">Browse Files</Button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button className="bg-german-red hover:bg-german-gold">Upload Files</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminMedia;
