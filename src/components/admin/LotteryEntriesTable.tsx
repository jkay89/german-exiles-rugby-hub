import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, RefreshCw, Trash2 } from "lucide-react";
import { formatDrawDate } from "@/utils/drawDateUtils";

interface LotteryEntry {
  id: string;
  user_id: string;
  numbers: number[];
  line_number: number;
  is_active: boolean;
  created_at: string;
  draw_date: string;
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
  const [deletingEntry, setDeletingEntry] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      console.log('Fetching lottery entries...');
      
      // Fetch all lottery entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('lottery_entries')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Entries data:', entriesData);
      console.log('Entries error:', entriesError);

      if (entriesError) throw entriesError;

      setEntries(entriesData || []);

      // Since we can't access auth.users from client, we'll create a simpler user display
      console.log('Entries loaded:', entriesData?.length || 0);

      // Fetch user emails using edge function
      const userIds = [...new Set((entriesData || []).map(entry => entry.user_id))];
      
      if (userIds.length > 0) {
        try {
          const { data: emailData, error: emailError } = await supabase.functions.invoke('get-user-emails', {
            body: { userIds }
          });
          
          if (emailError) {
            console.error('Error fetching user emails:', emailError);
          } else {
            const profilesMap: UserProfiles = {};
            Object.entries(emailData.userEmails || {}).forEach(([userId, email]) => {
              profilesMap[userId] = { email: email as string };
            });
            setUserProfiles(profilesMap);
          }
        } catch (error) {
          console.error('Failed to fetch user emails:', error);
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

  const deleteEntry = async (entryId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to permanently delete this lottery entry for ${userEmail}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingEntry(entryId);
      
      const { error } = await supabase
        .from('lottery_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      // Remove from local state
      setEntries(prev => prev.filter(entry => entry.id !== entryId));

      toast({
        title: "Success",
        description: "Lottery entry deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete entry: " + error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingEntry(null);
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
                    disabled={deletingEntry === entry.id}
                  >
                    {entry.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteEntry(entry.id, userProfiles[entry.user_id]?.email || 'Unknown User')}
                    disabled={deletingEntry === entry.id}
                    className="text-xs"
                  >
                    {deletingEntry === entry.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
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

            {/* Admin Section - Show draw date */}
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Draw Date: {formatDrawDate(new Date(entry.draw_date))} 
                {entry.stripe_subscription_id && (
                  <> • Stripe: {entry.stripe_subscription_id.slice(0, 20)}...</>
                )}
              </p>
            </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LotteryEntriesTable;