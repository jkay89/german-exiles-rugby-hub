import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface DocumentFormProps {
  isEditing: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  initialValues?: {
    title?: string;
    description?: string;
    category?: string;
    file_url?: string;
  }
}

const DocumentForm = ({ isEditing, onSubmit, onCancel, initialValues }: DocumentFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState(initialValues?.category || "general");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-gray-900 p-6 rounded-lg border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-4">
        {isEditing ? "Edit Document" : "Add New Document"}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title" className="text-white">Title *</Label>
          <Input 
            id="title" 
            name="title" 
            type="text" 
            required 
            defaultValue={initialValues?.title}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label htmlFor="category" className="text-white">Category *</Label>
          <Select name="category" value={category} onValueChange={setCategory} required>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="constitution">Constitution</SelectItem>
              <SelectItem value="code_of_conduct">Code of Conduct</SelectItem>
              <SelectItem value="meeting_minutes">Meeting Minutes</SelectItem>
              <SelectItem value="agm_minutes">AGM Minutes</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          defaultValue={initialValues?.description || ""}
          className="bg-gray-800 border-gray-700 text-white"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="file" className="text-white">
          {isEditing ? "Replace File (optional)" : "File *"}
        </Label>
        <Input 
          id="file" 
          name="file" 
          type="file" 
          accept=".pdf,.doc,.docx,.txt,.rtf"
          onChange={handleFileChange}
          className="bg-gray-800 border-gray-700 text-white"
          required={!isEditing}
        />
        {selectedFile && <input type="hidden" name="selectedFile" value="true" />}
        
        {initialValues?.file_url && !selectedFile && (
          <div className="mt-2">
            <p className="text-sm text-gray-400">
              Current file: 
              <a 
                href={initialValues.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-german-gold hover:underline ml-1"
              >
                View current document
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="bg-german-red hover:bg-german-gold">
          {isEditing ? "Update Document" : "Add Document"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default DocumentForm;