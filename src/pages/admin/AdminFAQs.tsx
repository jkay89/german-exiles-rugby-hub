import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
}

const SortableFAQItem = ({ faq, onEdit, onDelete }: { faq: FAQ; onEdit: (faq: FAQ) => void; onDelete: (id: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: faq.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-4 bg-card border rounded-lg">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{faq.question}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs px-2 py-1 rounded ${faq.is_published ? 'bg-green-500/20 text-green-700' : 'bg-gray-500/20 text-gray-700'}`}>
            {faq.is_published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onEdit(faq)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDelete(faq.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const AdminFAQs = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAdmin();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    is_published: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFAQs();
    }
  }, [isAuthenticated]);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = faqs.findIndex((faq) => faq.id === active.id);
    const newIndex = faqs.findIndex((faq) => faq.id === over.id);
    
    const newFaqs = arrayMove(faqs, oldIndex, newIndex);
    setFaqs(newFaqs);

    try {
      const updates = newFaqs.map((faq, index) => 
        supabase
          .from("faqs")
          .update({ display_order: index })
          .eq("id", faq.id)
      );
      
      await Promise.all(updates);
      toast.success("FAQ order updated");
    } catch (error) {
      console.error("Error updating FAQ order:", error);
      toast.error("Failed to update order");
      fetchFAQs();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFaq) {
        const { error } = await supabase
          .from("faqs")
          .update(formData)
          .eq("id", editingFaq.id);
        
        if (error) throw error;
        toast.success("FAQ updated successfully");
      } else {
        const { error } = await supabase
          .from("faqs")
          .insert({
            ...formData,
            display_order: faqs.length,
          });
        
        if (error) throw error;
        toast.success("FAQ created successfully");
      }
      
      setDialogOpen(false);
      resetForm();
      fetchFAQs();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast.error("Failed to save FAQ");
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      is_published: faq.is_published,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    
    try {
      const { error } = await supabase
        .from("faqs")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("FAQ deleted successfully");
      fetchFAQs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ");
    }
  };

  const resetForm = () => {
    setEditingFaq(null);
    setFormData({
      question: "",
      answer: "",
      is_published: true,
    });
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage FAQs</h1>
            <p className="text-muted-foreground">Add, edit, or remove frequently asked questions</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    id="answer"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingFaq ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Loading FAQs...</p>
            </CardContent>
          </Card>
        ) : faqs.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No FAQs yet. Click "Add FAQ" to create one.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All FAQs (Drag to reorder)</CardTitle>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={faqs.map(f => f.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <SortableFAQItem
                        key={faq.id}
                        faq={faq}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminFAQs;
