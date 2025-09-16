import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, FileText, Download } from "lucide-react";
import { fetchDocuments, createDocument, updateDocument, deleteDocument, Document } from "@/utils/documentUtils";
import { supabase } from "@/integrations/supabase/client";
import DocumentForm from "@/components/admin/DocumentForm";

const AdminDocuments = () => {
  const { isAuthenticated } = useAdmin();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/admin';
      return;
    }
    loadDocuments();
  }, [isAuthenticated]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const fileInput = e.currentTarget.querySelector('input[name="file"]') as HTMLInputElement;
      const file = fileInput?.files?.[0];
      
      if (!file) {
        toast.error('Please select a file');
        return;
      }

      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(`documents/${fileName}`, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(`documents/${fileName}`);

      const documentData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string || null,
        file_url: publicUrl,
        file_type: file.type || 'application/octet-stream',
        category: formData.get('category') as string,
      };

      await createDocument(documentData);
      toast.success('Document added successfully');
      setShowForm(false);
      loadDocuments();
    } catch (error) {
      console.error('Error adding document:', error);
      toast.error('Failed to add document');
    }
  };

  const handleUpdateDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDocument) return;

    const formData = new FormData(e.currentTarget);
    
    try {
      let fileUrl = editingDocument.file_url;
      let fileType = editingDocument.file_type;
      
      // Handle file upload if there's a selected file
      const hasSelectedFile = formData.get('selectedFile') === 'true';
      if (hasSelectedFile) {
        const fileInput = e.currentTarget.querySelector('input[name="file"]') as HTMLInputElement;
        const file = fileInput?.files?.[0];
        
        if (file) {
          const fileName = `${Date.now()}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('media')
            .upload(`documents/${fileName}`, file);

          if (uploadError) {
            throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(`documents/${fileName}`);
          
          fileUrl = publicUrl;
          fileType = file.type || 'application/octet-stream';
        }
      }

      const documentData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string || null,
        file_url: fileUrl,
        file_type: fileType,
        category: formData.get('category') as string,
      };

      await updateDocument(editingDocument.id, documentData);
      toast.success('Document updated successfully');
      setEditingDocument(null);
      setShowForm(false);
      loadDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDocument(documentToDelete);
      toast.success('Document deleted successfully');
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
    setShowForm(true);
  };

  const handleDelete = (documentId: string) => {
    setDocumentToDelete(documentId);
    setDeleteDialogOpen(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDocument(null);
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'constitution':
        return 'Constitution';
      case 'code_of_conduct':
        return 'Code of Conduct';
      case 'meeting_minutes':
        return 'Meeting Minutes';
      case 'agm_minutes':
        return 'AGM Minutes';
      default:
        return 'General';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-german-gold">Document Management</h1>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-german-red hover:bg-german-gold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <DocumentForm
              isEditing={!!editingDocument}
              onSubmit={editingDocument ? handleUpdateDocument : handleAddDocument}
              onCancel={handleCancel}
              initialValues={editingDocument ? {
                title: editingDocument.title,
                description: editingDocument.description,
                category: editingDocument.category,
                file_url: editingDocument.file_url,
              } : undefined}
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-german-gold animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <Card key={document.id} className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-white">{document.title}</CardTitle>
                    <p className="text-sm text-german-red">{getCategoryDisplayName(document.category)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(document)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(document.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <FileText className="h-16 w-16 text-german-gold" />
                    </div>
                    {document.description && (
                      <p className="text-sm text-gray-300">{document.description}</p>
                    )}
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{document.file_type.toUpperCase()}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(document.file_url, '_blank')}
                        className="h-6 px-2"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-gray-900 border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Document</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete this document? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteDocument}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminDocuments;