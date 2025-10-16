import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SiteContent, uploadContentImage } from "@/utils/siteContentUtils";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface ContentEditorProps {
  content: SiteContent;
  onUpdate: (id: string, value: string) => void;
}

export const ContentEditor = ({ content, onUpdate }: ContentEditorProps) => {
  const [value, setValue] = useState(content.content_value || '');
  const [uploading, setUploading] = useState(false);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onUpdate(content.id, newValue);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadContentImage(file);
      handleChange(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const hasChanges = value !== content.published_value;

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{content.section_label}</Label>
        {hasChanges && (
          <span className="text-xs text-amber-500 font-medium">Unpublished changes</span>
        )}
      </div>

      {content.content_type === 'text' && (
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${content.section_label.toLowerCase()}`}
        />
      )}

      {content.content_type === 'textarea' && (
        <Textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${content.section_label.toLowerCase()}`}
          rows={4}
        />
      )}

      {content.content_type === 'richtext' && (
        <Textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${content.section_label.toLowerCase()}`}
          rows={6}
        />
      )}

      {content.content_type === 'image' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Image URL"
            />
            <Button
              variant="outline"
              size="icon"
              disabled={uploading}
              onClick={() => document.getElementById(`file-${content.id}`)?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              id={`file-${content.id}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          {value && (
            <img 
              src={value} 
              alt="Preview" 
              className="max-h-32 rounded border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
      )}

      {content.content_type === 'boolean' && (
        <div className="flex items-center space-x-2">
          <Switch
            checked={value === 'true'}
            onCheckedChange={(checked) => handleChange(checked.toString())}
          />
          <Label className="text-sm text-muted-foreground">
            {value === 'true' ? 'Enabled' : 'Disabled'}
          </Label>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Key: <code className="bg-muted px-1 rounded">{content.section_key}</code>
      </div>
    </div>
  );
};
