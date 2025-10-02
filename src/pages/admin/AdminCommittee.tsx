import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { fetchCommitteeMembers, createCommitteeMember, updateCommitteeMember, deleteCommitteeMember, CommitteeMember } from "@/utils/committeeUtils";
import { uploadToCloudinary } from "@/utils/cloudinaryUtils";
import CommitteeForm from "@/components/admin/CommitteeForm";

const AdminCommittee = () => {
  const { isAuthenticated } = useAdmin();
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/admin';
      return;
    }
    loadMembers();
  }, [isAuthenticated]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await fetchCommitteeMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error loading committee members:', error);
      toast.error('Failed to load committee members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      let photoUrl = null;
      
      // Handle file upload if there's a selected file
      const hasSelectedFile = formData.get('selectedFile') === 'true';
      if (hasSelectedFile) {
        const photoInput = e.currentTarget.querySelector('input[name="photo"]') as HTMLInputElement;
        const file = photoInput?.files?.[0];
        
        if (file) {
          toast.info('Uploading image to Cloudinary...');
          const result = await uploadToCloudinary(file, 'committee-members');
          photoUrl = result.url;
        }
      }

      const memberData = {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        contact_email: formData.get('contact_email') as string || null,
        contact_number: formData.get('contact_number') as string || null,
        photo_url: photoUrl,
      };

      await createCommitteeMember(memberData);
      toast.success('Committee member added successfully');
      setShowForm(false);
      loadMembers();
    } catch (error) {
      console.error('Error adding committee member:', error);
      toast.error('Failed to add committee member');
    }
  };

  const handleUpdateMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMember) return;

    const formData = new FormData(e.currentTarget);
    
    try {
      let photoUrl = editingMember.photo_url;
      
      // Handle file upload if there's a selected file
      const hasSelectedFile = formData.get('selectedFile') === 'true';
      if (hasSelectedFile) {
        const photoInput = e.currentTarget.querySelector('input[name="photo"]') as HTMLInputElement;
        const file = photoInput?.files?.[0];
        
        if (file) {
          toast.info('Uploading image to Cloudinary...');
          const result = await uploadToCloudinary(file, 'committee-members');
          photoUrl = result.url;
        }
      }

      const memberData = {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        contact_email: formData.get('contact_email') as string || null,
        contact_number: formData.get('contact_number') as string || null,
        photo_url: photoUrl,
      };

      await updateCommitteeMember(editingMember.id, memberData);
      toast.success('Committee member updated successfully');
      setEditingMember(null);
      setShowForm(false);
      loadMembers();
    } catch (error) {
      console.error('Error updating committee member:', error);
      toast.error('Failed to update committee member');
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteCommitteeMember(memberToDelete);
      toast.success('Committee member deleted successfully');
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
      loadMembers();
    } catch (error) {
      console.error('Error deleting committee member:', error);
      toast.error('Failed to delete committee member');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (member: CommitteeMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = (memberId: string) => {
    setMemberToDelete(memberId);
    setDeleteDialogOpen(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="pt-16 min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-german-gold">Committee Management</h1>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-german-red hover:bg-german-gold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Committee Member
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <CommitteeForm
              isEditing={!!editingMember}
              onSubmit={editingMember ? handleUpdateMember : handleAddMember}
              onCancel={handleCancel}
              initialValues={editingMember ? {
                name: editingMember.name,
                role: editingMember.role,
                contact_email: editingMember.contact_email,
                contact_number: editingMember.contact_number,
                photo_url: editingMember.photo_url,
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
            {members.map((member) => (
              <Card key={member.id} className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-white">{member.name}</CardTitle>
                    <p className="text-sm text-german-red">{member.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(member)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(member.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {member.photo_url && (
                      <div className="flex justify-center mb-4">
                        <img 
                          src={member.photo_url} 
                          alt={member.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-german-gold"
                        />
                      </div>
                    )}
                    {member.contact_email && (
                      <div className="flex items-center text-sm text-gray-300">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="truncate">{member.contact_email}</span>
                      </div>
                    )}
                    {member.contact_number && (
                      <div className="flex items-center text-sm text-gray-300">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{member.contact_number}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-gray-900 border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Committee Member</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete this committee member? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteMember}
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

export default AdminCommittee;