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

  const convertToDirectUrl = (url: string): string => {
    url = url.trim();
    
    // Google Drive conversion
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
      }
    }
    
    // Dropbox conversion
    if (url.includes('dropbox.com')) {
      return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
    }
    
    // OneDrive conversion
    if (url.includes('1drv.ms') || url.includes('onedrive.live.com')) {
      // OneDrive requires download parameter
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
      const originalUrl = urlList[i];
      const directUrl = convertToDirectUrl(originalUrl);
      
      try {
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
            <strong className="text-white">Supported sources:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Google Drive: Share link or file URL</li>
              <li>Dropbox: Shared file link</li>
              <li>OneDrive: Shared file link</li>
              <li>Direct URLs: Any publicly accessible file URL</li>
            </ul>
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
