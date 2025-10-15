import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Upload } from "lucide-react";
import { uploadToCloudinary } from "@/utils/cloudinaryUtils";
import { toast } from "sonner";

export interface PlayerSponsor {
  id?: string;
  sponsor_name: string;
  sponsor_logo_url?: string;
  sponsor_website?: string;
  display_order: number;
  _logoFile?: File; // Temporary field for file upload
  _logoPreview?: string; // Temporary field for preview
}

interface PlayerSponsorsManagerProps {
  initialSponsors?: PlayerSponsor[];
  onChange: (sponsors: PlayerSponsor[]) => void;
  onFileChange?: (index: number, file: File | null) => void;
}

export const PlayerSponsorsManager = ({ initialSponsors = [], onChange, onFileChange }: PlayerSponsorsManagerProps) => {
  const [sponsors, setSponsors] = useState<PlayerSponsor[]>(initialSponsors);
  const isInitialMount = useRef(true);

  // Update from initialSponsors whenever they change
  useEffect(() => {
    console.log('PlayerSponsorsManager - initialSponsors changed:', initialSponsors);
    setSponsors(initialSponsors);
  }, [initialSponsors]);

  // Only call onChange after initial mount to avoid infinite loops
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    console.log('Sponsors state changed, calling onChange:', sponsors);
    onChange(sponsors);
  }, [sponsors, onChange]);

  const addSponsor = () => {
    const newSponsor: PlayerSponsor = {
      sponsor_name: "",
      sponsor_logo_url: "",
      sponsor_website: "",
      display_order: sponsors.length,
    };
    setSponsors([...sponsors, newSponsor]);
  };

  const removeSponsor = (index: number) => {
    const updated = sponsors.filter((_, i) => i !== index);
    // Reorder remaining sponsors
    updated.forEach((s, i) => s.display_order = i);
    setSponsors(updated);
  };

  const updateSponsor = (index: number, field: keyof PlayerSponsor, value: any) => {
    const updated = [...sponsors];
    updated[index] = { ...updated[index], [field]: value };
    setSponsors(updated);
  };

  const handleLogoChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('Logo change event - file:', file);
    if (!file) return;

    // Notify parent about file change via callback
    if (onFileChange) {
      onFileChange(index, file);
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      updateSponsor(index, "_logoPreview", reader.result as string);
      console.log('Set preview for sponsor', index);
    };
    reader.readAsDataURL(file);
    
    // Still set in local state for UI purposes, but parent will handle actual file
    updateSponsor(index, "_logoFile", file);
    console.log('Set file for sponsor', index, ':', file.name);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-gray-400">Sponsors</Label>
        <Button
          type="button"
          onClick={addSponsor}
          variant="outline"
          size="sm"
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sponsor
        </Button>
      </div>

      {sponsors.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">No sponsors added yet</p>
      )}

      {sponsors.map((sponsor, index) => (
        <div key={index} className="relative border border-gray-700 rounded-lg p-4 space-y-3 bg-gray-800/50">
          <Button
            type="button"
            onClick={() => removeSponsor(index)}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="grid gap-3">
            <div>
              <Label className="text-gray-400 text-sm">Logo *</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoChange(index, e)}
                  className="bg-gray-800 border-gray-700 text-white file:text-white"
                />
                {(sponsor._logoPreview || sponsor.sponsor_logo_url) && (
                  <img
                    src={sponsor._logoPreview || sponsor.sponsor_logo_url}
                    alt="Logo preview"
                    className="w-16 h-16 object-contain border border-gray-700 rounded"
                  />
                )}
              </div>
            </div>

            <div>
              <Label className="text-gray-400 text-sm">Website (optional)</Label>
              <Input
                value={sponsor.sponsor_website || ""}
                onChange={(e) => updateSponsor(index, "sponsor_website", e.target.value)}
                placeholder="https://sponsor-website.com"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">If empty, logo will link to homepage</p>
            </div>

            <div>
              <Label className="text-gray-400 text-sm">Sponsor Name (optional)</Label>
              <Input
                value={sponsor.sponsor_name}
                onChange={(e) => updateSponsor(index, "sponsor_name", e.target.value)}
                placeholder="Company name (for internal reference)"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
