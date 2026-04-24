import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Copy, RefreshCw, Trash2, Radio, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/integrations/supabase/client";
import { useLiveStreams } from "@/hooks/useLiveStreams";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const AdminLiveStreams = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdmin();
  const { toast } = useToast();
  const { streams, refetch, loading } = useLiveStreams();
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduled, setScheduled] = useState("");
  const [fixtureId, setFixtureId] = useState("");
  const [fixtures, setFixtures] = useState<any[]>([]);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editScheduled, setEditScheduled] = useState("");
  const [editFixtureId, setEditFixtureId] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const openEdit = (s: any) => {
    setEditId(s.id);
    setEditTitle(s.title || "");
    setEditDescription(s.description || "");
    // Convert ISO to datetime-local input value (YYYY-MM-DDTHH:mm)
    setEditScheduled(
      s.scheduled_start
        ? new Date(s.scheduled_start).toISOString().slice(0, 16)
        : "",
    );
    setEditFixtureId(s.fixture_id || "");
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editId) return;
    if (!editTitle.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    setSavingEdit(true);
    const { error } = await supabase
      .from("live_streams")
      .update({
        title: editTitle,
        description: editDescription || null,
        scheduled_start: editScheduled
          ? new Date(editScheduled).toISOString()
          : null,
        fixture_id: editFixtureId || null,
      })
      .eq("id", editId);
    setSavingEdit(false);
    if (error) {
      toast({
        title: "Failed to update stream",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Stream updated" });
    setEditOpen(false);
    refetch();
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    supabase
      .from("fixtures")
      .select("id, opponent, date, team")
      .order("date", { ascending: true })
      .then(({ data }) => setFixtures(data || []));
  }, []);

  const createStream = async () => {
    if (!title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("create-live-stream", {
      body: {
        title,
        description: description || null,
        scheduled_start: scheduled ? new Date(scheduled).toISOString() : null,
        fixture_id: fixtureId || null,
      },
    });
    setCreating(false);
    if (error || (data as any)?.error) {
      toast({
        title: "Failed to create stream",
        description: error?.message || (data as any)?.error,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Stream created" });
    setOpen(false);
    setTitle("");
    setDescription("");
    setScheduled("");
    setFixtureId("");
    refetch();
  };

  const syncStatus = async (id?: string) => {
    const { error } = await supabase.functions.invoke("sync-live-stream-status", {
      body: id ? { stream_id: id } : {},
    });
    if (error) toast({ title: "Sync failed", variant: "destructive" });
    else {
      toast({ title: "Synced with Cloudflare" });
      refetch();
    }
  };

  const deleteStream = async (id: string) => {
    if (!confirm("Delete this stream? This won't remove it from Cloudflare.")) return;
    const { error } = await supabase.from("live_streams").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", variant: "destructive" });
    else {
      toast({ title: "Deleted" });
      refetch();
    }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied` });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Radio className="h-7 w-7 text-primary" />
                Live Streams
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => syncStatus()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync All
              </Button>
              <Button onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Stream
              </Button>
            </div>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : streams.length === 0 ? (
            <Card className="p-12 text-center bg-muted/40">
              <p className="text-muted-foreground">
                No streams yet. Create one to get OBS credentials.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {streams.map((s) => (
                <Card key={s.id} className="p-6 bg-card border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-foreground">
                          {s.title}
                        </h3>
                        {s.is_live && (
                          <Badge className="bg-primary text-primary-foreground">
                            LIVE
                          </Badge>
                        )}
                        {s.recording_url && !s.is_live && (
                          <Badge variant="secondary">Replay available</Badge>
                        )}
                      </div>
                      {s.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {s.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(s)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => syncStatus(s.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteStream(s.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        OBS — RTMP URL
                      </Label>
                      <div className="flex gap-1 mt-1">
                        <Input readOnly value={s.rtmp_url || ""} className="font-mono text-xs" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copy(s.rtmp_url || "", "RTMP URL")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        OBS — Stream Key
                      </Label>
                      <div className="flex gap-1 mt-1">
                        <Input
                          readOnly
                          type="password"
                          value={s.stream_key || ""}
                          className="font-mono text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copy(s.stream_key || "", "Stream key")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create live stream</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Label>Scheduled start (optional)</Label>
              <Input
                type="datetime-local"
                value={scheduled}
                onChange={(e) => setScheduled(e.target.value)}
              />
            </div>
            <div>
              <Label>Link to fixture (optional)</Label>
              <select
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                value={fixtureId}
                onChange={(e) => setFixtureId(e.target.value)}
              >
                <option value="">— none —</option>
                {fixtures.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.team} vs {f.opponent} ({f.date})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createStream} disabled={creating}>
              {creating ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit live stream</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div>
              <Label>Scheduled start (optional)</Label>
              <Input
                type="datetime-local"
                value={editScheduled}
                onChange={(e) => setEditScheduled(e.target.value)}
              />
            </div>
            <div>
              <Label>Link to fixture (optional)</Label>
              <select
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                value={editFixtureId}
                onChange={(e) => setEditFixtureId(e.target.value)}
              >
                <option value="">— none —</option>
                {fixtures.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.team} vs {f.opponent} ({f.date})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={savingEdit}>
              {savingEdit ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLiveStreams;
