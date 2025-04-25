
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Upload, Save } from "lucide-react";

interface EditSponsorFormProps {
  id: string;
  name: string;
  description: string;
  logoSrc: string;
  websiteUrl?: string | null;
  tier: string;
  onSave: (data: {
    name: string;
    description: string;
    websiteUrl: string;
    tier: string;
  }) => void;
}

const EditSponsorForm = ({
  id,
  name,
  description,
  logoSrc,
  websiteUrl,
  tier,
  onSave,
}: EditSponsorFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name,
    description,
    websiteUrl: websiteUrl || "",
    tier,
  });

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
    toast({
      title: t("content_saved"),
      description: t("content_updated"),
    });
  };

  if (!isEditing) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2 z-10"
        onClick={() => setIsEditing(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/90 p-4 z-20 overflow-y-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("sponsor_name")}</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("sponsor_description")}</label>
          <textarea
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white min-h-[100px]"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("sponsor_website")}</label>
          <Input
            value={formData.websiteUrl}
            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("sponsor_tier")}</label>
          <select
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            value={formData.tier}
            onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
          >
            <option value="platinum">{t("platinum_sponsor")}</option>
            <option value="gold">{t("gold_sponsor")}</option>
            <option value="silver">{t("silver_sponsors")}</option>
            <option value="affiliate">{t("affiliate_sponsors")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("edit_image")}</label>
          <Button className="w-full bg-gray-800 text-white flex items-center gap-2 justify-center">
            <Upload className="h-4 w-4" /> {t("upload_new_image")}
          </Button>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} className="bg-german-red hover:bg-german-gold flex items-center gap-2">
            <Save className="h-4 w-4" /> {t("save_changes")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditSponsorForm;
