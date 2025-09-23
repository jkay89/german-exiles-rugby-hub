import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, RefreshCw } from "lucide-react";

interface LotteryEntry {
  id: string;
  user_id: string;
  numbers: number[];
  line_number: number;
  is_active: boolean;
  created_at: string;
  stripe_subscription_id?: string;
}

interface UserProfiles {
  [key: string]: {
    email?: string;
  };
}

const LotteryEntriesTable = () => {
  const [entries, setEntries] = useState<LotteryEntry[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfiles>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      
      // Fetch all lottery entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('lottery_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (entriesError) throw entriesError;

      setEntries(entriesData || []);

      // Fetch user profiles for the unique user IDs
      const userIds = [...new Set((entriesData || []).map(entry => entry.user_id))];
      
      if (userIds.length > 0) {
        // Use auth.users to get user emails
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
        
        if (usersError) {
          console.error('Error fetching users:', usersError);
        } else {
          const profilesMap: UserProfiles = {};
          users?.forEach((user: any) => {
            if (user && user.id && userIds.includes(user.id)) {
              profilesMap[user.id] = { email: user.email };
            }
          });
          setUserProfiles(profilesMap);
        }
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch lottery entries: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleEntryStatus = async (entryId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('lottery_entries')
        .update({ is_active: !currentStatus })
        .eq('id', entryId);

      if (error) throw error;

      setEntries(prev => prev.map(entry => 
        entry.id === entryId ? { ...entry, is_active: !currentStatus } : entry
      ));

      toast({
        title: "Success",
        description: `Entry ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update entry status: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-green-400" />
          <span className="text-lg font-semibold text-white">
            Total Entries: {entries.length}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No lottery entries found
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-white font-medium">
                      {userProfiles[entry.user_id]?.email || `User ID: ${entry.user_id.slice(0, 8)}...`}
                    </p>
                    <p className="text-xs text-gray-400">
                      Line {entry.line_number} • {formatDate(entry.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={entry.is_active ? 'default' : 'secondary'}>
                    {entry.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleEntryStatus(entry.id, entry.is_active)}
                    className="text-xs"
                  >
                    {entry.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {entry.numbers.map((number, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  >
                    {number}
                  </div>
                ))}
              </div>

              {entry.stripe_subscription_id && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Stripe Reference: {entry.stripe_subscription_id.slice(0, 20)}...
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LotteryEntriesTable;