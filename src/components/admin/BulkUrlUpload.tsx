import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface BulkUrlUploadProps {
  onUploadComplete: () => void;
  folderId: string;
}

interface UploadStatus {
  url: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export const BulkUrlUpload = ({ onUploadComplete, folderId }: BulkUrlUploadProps) => {
  const [urls, setUrls] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [progress, setProgress] = useState(0);

  const isValidImageUrl = (url: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const urlLower = url.toLowerCase();
    return imageExtensions.some(ext => urlLower.includes(ext));
  };

  const convertToDirectUrl = (url: string): string => {
    url = url.trim();
    
    // Google Drive conversion - only for individual files
    if (url.includes('drive.google.com')) {
      // Check if it's a folder link
      if (url.includes('/folders/') || url.includes('folder')) {
        throw new Error('Folder links not supported. Please provide individual file URLs.');
      }
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
      }
    }
    
    // Dropbox conversion - only for individual files
    if (url.includes('dropbox.com')) {
      // Check if it's a folder link
      if (url.includes('/sh/') || !url.includes('/s/')) {
        throw new Error('Folder links not supported. Please provide individual file URLs (right-click file → Copy link).');
      }
      return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '?dl=1').replace('?dl=1', '');
    }
    
    // OneDrive conversion
    if (url.includes('1drv.ms') || url.includes('onedrive.live.com')) {
      return url.includes('download=1') ? url : `${url}${url.includes('?') ? '&' : '?'}download=1`;
    }
    
    return url;
  };

  const handleBulkUpload = async () => {
    const urlList = urls.split('\n').filter(url => url.trim());
    
    if (urlList.length === 0) {
      return;
    }

    setIsUploading(true);
    const statuses: UploadStatus[] = urlList.map(url => ({
      url,
      status: 'pending'
    }));
    setUploadStatuses(statuses);
    setProgress(0);

    const { supabase } = await import("@/integrations/supabase/client");

    for (let i = 0; i < urlList.length; i++) {
      const originalUrl = urlList[i].trim();
      
      try {
        // Validate URL points to an image
        if (!isValidImageUrl(originalUrl) && !originalUrl.includes('drive.google.com') && !originalUrl.includes('dropbox.com')) {
          throw new Error('URL must point to an image file (.jpg, .png, etc.)');
        }

        // Convert to direct download URL
        const directUrl = convertToDirectUrl(originalUrl);
        
        // Call Supabase edge function
        const { data: uploadData, error: uploadError } = await supabase.functions.invoke(
          "upload-from-url",
          {
            body: {
              url: directUrl,
              folderId: folderId,
              folder: 'media'
            }
          }
        );

        if (uploadError) {
          throw new Error(uploadError.message || 'Upload failed');
        }

        if (!uploadData || !uploadData.url) {
          throw new Error('Invalid response from upload function');
        }

        statuses[i] = { url: originalUrl, status: 'success' };
      } catch (error: any) {
        console.error(`Error uploading ${originalUrl}:`, error);
        statuses[i] = { 
          url: originalUrl, 
          status: 'error', 
          error: error.message 
        };
      }

      setUploadStatuses([...statuses]);
      setProgress(((i + 1) / urlList.length) * 100);
    }

    setIsUploading(false);
    
    // Call completion callback
    const successCount = statuses.filter(s => s.status === 'success').length;
    if (successCount > 0) {
      onUploadComplete();
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Upload from URLs
        </CardTitle>
        <CardDescription className="text-gray-400">
          Upload files from Google Drive, Dropbox, OneDrive, or direct URLs. Paste one URL per line.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="urls" className="text-white">File URLs</Label>
          <Textarea
            id="urls"
            placeholder="https://drive.google.com/file/d/...&#10;https://www.dropbox.com/s/...&#10;https://example.com/image.jpg"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white min-h-[150px] font-mono text-sm"
            disabled={isUploading}
          />
        </div>

        <Alert className="bg-gray-900 border-gray-700">
          <AlertDescription className="text-gray-400 text-sm">
            <strong className="text-white">⚠️ Important: Individual file URLs only</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Google Drive:</strong> Open file → Right-click → "Get link" → Make sure it's a single file link (contains /d/FILE_ID)</li>
              <li><strong>Dropbox:</strong> Right-click file → "Copy link" (NOT folder share link)</li>
              <li><strong>OneDrive:</strong> Individual file share link only</li>
              <li><strong>Direct URLs:</strong> Must end with image extension (.jpg, .png, etc.)</li>
            </ul>
            <p className="mt-2 text-yellow-400">❌ Folder/album links will NOT work. You need individual file URLs, one per line.</p>
          </AlertDescription>
        </Alert>

        <Button
          onClick={handleBulkUpload}
          disabled={isUploading || !urls.trim()}
          className="w-full bg-german-red hover:bg-german-gold"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Start Bulk Upload
            </>
          )}
        </Button>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-400 text-center">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}

        {uploadStatuses.length > 0 && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            <Label className="text-white">Upload Results:</Label>
            {uploadStatuses.map((status, idx) => (
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
                  <p className="text-gray-300 truncate">{status.url}</p>
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
