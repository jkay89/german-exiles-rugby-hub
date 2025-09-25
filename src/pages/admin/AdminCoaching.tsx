import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { fetchCoachingStaff, createCoachingStaffMember, updateCoachingStaffMember, deleteCoachingStaffMember, CoachingStaffMember } from "@/utils/coachingStaffUtils";
import { supabase } from "@/integrations/supabase/client";
import CoachingStaffForm from "@/components/admin/CoachingStaffForm";

const AdminCoaching = () => {
  const { isAuthenticated } = useAdmin();
  const [staffMembers, setStaffMembers] = useState<CoachingStaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<CoachingStaffMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/admin';
      return;
    }
    loadStaff();
  }, [isAuthenticated]);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const data = await fetchCoachingStaff();
      setStaffMembers(data);
    } catch (error) {
      console.error('Error loading coaching staff:', error);
      toast.error('Failed to load coaching staff');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
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
          const fileName = `${Date.now()}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('players')
            .upload(fileName, file);

          if (uploadError) {
            throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('players')
            .getPublicUrl(fileName);
          
          photoUrl = publicUrl;
        }
      }

      const staffData = {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        contact_email: formData.get('contact_email') as string || null,
        contact_number: formData.get('contact_number') as string || null,
        bio: formData.get('bio') as string || null,
        photo_url: photoUrl,
      };

      await createCoachingStaffMember(staffData);
      toast.success('Coaching staff member added successfully');
      setShowForm(false);
      loadStaff();
    } catch (error) {
      console.error('Error adding coaching staff member:', error);
      toast.error('Failed to add coaching staff member');
    }
  };

  const handleUpdateStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStaff) return;

    const formData = new FormData(e.currentTarget);
    
    try {
      let photoUrl = editingStaff.photo_url;
      
      // Handle file upload if there's a selected file
      const hasSelectedFile = formData.get('selectedFile') === 'true';
      if (hasSelectedFile) {
        const photoInput = e.currentTarget.querySelector('input[name="photo"]') as HTMLInputElement;
        const file = photoInput?.files?.[0];
        
        if (file) {
          const fileName = `${Date.now()}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('players')
            .upload(fileName, file);

          if (uploadError) {
            throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('players')
            .getPublicUrl(fileName);
          
          photoUrl = publicUrl;
        }
      }

      const staffData = {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        contact_email: formData.get('contact_email') as string || null,
        contact_number: formData.get('contact_number') as string || null,
        bio: formData.get('bio') as string || null,
        photo_url: photoUrl,
      };

      await updateCoachingStaffMember(editingStaff.id, staffData);
      toast.success('Coaching staff member updated successfully');
      setEditingStaff(null);
      setShowForm(false);
      loadStaff();
    } catch (error) {
      console.error('Error updating coaching staff member:', error);
      toast.error('Failed to update coaching staff member');
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteCoachingStaffMember(staffToDelete);
      toast.success('Coaching staff member deleted successfully');
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
      loadStaff();
    } catch (error) {
      console.error('Error deleting coaching staff member:', error);
      toast.error('Failed to delete coaching staff member');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (staff: CoachingStaffMember) => {
    setEditingStaff(staff);
    setShowForm(true);
  };

  const handleDelete = (staffId: string) => {
    setStaffToDelete(staffId);
    setDeleteDialogOpen(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStaff(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="pt-16 min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-german-gold">Coaching & Support Staff Management</h1>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-german-red hover:bg-german-gold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <CoachingStaffForm
              isEditing={!!editingStaff}
              onSubmit={editingStaff ? handleUpdateStaff : handleAddStaff}
              onCancel={handleCancel}
              initialValues={editingStaff ? {
                name: editingStaff.name,
                role: editingStaff.role,
                contact_email: editingStaff.contact_email,
                contact_number: editingStaff.contact_number,
                bio: editingStaff.bio,
                photo_url: editingStaff.photo_url,
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
            {staffMembers.map((staff) => (
              <Card key={staff.id} className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-white">{staff.name}</CardTitle>
                    <p className="text-sm text-german-red">{staff.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(staff)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(staff.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {staff.photo_url && (
                      <div className="flex justify-center mb-4">
                        <img 
                          src={staff.photo_url} 
                          alt={staff.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-german-gold"
                        />
                      </div>
                    )}
                    {staff.bio && (
                      <p className="text-sm text-gray-300 mb-2">{staff.bio}</p>
                    )}
                    {staff.contact_email && (
                      <div className="flex items-center text-sm text-gray-300">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="truncate">{staff.contact_email}</span>
                      </div>
                    )}
                    {staff.contact_number && (
                      <div className="flex items-center text-sm text-gray-300">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{staff.contact_number}</span>
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
              <AlertDialogTitle className="text-white">Delete Staff Member</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete this coaching staff member? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteStaff}
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

export default AdminCoaching;