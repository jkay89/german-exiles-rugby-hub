import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createContentSection } from "@/utils/siteContentUtils";

interface AddSectionDialogProps {
  page: string;
  onSectionAdded: () => void;
}

export const AddSectionDialog = ({ page, onSectionAdded }: AddSectionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [key, setKey] = useState("");
  const [contentType, setContentType] = useState<string>("text");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!label || !key) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await createContentSection({
        section_key: key,
        section_label: label,
        page,
        content_type: contentType,
        content_value: "",
        published_value: "",
        is_published: false,
        display_order: 999,
      });

      toast.success("Section added successfully");
      setLabel("");
      setKey("");
      setContentType("text");
      setOpen(false);
      onSectionAdded();
    } catch (error) {
      console.error("Error adding section:", error);
      toast.error("Failed to add section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
          <DialogDescription>
            Create a new editable content section for this page
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="label">Section Label *</Label>
            <Input
              id="label"
              placeholder="e.g., Hero Title"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="key">Section Key *</Label>
            <Input
              id="key"
              placeholder="e.g., hero_title (lowercase, underscores)"
              value={key}
              onChange={(e) => setKey(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
            />
            <p className="text-xs text-muted-foreground">
              Unique identifier used in code
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text (Single Line)</SelectItem>
                <SelectItem value="textarea">Textarea (Multi-Line)</SelectItem>
                <SelectItem value="richtext">Rich Text (Formatted)</SelectItem>
                <SelectItem value="image">Image URL</SelectItem>
                <SelectItem value="boolean">Toggle (On/Off)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Add Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
