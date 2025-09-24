import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, Mail, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface LotteryUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  entries_count: number;
  has_subscription: boolean;
  subscription_since: string | null;
}

export const RegisteredUsersTable = () => {
  const [users, setUsers] = useState<LotteryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-lottery-users');

      if (error) throw error;

      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching registered users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch registered users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

      // Refresh the users list
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 text-blue-400 animate-spin mr-2" />
        <span className="text-gray-400">Loading registered users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-400" />
          <span className="text-lg font-semibold text-white">
            Registered Users ({users.length})
          </span>
        </div>
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

      {users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No registered users found</p>
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
                  {user.has_subscription && (
                    <Badge className="bg-green-600 text-white">
                      Subscriber
                    </Badge>
                  )}
                  {user.entries_count > 0 && (
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      {user.entries_count} entries
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
                  {user.has_subscription && user.subscription_since && (
                    <div className="flex items-center gap-1">
                      <span>Subscriber since: {formatDate(user.subscription_since)}</span>
                    </div>
                  )}
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-4"
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
                      This will permanently:
                      <ul className="list-disc ml-6 mt-2">
                        <li>Delete their user account</li>
                        <li>Remove all their lottery entries</li>
                        <li>Cancel their subscription (if any)</li>
                        <li>Delete all associated data</li>
                      </ul>
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
          ))}
        </div>
      )}
    </div>
  );
};