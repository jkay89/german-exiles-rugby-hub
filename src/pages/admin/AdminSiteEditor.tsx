import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, RefreshCw, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { AddSectionDialog } from "@/components/admin/AddSectionDialog";
import { VisualPreview } from "@/components/admin/VisualPreview";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  fetchPageContent,
  updateContent,
  publishAllPageContent,
  deleteContentSection,
  SiteContent
} from "@/utils/siteContentUtils";
import { supabase } from "@/integrations/supabase/client";

const AdminSiteEditor = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdmin();
  const [activeTab, setActiveTab] = useState("home");
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [visualMode, setVisualMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const loadPageContent = async (page: string) => {
    setLoading(true);
    try {
      const data = await fetchPageContent(page);
      setContent(data);
      setChanges({});
    } catch (error) {
      console.error("Error loading content:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageContent(activeTab);
  }, [activeTab]);

  const handleContentUpdate = (id: string, value: string) => {
    setChanges(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = async () => {
    if (Object.keys(changes).length === 0) {
      toast.info("No changes to save");
      return;
    }

    try {
      for (const [id, value] of Object.entries(changes)) {
        await updateContent(id, value);
      }
      toast.success("Changes saved as draft");
      setChanges({});
      loadPageContent(activeTab);
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      // First save any pending changes
      if (Object.keys(changes).length > 0) {
        for (const [id, value] of Object.entries(changes)) {
          await updateContent(id, value);
        }
      }

      // Then publish all content for the page
      await publishAllPageContent(activeTab);
      
      toast.success("Changes published successfully!");
      setChanges({});
      loadPageContent(activeTab);
    } catch (error) {
      console.error("Error publishing:", error);
      toast.error("Failed to publish changes");
    } finally {
      setPublishing(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = content.findIndex((item) => item.id === active.id);
      const newIndex = content.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(content, oldIndex, newIndex);
      setContent(newOrder);

      // Update display_order in database
      try {
        for (let i = 0; i < newOrder.length; i++) {
          await supabase
            .from('site_content')
            .update({ display_order: i })
            .eq('id', newOrder[i].id);
        }
        toast.success("Section order updated");
      } catch (error) {
        console.error("Error updating order:", error);
        toast.error("Failed to update section order");
      }
    }
  };

  const handleDeleteSection = (id: string) => {
    setSectionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!sectionToDelete) return;

    try {
      await deleteContentSection(sectionToDelete);
      toast.success("Section deleted");
      loadPageContent(activeTab);
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error("Failed to delete section");
    } finally {
      setDeleteDialogOpen(false);
      setSectionToDelete(null);
    }
  };

  const hasUnsavedChanges = Object.keys(changes).length > 0;

  return (
    <div className="min-h-screen bg-background p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Site Editor</h1>
              <p className="text-muted-foreground">
                Manage website content with live preview
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => loadPageContent(activeTab)}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveChanges}
              disabled={!hasUnsavedChanges || loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={handlePublish}
              disabled={publishing || loading}
            >
              <Eye className="h-4 w-4 mr-2" />
              Publish Changes
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Preview Panel - Now at top */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    {visualMode 
                      ? "Drag images/videos to position them exactly where you want"
                      : "See how changes will look on the live site"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="visual-mode" className="text-sm">
                    Visual Editor
                  </Label>
                  <Switch
                    id="visual-mode"
                    checked={visualMode}
                    onCheckedChange={setVisualMode}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {visualMode ? (
                <VisualPreview
                  page={activeTab}
                  onElementsChange={() => loadPageContent(activeTab)}
                />
              ) : (
                <>
                  <div className="border rounded-lg overflow-hidden bg-background">
                    <iframe
                      src={`/${activeTab === 'home' ? '' : activeTab}`}
                      className="w-full h-[600px]"
                      title="Site Preview"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Preview shows published content. Save and publish to see your changes.
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Editor Panel - Now at bottom */}
          <Card>
            <CardHeader>
              <CardTitle>Content Editor</CardTitle>
              <CardDescription>
                Edit content sections and save as draft before publishing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="space-y-2">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="home">Home</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="news">News</TabsTrigger>
                    <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="heritage-team">Heritage</TabsTrigger>
                    <TabsTrigger value="community-team">Community</TabsTrigger>
                    <TabsTrigger value="exiles-9s">Exiles 9s</TabsTrigger>
                    <TabsTrigger value="coaching-team">Coaching</TabsTrigger>
                    <TabsTrigger value="committee-members">Committee</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="nrld">NRLD</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="lottery">Lottery</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={activeTab} className="space-y-4 mt-4">
                  <div className="flex justify-end">
                    <AddSectionDialog
                      page={activeTab}
                      onSectionAdded={() => loadPageContent(activeTab)}
                    />
                  </div>

                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading content...
                    </div>
                  ) : content.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No editable sections found for this page
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={content.map(c => c.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {content.map((item) => (
                          <ContentEditor
                            key={item.id}
                            content={item}
                            onUpdate={handleContentUpdate}
                            onDelete={handleDeleteSection}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Section</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this section? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminSiteEditor;
