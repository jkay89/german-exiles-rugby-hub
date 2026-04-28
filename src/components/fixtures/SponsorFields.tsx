import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { compressImage } from "@/utils/imageCompression";

interface SponsorFieldsProps {
  prefix: "match" | "motm" | "ball";
  label: string;
  defaults?: {
    name?: string | null;
    logo_url?: string | null;
    url?: string | null;
  };
}

const BUCKET = "match-sponsor-logos";

const SponsorFields = ({ prefix, label, defaults }: SponsorFieldsProps) => {
  const { toast } = useToast();
  const [logoUrl, setLogoUrl] = useState<string>(defaults?.logo_url ?? "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const compressed = await compressImage(file, 2, 1920);
      const ext = (compressed.name.split(".").pop() || "png").toLowerCase();
      const path = `${prefix}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, compressed, {
          cacheControl: "3600",
          upsert: false,
          contentType: compressed.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setLogoUrl(data.publicUrl);
      toast({ title: "Logo uploaded" });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Upload failed",
        description: err.message ?? "Could not upload logo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearLogo = () => setLogoUrl("");

  return (
    <div className="md:col-span-2 border border-gray-700 rounded-md p-4 bg-gray-800/40">
      <h4 className="text-german-gold font-semibold mb-3">{label}</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label className="text-white mb-1 block text-xs">Sponsor name</Label>
          <Input
            name={`${prefix}_sponsor_name`}
            placeholder="e.g. Acme Ltd"
            className="bg-gray-800 border-gray-700 text-white"
            defaultValue={defaults?.name ?? ""}
          />
        </div>

        <div>
          <Label className="text-white mb-1 block text-xs">Logo</Label>
          {/* Hidden input so the parent <form> submits the URL via FormData */}
          <input
            type="hidden"
            name={`${prefix}_sponsor_logo_url`}
            value={logoUrl}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          {logoUrl ? (
            <div className="flex items-center gap-2">
              <img
                src={logoUrl}
                alt="Sponsor logo preview"
                className="h-10 w-auto object-contain bg-white rounded p-0.5"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={clearLogo}
                disabled={uploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" /> Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-3 w-3 mr-2" /> Upload logo
                </>
              )}
            </Button>
          )}
        </div>

        <div>
          <Label className="text-white mb-1 block text-xs">Link URL</Label>
          <Input
            name={`${prefix}_sponsor_url`}
            type="url"
            placeholder="https://..."
            className="bg-gray-800 border-gray-700 text-white"
            defaultValue={defaults?.url ?? ""}
          />
        </div>
      </div>
    </div>
  );
};

export default SponsorFields;
