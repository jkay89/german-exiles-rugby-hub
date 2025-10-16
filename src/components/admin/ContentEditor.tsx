import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SiteContent, uploadContentImage } from "@/utils/siteContentUtils";
import { Upload, GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "./RichTextEditor";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ContentEditorProps {
  content: SiteContent;
  onUpdate: (id: string, value: string) => void;
  onDelete?: (id: string) => void;
}

export const ContentEditor = ({ content, onUpdate, onDelete }: ContentEditorProps) => {
  const [value, setValue] = useState(content.content_value || '');
  const [uploading, setUploading] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: content.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    setValue(content.content_value || '');
  }, [content.content_value]);

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
    <div
      ref={setNodeRef}
      style={style}
      className="space-y-3 p-4 border rounded-lg bg-card relative group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <Label className="text-sm font-medium">{content.section_label}</Label>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-amber-500 font-medium">Unpublished</span>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={() => onDelete(content.id)}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          )}
        </div>
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
        <RichTextEditor
          value={value}
          onChange={handleChange}
          placeholder={`Enter ${content.section_label.toLowerCase()}`}
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
