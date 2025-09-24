import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, Mail, Calendar, User, Shield, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
  email_confirmed: boolean;
}

export const AdminUsersTable = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-admin-users');

      if (error) throw error;

      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteAdmin = async () => {
    if (!newAdminEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (!newAdminEmail.endsWith('@germanexilesrl.co.uk')) {
      toast({
        title: "Error",
        description: "Only @germanexilesrl.co.uk emails can be invited as admins",
        variant: "destructive",
      });
      return;
    }

    setInviting(true);
    try {
      const { data, error } = await supabase.functions.invoke('invite-admin-user', {
        body: { email: newAdminEmail }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        setNewAdminEmail("");
        fetchUsers();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error inviting admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to invite admin user",
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  const handlePromoteToAdmin = async (userEmail: string) => {
    try {
      const { error } = await supabase.rpc('promote_to_admin', {
        _user_email: userEmail
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${userEmail} has been promoted to admin`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({
        title: "Error", 
        description: error.message || "Failed to promote user to admin",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-lottery-user', {
        body: { userId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${userEmail} has been deleted successfully`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error", 
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Invite New Admin */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-green-400" />
            Invite New Admin User
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="admin-email">Email Address (must be @germanexilesrl.co.uk)</Label>
              <Input
                id="admin-email"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="user@germanexilesrl.co.uk"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button 
              onClick={handleInviteAdmin}
              disabled={inviting}
              className="bg-green-600 hover:bg-green-700"
            >
              {inviting ? "Inviting..." : "Invite Admin"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Users List */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Admin Users ({users.length})
            </CardTitle>
            <Button 
              onClick={fetchUsers}
              variant="outline" 
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 text-blue-400 animate-spin mr-2" />
              <span className="text-gray-400">Loading admin users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No @germanexilesrl.co.uk users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-white font-medium">{user.email}</span>
                      {user.is_admin && (
                        <Badge className="bg-blue-600 text-white">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {!user.email_confirmed && (
                        <Badge variant="secondary" className="bg-yellow-600 text-white">
                          Pending Confirmation
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined: {formatDate(user.created_at)}</span>
                      </div>
                      {user.last_sign_in_at && (
                        <div className="flex items-center gap-1">
                          <span>Last login: {formatDate(user.last_sign_in_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!user.is_admin && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Promote to Admin
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-900 border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Promote User to Admin</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Are you sure you want to promote <strong>{user.email}</strong> to admin?
                              <br /><br />
                              This will give them full access to the admin dashboard and all management features.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handlePromoteToAdmin(user.email)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Promote to Admin
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-900 border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Delete User Account</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete the account for <strong>{user.email}</strong>?
                            <br /><br />
                            This will permanently delete their user account and all associated data.
                            <br />
                            <strong>This action cannot be undone.</strong>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete User
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};