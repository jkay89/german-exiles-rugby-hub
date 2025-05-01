
import React, { useState } from "react";
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

interface PlayerFormProps {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  initialValues?: {
    name?: string;
    number?: number | null;
    position?: string;
    team?: string;
    heritage?: string;
    club?: string;
    bio?: string;
    photo_url?: string;
    national_number?: string;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL for the selected file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          setPreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-400">Name</Label>
          <Input
            name="name"
            required
            placeholder="Player name"
            className="bg-gray-800 border-gray-700 text-white"
            defaultValue={initialValues?.name || ""}
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
                  {initialValues?.name?.split(' ').map(n => n[0]).join('') || 'PL'}
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
