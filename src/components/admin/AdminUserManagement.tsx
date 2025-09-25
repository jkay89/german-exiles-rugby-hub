import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, UserPlus, Shield } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user' | 'lottery_admin'
  });
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get all users with admin roles
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user details from auth users
      const userIds = data?.map(ur => ur.user_id) || [];
      if (userIds.length === 0) {
        setUsers([]);
        return;
      }

      // Use the get-admin-users edge function to get user details
      const { data: userData, error: userError } = await supabase.functions.invoke('get-admin-users');

      if (userError) throw userError;

      // Combine role data with user data
      const combinedUsers = data?.map(roleData => {
        const user = userData.users.find((u: any) => u.id === roleData.user_id);
        return {
          id: roleData.user_id,
          email: user?.email || 'Unknown',
          role: roleData.role,
          created_at: roleData.created_at
        };
      }).filter(user => user.email !== 'Unknown') || [];

      setUsers(combinedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load admin users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: {
          email: newUser.email,
          password: newUser.password,
          role: newUser.role
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Admin user created successfully with role: ${newUser.role}`,
      });

      // Reset form and refresh users
      setNewUser({ email: '', password: '', role: 'user' });
      setShowCreateForm(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin user",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      // Delete user role first
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) throw roleError;

      toast({
        title: "Success",
        description: `Admin role removed from ${userEmail}`,
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user role:', error);
      toast({
        title: "Error",
        description: "Failed to remove admin role",
        variant: "destructive",
      });
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'website_overlord':
        return 'Website Overlord';
      case 'admin':
        return 'Admin';
      case 'user':
        return 'User';
      case 'lottery_admin':
        return 'Lottery Admin';
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'website_overlord':
        return 'bg-purple-600';
      case 'admin':
        return 'bg-red-600';
      case 'user':
        return 'bg-blue-600';
      case 'lottery_admin':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Admin User Management</h2>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-german-red hover:bg-german-gold flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Create Admin User
        </Button>
      </div>

      {showCreateForm && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create New Admin User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <Label className="text-white">Email</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-white">Password</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <Label className="text-white">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: 'admin' | 'user' | 'lottery_admin') => 
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white">
                    <SelectItem value="admin">Admin - Full access except user management</SelectItem>
                    <SelectItem value="user">User - Players, News, Media, Fixtures</SelectItem>
                    <SelectItem value="lottery_admin">Lottery Admin - Lottery management only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-german-red hover:bg-german-gold"
                >
                  {isCreating ? "Creating..." : "Create User"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Admin Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-400 text-center py-4">Loading admin users...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No admin users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-2 text-white font-medium">Email</th>
                    <th className="text-left py-3 px-2 text-white font-medium">Role</th>
                    <th className="text-left py-3 px-2 text-white font-medium">Created</th>
                    <th className="text-left py-3 px-2 text-white font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800">
                      <td className="py-3 px-2 text-gray-300">{user.email}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getRoleBadgeColor(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-300">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        {user.role !== 'website_overlord' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive" 
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                Remove Role
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-900 text-white border-gray-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Admin Role</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                  Are you sure you want to remove admin role from {user.email}? 
                                  This will revoke their access to the admin panel.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id, user.email)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remove Role
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;