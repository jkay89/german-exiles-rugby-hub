
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PlayerImageResizer from "./PlayerImageResizer";
import { PlayerSponsorsManager, PlayerSponsor } from "./PlayerSponsorsManager";
import { supabase } from "@/integrations/supabase/client";

interface PlayerFormProps {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  initialValues?: {
    id?: string;
    name?: string;
    number?: number | null;
    position?: string;
    team?: string;
    heritage?: string;
    club?: string;
    bio?: string;
    photo_url?: string;
    national_number?: string;
    sponsor_name?: string;
    sponsor_logo_url?: string;
    sponsor_website?: string;
  };
}

const PlayerForm: React.FC<PlayerFormProps> = ({
  isEditing,
  onSubmit,
  onCancel,
  initialValues = {},
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialValues?.photo_url || null);
  const [showResizer, setShowResizer] = useState(false);
  const [resizerFile, setResizerFile] = useState<File | null>(null);
  const [playerName, setPlayerName] = useState(initialValues?.name || "");
  const [sponsors, setSponsors] = useState<PlayerSponsor[]>([]);
  const [loadingSponsors, setLoadingSponsors] = useState(false);

  // Load existing sponsors when editing
  useEffect(() => {
    const loadSponsors = async () => {
      if (isEditing && initialValues?.id) {
        console.log('Loading sponsors for player:', initialValues.id);
        setLoadingSponsors(true);
        try {
          const { data, error } = await supabase
            .from('player_sponsors')
            .select('*')
            .eq('player_id', initialValues.id)
            .order('display_order', { ascending: true });

          if (error) {
            console.error('Error loading sponsors:', error);
            throw error;
          }
          
          console.log('Loaded sponsors:', data);
          
          if (data && data.length > 0) {
            const loadedSponsors: PlayerSponsor[] = data.map(s => ({
              id: s.id,
              sponsor_name: s.sponsor_name,
              sponsor_logo_url: s.sponsor_logo_url || undefined,
              sponsor_website: s.sponsor_website || undefined,
              display_order: s.display_order,
            }));
            setSponsors(loadedSponsors);
          }
        } catch (error) {
          console.error('Error loading sponsors:', error);
        } finally {
          setLoadingSponsors(false);
        }
      }
    };

    loadSponsors();
  }, [isEditing, initialValues?.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResizerFile(file);
      setShowResizer(true);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  const handleResizedImage = (resizedFile: File) => {
    setSelectedFile(resizedFile);
    
    // Create a preview URL for the resized file
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        setPreviewUrl(fileReader.result);
      }
    };
    fileReader.readAsDataURL(resizedFile);
    
    setShowResizer(false);
  };

  const handleCancelResize = () => {
    setShowResizer(false);
    setResizerFile(null);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    
    console.log('Form submit - current sponsors state:', sponsors);
    
    // Append sponsor files to the form as actual file inputs
    sponsors.forEach((sponsor, index) => {
      if (sponsor._logoFile) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.name = `sponsor_file_${index}`;
        fileInput.style.display = 'none';
        
        // Create a DataTransfer to add the file to the input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(sponsor._logoFile);
        fileInput.files = dataTransfer.files;
        
        form.appendChild(fileInput);
        console.log(`Appended sponsor file input ${index}:`, sponsor._logoFile.name);
      }
    });
    
    // Add sponsors metadata (without File objects)
    const sponsorsMetadata = sponsors.map(s => ({
      sponsor_name: s.sponsor_name,
      sponsor_logo_url: s.sponsor_logo_url,
      sponsor_website: s.sponsor_website,
      display_order: s.display_order,
      _hasFile: !!s._logoFile,
    }));
    
    const sponsorsInput = document.createElement('input');
    sponsorsInput.type = 'hidden';
    sponsorsInput.name = 'sponsors';
    sponsorsInput.value = JSON.stringify(sponsorsMetadata);
    form.appendChild(sponsorsInput);
    
    console.log('Form submit - sponsors metadata:', JSON.stringify(sponsorsMetadata));
    
    onSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-400">Name</Label>
          <Input
            name="name"
            required
            placeholder="Player name"
            className="bg-gray-800 border-gray-700 text-white"
            defaultValue={initialValues?.name || ""}
            onChange={handleNameChange}
          />
        </div>

        <div>
          <Label className="text-gray-400">Number</Label>
          <Input
            name="number"
            type="number"
            min="1"
            max="99"
            placeholder="Jersey number"
            className="bg-gray-800 border-gray-700 text-white"
            defaultValue={initialValues?.number || ""}
          />
        </div>

        <div>
          <Label className="text-gray-400">Position</Label>
          <Input
            name="position"
            placeholder="Player position"
            className="bg-gray-800 border-gray-700 text-white"
            defaultValue={initialValues?.position || ""}
          />
        </div>

        <div>
          <Label className="text-gray-400">Team</Label>
          {isEditing ? (
            <Select name="team" required defaultValue={initialValues?.team || ""}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="heritage">Heritage Team</SelectItem>
                <SelectItem value="community">Community Team</SelectItem>
                <SelectItem value="exiles9s">Exiles 9s</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <>
              <Input
                name="team"
                value={initialValues?.team === 'heritage' ? 'Heritage Team' : 
                       initialValues?.team === 'community' ? 'Community Team' : 
                       initialValues?.team === 'exiles9s' ? 'Exiles 9s' : ''}
                readOnly
                className="bg-gray-800 border-gray-700 text-white cursor-not-allowed"
              />
              <input type="hidden" name="team" value={initialValues?.team || ""} />
            </>
          )}
        </div>

        <div>
          <Label className="text-gray-400">Heritage</Label>
          <Select name="heritage" defaultValue={initialValues?.heritage || ""}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select heritage" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              <SelectItem value="DE">German (DE)</SelectItem>
              <SelectItem value="GB">British (GB)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-400">Club</Label>
          <Input
            name="club"
            placeholder="Current club"
            className="bg-gray-800 border-gray-700 text-white"
            defaultValue={initialValues?.club || ""}
          />
        </div>

        <div>
          <Label className="text-gray-400">National Team Heritage Number</Label>
          <Input
            name="national_number"
            placeholder="e.g. #204"
            className="bg-gray-800 border-gray-700 text-white"
            defaultValue={initialValues?.national_number || ""}
          />
        </div>

        <div className="md:col-span-2">
          <PlayerSponsorsManager
            initialSponsors={sponsors}
            onChange={setSponsors}
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-gray-400">Bio</Label>
          <Textarea
            name="bio"
            placeholder="Player biography"
            className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
            defaultValue={initialValues?.bio || ""}
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-gray-400">Photo</Label>
          <div className="flex items-center gap-4 mt-2">
            {previewUrl && (
              <Avatar className="h-16 w-16">
                <AvatarImage src={previewUrl} alt="Player" />
                <AvatarFallback className="bg-gray-700">
                  {playerName?.split(' ').map(n => n[0]).join('') || 'PL'}
                </AvatarFallback>
              </Avatar>
            )}
            
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded bg-gray-800 hover:bg-gray-700 transition">
                <Upload className="h-4 w-4" /> Upload Photo
              </div>
              <Input 
                type="file" 
                name="photo" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-sm text-gray-400">
              {selectedFile ? selectedFile.name : previewUrl ? "Current photo" : "No file selected"}
            </p>
          </div>
        </div>
      </div>

      {/* Image Resizer Dialog */}
      <PlayerImageResizer
        open={showResizer}
        onClose={handleCancelResize}
        onSave={handleResizedImage}
        initialImage={resizerFile}
        playerName={playerName}
      />

      {/* Hidden input to track if we have a selected file */}
      <input type="hidden" name="selectedFile" value={selectedFile ? "true" : "false"} />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-german-red hover:bg-german-gold">
          {isEditing ? "Update Player" : "Add Player"}
        </Button>
      </div>
    </form>
  );
};

export default PlayerForm;
