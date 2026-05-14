import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { uploadToCloudinary } from "@/utils/cloudinaryUtils";
import { Loader2, Upload, Trash2, Plus } from "lucide-react";

const CATEGORIES = [
  { value: "main", label: "Main Sponsor" },
  { value: "ball", label: "Ball Sponsor" },
  { value: "motm", label: "MOTM Sponsor" },
  { value: "warm_up_top", label: "Warm-Up Top Sponsor" },
  { value: "affiliate", label: "Affiliate Sponsor" },
  { value: "other", label: "Other" },
];

interface KaiserEvent {
  id: string;
  description: string | null;
  event_date: string | null;
  event_time: string | null;
  venue: string | null;
  location: string | null;
}

interface KaiserSponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  category: string;
  display_order: number;
  is_active: boolean;
}

const AdminKaiserCup = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [event, setEvent] = useState<KaiserEvent | null>(null);
  const [sponsors, setSponsors] = useState<KaiserSponsor[]>([]);
  const [savingEvent, setSavingEvent] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  // New sponsor draft
  const [newSponsor, setNewSponsor] = useState({
    name: "",
    website_url: "",
    category: "main",
    logo_url: "",
  });
  const [newLogoUploading, setNewLogoUploading] = useState(false);
  const newFileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin");
  }, [isAuthenticated, navigate]);

  const loadAll = async () => {
    const [{ data: ev }, { data: sp }] = await Promise.all([
      supabase.from("kaiser_cup_event" as any).select("*").limit(1).maybeSingle(),
      supabase
        .from("kaiser_cup_sponsors" as any)
        .select("*")
        .order("category", { ascending: true })
        .order("display_order", { ascending: true }),
    ]);
    if (ev) setEvent(ev as any);
    if (sp) setSponsors(sp as any);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const saveEvent = async () => {
    if (!event) return;
    setSavingEvent(true);
    const { error } = await supabase
      .from("kaiser_cup_event" as any)
      .update({
        description: event.description,
        event_date: event.event_date || null,
        event_time: event.event_time,
        venue: event.venue,
        location: event.location,
      })
      .eq("id", event.id);
    setSavingEvent(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Event details saved" });
    }
  };

  const handleLogoUpload = async (sponsorId: string, file: File) => {
    setUploadingId(sponsorId);
    try {
      const result = await uploadToCloudinary(file, "kaiser-cup-sponsors");
      const { error } = await supabase
        .from("kaiser_cup_sponsors" as any)
        .update({ logo_url: result.url })
        .eq("id", sponsorId);
      if (error) throw error;
      setSponsors((prev) =>
        prev.map((s) => (s.id === sponsorId ? { ...s, logo_url: result.url } : s))
      );
      toast({ title: "Logo updated" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingId(null);
    }
  };

  const updateSponsor = async (id: string, patch: Partial<KaiserSponsor>) => {
    setSponsors((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    const { error } = await supabase
      .from("kaiser_cup_sponsors" as any)
      .update(patch)
      .eq("id", id);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
  };

  const deleteSponsor = async (id: string) => {
    if (!confirm("Delete this sponsor?")) return;
    const { error } = await supabase.from("kaiser_cup_sponsors" as any).delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      setSponsors((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleNewLogoUpload = async (file: File) => {
    setNewLogoUploading(true);
    try {
      const result = await uploadToCloudinary(file, "kaiser-cup-sponsors");
      setNewSponsor((p) => ({ ...p, logo_url: result.url }));
      toast({ title: "Logo uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setNewLogoUploading(false);
    }
  };

  const addSponsor = async () => {
    if (!newSponsor.name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase
      .from("kaiser_cup_sponsors" as any)
      .insert({
        name: newSponsor.name.trim(),
        website_url: newSponsor.website_url || null,
        category: newSponsor.category,
        logo_url: newSponsor.logo_url || null,
        display_order: sponsors.filter((s) => s.category === newSponsor.category).length,
      })
      .select()
      .single();
    if (error) {
      toast({ title: "Add failed", description: error.message, variant: "destructive" });
      return;
    }
    setSponsors((prev) => [...prev, data as any]);
    setNewSponsor({ name: "", website_url: "", category: "main", logo_url: "" });
    toast({ title: "Sponsor added" });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="pt-16 min-h-screen bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Kaiser Cup Management</h1>
          <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <Card className="bg-gray-900 border-gray-800 text-white mb-8">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event && (
              <>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    rows={10}
                    value={event.description ?? ""}
                    onChange={(e) => setEvent({ ...event, description: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={event.event_date ?? ""}
                      onChange={(e) => setEvent({ ...event, event_date: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      placeholder="e.g. 14:00 kick-off"
                      value={event.event_time ?? ""}
                      onChange={(e) => setEvent({ ...event, event_time: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label>Venue</Label>
                    <Input
                      placeholder="e.g. Headingley Stadium"
                      value={event.venue ?? ""}
                      onChange={(e) => setEvent({ ...event, venue: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      placeholder="e.g. Leeds, UK"
                      value={event.location ?? ""}
                      onChange={(e) => setEvent({ ...event, location: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <Button onClick={saveEvent} disabled={savingEvent} className="bg-german-red hover:bg-german-gold">
                  {savingEvent && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Event Details
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white mb-8">
          <CardHeader>
            <CardTitle>Add Sponsor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newSponsor.name}
                  onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={newSponsor.category}
                  onValueChange={(v) => setNewSponsor({ ...newSponsor, category: v })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Website URL</Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={newSponsor.website_url}
                  onChange={(e) => setNewSponsor({ ...newSponsor, website_url: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label>Logo</Label>
                <input
                  ref={newFileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleNewLogoUpload(f);
                    if (newFileInput.current) newFileInput.current.value = "";
                  }}
                />
                <div className="flex items-center gap-2">
                  {newSponsor.logo_url && (
                    <img
                      src={newSponsor.logo_url}
                      alt="preview"
                      className="h-10 w-auto bg-white rounded p-0.5"
                    />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={newLogoUploading}
                    onClick={() => newFileInput.current?.click()}
                  >
                    {newLogoUploading ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" /> Uploading…
                      </>
                    ) : (
                      <>
                        <Upload className="h-3 w-3 mr-2" /> Upload logo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <Button onClick={addSponsor} className="bg-german-red hover:bg-german-gold">
              <Plus className="h-4 w-4 mr-2" /> Add Sponsor
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Sponsors ({sponsors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {sponsors.length === 0 ? (
              <p className="text-gray-400">No sponsors yet.</p>
            ) : (
              <div className="space-y-3">
                {sponsors.map((s) => (
                  <div
                    key={s.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 bg-gray-800/50 rounded-md border border-gray-700"
                  >
                    <div className="md:col-span-1">
                      {s.logo_url ? (
                        <img
                          src={s.logo_url}
                          alt={s.name}
                          className="h-12 w-12 object-contain bg-white rounded p-0.5"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-700 rounded" />
                      )}
                    </div>
                    <Input
                      className="md:col-span-3 bg-gray-800 border-gray-700 text-white"
                      value={s.name}
                      onChange={(e) =>
                        setSponsors((prev) =>
                          prev.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x))
                        )
                      }
                      onBlur={(e) => updateSponsor(s.id, { name: e.target.value })}
                    />
                    <Select
                      value={s.category}
                      onValueChange={(v) => updateSponsor(s.id, { category: v })}
                    >
                      <SelectTrigger className="md:col-span-2 bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="https://..."
                      className="md:col-span-3 bg-gray-800 border-gray-700 text-white"
                      value={s.website_url ?? ""}
                      onChange={(e) =>
                        setSponsors((prev) =>
                          prev.map((x) =>
                            x.id === s.id ? { ...x, website_url: e.target.value } : x
                          )
                        )
                      }
                      onBlur={(e) => updateSponsor(s.id, { website_url: e.target.value || null })}
                    />
                    <div className="md:col-span-3 flex gap-2 justify-end">
                      <input
                        ref={(el) => (fileInputs.current[s.id] = el)}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleLogoUpload(s.id, f);
                          const el = fileInputs.current[s.id];
                          if (el) el.value = "";
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputs.current[s.id]?.click()}
                        disabled={uploadingId === s.id}
                      >
                        {uploadingId === s.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Upload className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteSponsor(s.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminKaiserCup;
