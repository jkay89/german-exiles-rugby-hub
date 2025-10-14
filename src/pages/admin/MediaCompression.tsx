import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileArchive, CheckCircle, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface FileItem {
  name: string;
  size: number;
  sizeMB: number;
  bucket: string;
  publicUrl: string;
}

const MediaCompression = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [compressing, setCompressing] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [compressionResults, setCompressionResults] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }
    loadLargeFiles();
  }, [isAuthenticated]);

  const loadLargeFiles = async () => {
    try {
      setLoading(true);
      
      // Check media bucket for large files
      const { data: mediaFiles, error } = await supabase.storage
        .from('media')
        .list();

      if (error) throw error;

      const largeFiles: FileItem[] = [];
      
      for (const file of mediaFiles || []) {
        const size = file.metadata?.size || 0;
        const sizeMB = size / 1024 / 1024;
        
        // Only show files over 3MB
        if (sizeMB > 3) {
          const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(file.name);
          
          largeFiles.push({
            name: file.name,
            size,
            sizeMB,
            bucket: 'media',
            publicUrl: urlData.publicUrl
          });
        }
      }

      largeFiles.sort((a, b) => b.sizeMB - a.sizeMB);
      setFiles(largeFiles);
      
      if (largeFiles.length === 0) {
        toast.success("No large files found! All files are under 3MB.");
      } else {
        toast.info(`Found ${largeFiles.length} files over 3MB`);
      }
    } catch (error: any) {
      console.error("Error loading files:", error);
      toast.error(`Failed to load files: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleFileSelection = (fileName: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileName)) {
      newSelection.delete(fileName);
    } else {
      newSelection.add(fileName);
    }
    setSelectedFiles(newSelection);
  };

  const selectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(f => f.name)));
    }
  };

  const compressImage = async (file: FileItem): Promise<Blob> => {
    // Download the image
    const response = await fetch(file.publicUrl);
    const blob = await response.blob();
    
    // Create image element
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = URL.createObjectURL(blob);
    });

    // Create canvas for compression
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Resize to max 1200px on longest side
    const maxDimension = 1200;
    let width = img.width;
    let height = img.height;

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Convert to blob with compression
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (compressedBlob) => {
          if (compressedBlob) {
            resolve(compressedBlob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        0.75 // 75% quality
      );
    });
  };

  const compressSelectedFiles = async () => {
    if (selectedFiles.size === 0) {
      toast.error("Please select files to compress");
      return;
    }

    setCompressing(true);
    const results: Record<string, string> = {};
    let successCount = 0;
    let failCount = 0;

    for (const fileName of selectedFiles) {
      try {
        const file = files.find(f => f.name === fileName);
        if (!file) continue;

        toast.info(`Compressing ${fileName}...`);

        // Compress the image
        const compressedBlob = await compressImage(file);
        const compressedSizeMB = compressedBlob.size / 1024 / 1024;

        // Upload back to storage (overwrite)
        const { error: uploadError } = await supabase.storage
          .from(file.bucket)
          .upload(fileName, compressedBlob, {
            upsert: true,
            contentType: 'image/jpeg'
          });

        if (uploadError) throw uploadError;

        const reduction = ((file.sizeMB - compressedSizeMB) / file.sizeMB * 100).toFixed(1);
        results[fileName] = `✓ Compressed from ${file.sizeMB.toFixed(2)}MB to ${compressedSizeMB.toFixed(2)}MB (${reduction}% reduction)`;
        successCount++;
        
        toast.success(`Compressed ${fileName}`);
      } catch (error: any) {
        console.error(`Error compressing ${fileName}:`, error);
        results[fileName] = `✗ Failed: ${error.message}`;
        failCount++;
        toast.error(`Failed to compress ${fileName}`);
      }
    }

    setCompressionResults(results);
    setCompressing(false);

    toast.success(`Compression complete: ${successCount} succeeded, ${failCount} failed`);
    
    // Reload the file list
    await loadLargeFiles();
    setSelectedFiles(new Set());
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-german-gold" />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-german-gold mb-2">Media File Compression</h1>
            <p className="text-gray-400">Compress large files before migrating to Cloudinary</p>
          </div>
          <Button 
            onClick={() => navigate("/admin/cloudinary-migration")}
            variant="outline"
          >
            Back to Migration
          </Button>
        </div>

        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-300">
            <p>• Files will be resized to max 1200px and compressed to 75% quality JPEG</p>
            <p>• Original files will be overwritten in Supabase storage</p>
            <p>• After compression, return to the migration page to complete the Cloudinary migration</p>
            <p>• Files under 3MB don't need compression</p>
          </CardContent>
        </Card>

        {files.length > 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">
                Large Files ({files.length} files, {selectedFiles.size} selected)
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={selectAll}
                  variant="outline"
                  size="sm"
                >
                  {selectedFiles.size === files.length ? "Deselect All" : "Select All"}
                </Button>
                <Button
                  onClick={compressSelectedFiles}
                  disabled={compressing || selectedFiles.size === 0}
                  className="bg-german-gold hover:bg-german-gold/90 text-black"
                >
                  {compressing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <FileArchive className="h-4 w-4 mr-2" />
                      Compress Selected ({selectedFiles.size})
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {files.map((file) => (
                  <div 
                    key={file.name}
                    className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <Checkbox
                      checked={selectedFiles.has(file.name)}
                      onCheckedChange={() => toggleFileSelection(file.name)}
                      disabled={compressing}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white">{file.name}</div>
                      <div className="text-sm text-gray-400">
                        Size: {file.sizeMB.toFixed(2)}MB
                      </div>
                      {compressionResults[file.name] && (
                        <div className={`text-sm mt-1 ${
                          compressionResults[file.name].startsWith('✓') 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {compressionResults[file.name]}
                        </div>
                      )}
                    </div>
                    <div className={`px-3 py-1 rounded text-sm font-medium ${
                      file.sizeMB > 8 
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {file.sizeMB > 8 ? 'Too Large' : 'Large'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {files.length === 0 && !loading && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">All files are optimized!</h3>
              <p className="text-gray-400 mb-4">No files over 3MB found in the media bucket.</p>
              <Button 
                onClick={() => navigate("/admin/cloudinary-migration")}
                className="bg-german-gold hover:bg-german-gold/90 text-black"
              >
                Proceed to Migration
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MediaCompression;
