import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { CommitteeMember } from "@/utils/committeeUtils";
import PlayerImageResizer from "./PlayerImageResizer";

interface CommitteeFormProps {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  initialValues?: {
    name?: string;
    role?: string;
    contact_email?: string;
    contact_number?: string;
    photo_url?: string;
  }
}

const CommitteeForm = ({ isEditing, onSubmit, onCancel, initialValues }: CommitteeFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialValues?.photo_url || null);
  const [showResizer, setShowResizer] = useState(false);
  const [resizerFile, setResizerFile] = useState<File | null>(null);
  const [memberName, setMemberName] = useState(initialValues?.name || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResizerFile(file);
      setShowResizer(true);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberName(e.target.value);
  };

  const handleResizedImage = (resizedFile: File) => {
    setSelectedFile(resizedFile);
    const url = URL.createObjectURL(resizedFile);
    setPreviewUrl(url);
    setShowResizer(false);
    setResizerFile(null);
  };

  const handleCancelResize = () => {
    setShowResizer(false);
    setResizerFile(null);
  };

  return (
    <>
      {showResizer && resizerFile && (
        <PlayerImageResizer
          open={showResizer}
          initialImage={resizerFile}
          playerName={memberName}
          onSave={handleResizedImage}
          onClose={handleCancelResize}
        />
      )}
      
      <form onSubmit={onSubmit} className="space-y-6 bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">
          {isEditing ? "Edit Committee Member" : "Add New Committee Member"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-white">Name *</Label>
            <Input 
              id="name" 
              name="name" 
              type="text" 
              required 
              defaultValue={initialValues?.name}
              onChange={handleNameChange}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="role" className="text-white">Role *</Label>
            <Input 
              id="role" 
              name="role" 
              type="text" 
              required 
              defaultValue={initialValues?.role}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="contact_email" className="text-white">Contact Email</Label>
            <Input 
              id="contact_email" 
              name="contact_email" 
              type="email" 
              defaultValue={initialValues?.contact_email || ""}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="contact_number" className="text-white">Contact Number</Label>
            <Input 
              id="contact_number" 
              name="contact_number" 
              type="tel" 
              defaultValue={initialValues?.contact_number || ""}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="photo" className="text-white">Photo</Label>
          <Input 
            id="photo" 
            name="photo" 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="bg-gray-800 border-gray-700 text-white"
          />
          {selectedFile && <input type="hidden" name="selectedFile" value="true" />}
          
          {previewUrl && (
            <div className="mt-4">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-full border-2 border-german-gold"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="bg-german-red hover:bg-german-gold">
            {isEditing ? "Update Member" : "Add Member"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default CommitteeForm;