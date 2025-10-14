import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CloudUpload, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

interface MigrationJob {
  bucket: string;
  table: string;
  urlColumn: string;
  idColumn: string;
  folder: string;
  label: string;
}

const migrationJobs: MigrationJob[] = [
  {
    bucket: "players",
    table: "players",
    urlColumn: "photo_url",
    idColumn: "id",
    folder: "players",
    label: "Player Photos"
  },
  {
    bucket: "players",
    table: "coaching_staff",
    urlColumn: "photo_url",
    idColumn: "id",
    folder: "coaching-staff",
    label: "Coaching Staff Photos"
  },
  {
    bucket: "players",
    table: "committee_members",
    urlColumn: "photo_url",
    idColumn: "id",
    folder: "committee-members",
    label: "Committee Member Photos"
  },
  {
    bucket: "sponsors",
    table: "sponsors",
    urlColumn: "logo_url",
    idColumn: "id",
    folder: "sponsors",
    label: "Sponsor Logos"
  },
  {
    bucket: "news",
    table: "news",
    urlColumn: "image_url",
    idColumn: "id",
    folder: "news",
    label: "News Images"
  },
  {
    bucket: "media",
    table: "media_items",
    urlColumn: "url",
    idColumn: "id",
    folder: "media",
    label: "Media Items"
  },
  {
    bucket: "media",
    table: "media_folders",
    urlColumn: "thumbnail_url",
    idColumn: "id",
    folder: "media",
    label: "Media Folder Thumbnails"
  }
];

interface MigrationResult {
  total: number;
  migrated: number;
  failed: number;
  skipped: number;
  remaining: number;
  errors: Array<{ file: string; error: string }>;
}

const CloudinaryMigration = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [migrating, setMigrating] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, MigrationResult>>({});

  if (!isAuthenticated) {
    navigate("/admin");
    return null;
  }

  const handleMigrate = async (job: MigrationJob) => {
    setMigrating(job.label);
    
    try {
      toast.info(`Starting migration for ${job.label}...`);

      const { data, error } = await supabase.functions.invoke("migrate-to-cloudinary", {
        body: {
          bucket: job.bucket,
          table: job.table,
          urlColumn: job.urlColumn,
          idColumn: job.idColumn,
          folder: job.folder
        }
      });

      if (error) throw error;

      setResults(prev => ({
        ...prev,
        [job.label]: data
      }));

      if (data.failed > 0 || data.skipped > 0) {
        toast.warning(`${job.label}: Migrated ${data.migrated}/${data.total} files. ${data.failed} failed, ${data.skipped} skipped. ${data.remaining} remaining.`);
      } else if (data.remaining > 0) {
        toast.success(`${job.label}: Migrated ${data.migrated} files. ${data.remaining} files remaining - click again to continue.`);
      } else {
        toast.success(`${job.label}: Successfully migrated all ${data.migrated} files!`);
      }
    } catch (error: any) {
      console.error("Migration error:", error);
      toast.error(`Failed to migrate ${job.label}: ${error.message}`);
    } finally {
      setMigrating(null);
    }
  };

  const handleMigrateAll = async () => {
    for (const job of migrationJobs) {
      await handleMigrate(job);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-german-gold mb-2">Cloudinary Migration Tool</h1>
            <p className="text-gray-400">Migrate existing images from Supabase Storage to Cloudinary</p>
          </div>
          <Button 
            onClick={() => navigate("/admin/dashboard")}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>

        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CloudUpload className="h-5 w-5 text-german-gold" />
              Migration Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-2">
            <p>This tool will:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Process 5 files at a time to avoid memory issues</li>
              <li>Skip files over 8MB (need manual compression first)</li>
              <li>Resize files over 3MB automatically</li>
              <li>Upload to Cloudinary in the appropriate folder</li>
              <li>Update database records with new Cloudinary URLs</li>
            </ol>
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
              <p className="text-yellow-400 font-medium mb-2">
                ⚠️ Have files over 8MB?
              </p>
              <Button
                onClick={() => navigate("/admin/media-compression")}
                variant="outline"
                size="sm"
              >
                Compress Large Files First →
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <Button 
            onClick={handleMigrateAll}
            disabled={!!migrating}
            className="bg-german-red hover:bg-german-gold"
          >
            {migrating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Migrating...
              </>
            ) : (
              <>
                <CloudUpload className="h-4 w-4 mr-2" />
                Migrate All
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {migrationJobs.map((job) => {
            const result = results[job.label];
            const isMigrating = migrating === job.label;

            return (
              <Card key={job.label} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{job.label}</CardTitle>
                  <p className="text-sm text-gray-400">
                    Bucket: {job.bucket} → Folder: {job.folder}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Total Files:</span>
                          <span className="text-white">{result.total}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Migrated:</span>
                          <span className="text-green-400 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            {result.migrated}
                          </span>
                        </div>
                        {result.failed > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Failed:</span>
                            <span className="text-red-400 flex items-center gap-1">
                              <XCircle className="h-4 w-4" />
                              {result.failed}
                            </span>
                          </div>
                        )}
                        {result.skipped > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Skipped (too large):</span>
                            <span className="text-yellow-400 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {result.skipped}
                            </span>
                          </div>
                        )}
                        {result.remaining > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Remaining:</span>
                            <span className="text-blue-400 flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {result.remaining}
                            </span>
                          </div>
                        )}
                        {result.errors.length > 0 && (
                          <details className="mt-2">
                            <summary className="text-sm text-red-400 cursor-pointer">
                              View Errors ({result.errors.length})
                            </summary>
                            <div className="mt-2 space-y-1 text-xs text-gray-400 max-h-40 overflow-y-auto">
                              {result.errors.map((err, idx) => (
                                <div key={idx} className="border-l-2 border-red-500 pl-2">
                                  <div className="font-medium">{err.file}</div>
                                  <div className="text-red-300">{err.error}</div>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    )}

                    <Button
                      onClick={() => handleMigrate(job)}
                      disabled={!!migrating}
                      variant="outline"
                      className="w-full"
                    >
                      {isMigrating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Migrating...
                        </>
                      ) : result ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Migrate Again
                        </>
                      ) : (
                        <>
                          <CloudUpload className="h-4 w-4 mr-2" />
                          Start Migration
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CloudinaryMigration;
