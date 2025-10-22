import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle2, XCircle, Loader2, FileArchive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import JSZip from "jszip";
import { uploadToCloudinary } from "@/utils/cloudinaryUtils";
import { supabase } from "@/integrations/supabase/client-extensions";

interface BulkZipUploadProps {
  onUploadComplete: () => void;
  folderId: string;
}

interface FileStatus {
  filename: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export const BulkZipUpload = ({ onUploadComplete, folderId }: BulkZipUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const isImageFile = (filename: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const lowerFilename = filename.toLowerCase();
    return imageExtensions.some(ext => lowerFilename.endsWith(ext));
  };

  const handleZipUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      toast({
        title: "Invalid file",
        description: "Please upload a .zip file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setFileStatuses([]);
    setProgress(0);

    try {
      // Load and extract zip file
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      
      // Get all image files from zip
      const imageFiles: { name: string; data: Blob }[] = [];
      
      for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
        // Skip directories and non-image files
        if (zipEntry.dir || !isImageFile(filename)) continue;
        
        // Skip hidden files and __MACOSX folder
        if (filename.startsWith('__MACOSX') || filename.includes('/.')) continue;
        
        const blob = await zipEntry.async('blob');
        // Get just the filename without path
        const cleanFilename = filename.split('/').pop() || filename;
        imageFiles.push({ name: cleanFilename, data: blob });
      }

      if (imageFiles.length === 0) {
        toast({
          title: "No images found",
          description: "The zip file doesn't contain any image files",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Initialize status for all files
      const statuses: FileStatus[] = imageFiles.map(f => ({
        filename: f.name,
        status: 'pending'
      }));
      setFileStatuses(statuses);

      // Upload each image
      for (let i = 0; i < imageFiles.length; i++) {
        const { name, data } = imageFiles[i];
        
        try {
          // Convert blob to File object
          const file = new File([data], name, { type: data.type || 'image/jpeg' });
          
          // Upload to Cloudinary
          const result = await uploadToCloudinary(file, 'media');
          
          // Save to database
          const { error: dbError } = await supabase.rest
            .from('media_items')
            .insert([{
              folder_id: folderId,
              url: result.url,
              type: 'image',
              title: name
            }]);

          if (dbError) throw dbError;

          statuses[i] = { filename: name, status: 'success' };
        } catch (error: any) {
          console.error(`Error uploading ${name}:`, error);
          statuses[i] = { 
            filename: name, 
            status: 'error', 
            error: error.message 
          };
        }

        setFileStatuses([...statuses]);
        setProgress(((i + 1) / imageFiles.length) * 100);
      }

      const successCount = statuses.filter(s => s.status === 'success').length;
      
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${successCount} of ${imageFiles.length} images`,
      });

      if (successCount > 0) {
        onUploadComplete();
      }

    } catch (error: any) {
      console.error("Error processing zip file:", error);
      toast({
        title: "Error processing zip file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileArchive className="h-5 w-5" />
          Bulk Upload from Zip File
        </CardTitle>
        <CardDescription className="text-gray-400">
          Upload a .zip file containing multiple images for quick batch upload
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-gray-900 border-gray-700">
          <AlertDescription className="text-gray-400 text-sm">
            <strong className="text-white">💡 How to use:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li><strong>Google Drive:</strong> Right-click folder → Download (creates zip)</li>
              <li><strong>Dropbox:</strong> Select folder → Download (creates zip)</li>
              <li><strong>OneDrive:</strong> Select folder → Download (creates zip)</li>
              <li>Upload the downloaded .zip file here</li>
            </ol>
            <p className="mt-2 text-green-400">✓ All images will be automatically extracted and uploaded</p>
          </AlertDescription>
        </Alert>

        <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-german-gold transition-colors">
          <input
            type="file"
            id="zipUpload"
            accept=".zip"
            className="hidden"
            onChange={handleZipUpload}
            disabled={isUploading}
          />
          <label htmlFor="zipUpload" className="cursor-pointer">
            <FileArchive className="h-12 w-12 mx-auto mb-3 text-gray-500" />
            <p className="text-white mb-1">
              {isUploading ? "Processing..." : "Click to upload .zip file"}
            </p>
            <p className="text-gray-500 text-sm">
              All images inside will be extracted and uploaded
            </p>
          </label>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-400 text-center">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}

        {fileStatuses.length > 0 && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            <Label className="text-white">Upload Results:</Label>
            {fileStatuses.map((status, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 rounded bg-gray-900 text-sm"
              >
                {status.status === 'success' && (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                )}
                {status.status === 'error' && (
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                {status.status === 'pending' && (
                  <Loader2 className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5 animate-spin" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 truncate">{status.filename}</p>
                  {status.error && (
                    <p className="text-red-400 text-xs mt-1">{status.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
