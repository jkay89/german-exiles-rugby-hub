
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadToCloudinary } from "@/utils/cloudinaryUtils";
import { Edit, Plus, Trash2, Upload, X, ExternalLink, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface Sponsor {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
}

const TIERS = [
  { value: "platinum", label: "Platinum", color: "bg-gray-300 text-gray-900" },
  { value: "gold", label: "Gold", color: "bg-yellow-600 text-white" },
  { value: "silver", label: "Silver", color: "bg-gray-400 text-gray-900" },
  { value: "bronze", label: "Bronze", color: "bg-amber-700 text-white" },
  { value: "media", label: "Media Partner", color: "bg-blue-600 text-white" },
  { value: "affiliate", label: "Affiliate", color: "bg-green-700 text-white" },
];

const tierOrder = ["platinum", "gold", "silver", "bronze", "media", "affiliate"];

const emptyForm = { name: "", tier: "affiliate", website_url: "", description: "", logo_url: "" };

const AdminSponsors = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Sponsor | null>(null);
  const [filterTier, setFilterTier] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    } else {
      fetchSponsors();
    }
  }, [isAuthenticated, navigate]);

  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("tier", { ascending: true });
    if (!error) setSponsors(data || []);
  };

  const sortedSponsors = [...sponsors]
    .filter((s) => filterTier === "all" || s.tier === filterTier)
    .sort((a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier));

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setFilePreview(null);
    setDialogOpen(true);
  };

  const openEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor.id);
    setForm({
      name: sponsor.name,
      tier: sponsor.tier,
      website_url: sponsor.website_url || "",
      description: sponsor.description || "",
      logo_url: sponsor.logo_url || "",
    });
    setSelectedFile(null);
    setFilePreview(null);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      let logoUrl = form.logo_url;
      if (selectedFile) {
        const result = await uploadToCloudinary(selectedFile, "sponsors");
        logoUrl = result.url;
      }

      const payload = {
        name: form.name,
        tier: form.tier,
        website_url: form.website_url || null,
        description: form.description || null,
        logo_url: logoUrl || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("sponsors")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editingId);
        if (error) throw error;
        toast({ title: "Sponsor updated" });
      } else {
        const { error } = await supabase.from("sponsors").insert([payload]);
        if (error) throw error;
        toast({ title: "Sponsor added" });
      }

      setDialogOpen(false);
      fetchSponsors();
    } catch {
      toast({ title: "Error saving sponsor", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase.from("sponsors").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      toast({ title: `${deleteTarget.name} deleted` });
      setDeleteTarget(null);
      fetchSponsors();
    } catch {
      toast({ title: "Error deleting sponsor", variant: "destructive" });
    }
  };

  const getTierBadge = (tier: string) => {
    const t = TIERS.find((t) => t.value === tier);
    return t ? <span className={`px-2 py-0.5 rounded text-xs font-semibold ${t.color}`}>{t.label}</span> : tier;
  };

  const tierCounts = tierOrder.map((t) => ({
    value: t,
    label: TIERS.find((x) => x.value === t)?.label || t,
    count: sponsors.filter((s) => s.tier === t).length,
  }));

  if (!isAuthenticated) return null;

  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Sponsor Management</h1>
            <p className="text-gray-400 mt-1">{sponsors.length} sponsors across {tierOrder.filter((t) => sponsors.some((s) => s.tier === t)).length} tiers</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={openAdd} className="bg-german-red hover:bg-german-red/90">
              <Plus className="h-4 w-4 mr-2" /> Add Sponsor
            </Button>
            <Link to="/admin/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Tier filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            size="sm"
            variant={filterTier === "all" ? "default" : "outline"}
            onClick={() => setFilterTier("all")}
            className={filterTier === "all" ? "bg-german-red hover:bg-german-red/90" : ""}
          >
            All ({sponsors.length})
          </Button>
          {tierCounts.map((t) => (
            <Button
              key={t.value}
              size="sm"
              variant={filterTier === t.value ? "default" : "outline"}
              onClick={() => setFilterTier(t.value)}
              className={filterTier === t.value ? "bg-german-red hover:bg-german-red/90" : ""}
            >
              {t.label} ({t.count})
            </Button>
          ))}
        </div>

        {/* Sponsor cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-german-gold/40 transition-colors group"
            >
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-16 h-16 rounded bg-gray-800 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {sponsor.logo_url ? (
                    <img src={sponsor.logo_url} alt={sponsor.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-gray-600 text-xs">No logo</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold truncate">{sponsor.name}</h3>
                  </div>
                  <div className="mb-2">{getTierBadge(sponsor.tier)}</div>
                  {sponsor.description && (
                    <p className="text-gray-400 text-sm line-clamp-2">{sponsor.description}</p>
                  )}
                  {sponsor.website_url && (
                    <a
                      href={sponsor.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-german-gold text-sm hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <ExternalLink className="h-3 w-3" /> Website
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(sponsor)}>
                  <Edit className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(sponsor)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {sortedSponsors.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No sponsors found</p>
            <Button onClick={openAdd} variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-2" /> Add your first sponsor
            </Button>
          </div>
        )}
      </motion.div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Sponsor" : "Add New Sponsor"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sponsor Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Acme Corp"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Tier</label>
              <select
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                {TIERS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Website URL</label>
              <Input
                value={form.website_url}
                onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                placeholder="https://example.com"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-800 rounded border border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {(filePreview || form.logo_url) ? (
                    <img src={filePreview || form.logo_url} alt="Preview" className="w-full h-full object-contain p-1" />
                  ) : (
                    <Upload className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">PNG or JPG recommended</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Description / Bio</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Tell us about this sponsor..."
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white min-h-[100px] resize-y"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-german-red hover:bg-german-red/90"
              >
                {isLoading ? "Saving..." : editingId ? "Save Changes" : "Add Sponsor"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently remove this sponsor from the website. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSponsors;
