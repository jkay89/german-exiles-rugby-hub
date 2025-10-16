import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";
import { ContentEditor } from "@/components/admin/ContentEditor";
import {
  fetchPageContent,
  updateContent,
  publishAllPageContent,
  SiteContent
} from "@/utils/siteContentUtils";

const AdminSiteEditor = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdmin();
  const [activeTab, setActiveTab] = useState("home");
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [changes, setChanges] = useState<Record<string, string>>({});

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

  const hasUnsavedChanges = Object.keys(changes).length > 0;

  return (
    <div className="min-h-screen bg-background p-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Content Editor</CardTitle>
              <CardDescription>
                Edit content sections and save as draft before publishing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="home">Home</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4 mt-4">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading content...
                    </div>
                  ) : content.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No editable sections found for this page
                    </div>
                  ) : (
                    content.map((item) => (
                      <ContentEditor
                        key={item.id}
                        content={item}
                        onUpdate={handleContentUpdate}
                      />
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how your changes will look on the live site
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSiteEditor;
