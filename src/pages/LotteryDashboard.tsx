import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import NumberSelector from "@/components/lottery/NumberSelector";
import { Loader2, Calendar, Trophy, Settings, CreditCard } from "lucide-react";

interface LotteryEntry {
  id: string;
  numbers: number[];
  line_number: number;
  is_active: boolean;
  stripe_subscription_id: string;
}

interface LotterySubscription {
  id: string;
  status: string;
  lines_count: number;
  stripe_subscription_id: string;
  next_draw_date: string;
}

interface LotteryDraw {
  id: string;
  draw_date: string;
  winning_numbers: number[];
  jackpot_amount: number;
  lucky_dip_amount: number;
}

interface LotteryResult {
  id: string;
  matches: number;
  prize_amount: number;
  is_winner: boolean;
  draw: LotteryDraw;
  entry: LotteryEntry;
}

const LotteryDashboard = () => {
  const { username } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<LotteryEntry[]>([]);
  const [subscription, setSubscription] = useState<LotterySubscription | null>(null);
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [latestDraw, setLatestDraw] = useState<LotteryDraw | null>(null);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadUserData();
    }
  }, [user, authLoading]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user's lottery entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('lottery_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('line_number');

      if (entriesError) throw entriesError;
      setEntries(entriesData || []);

      // Load user's subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('lottery_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError;
      }
      setSubscription(subscriptionData);

      // Load latest draw
      const { data: drawData, error: drawError } = await supabase
        .from('lottery_draws')
        .select('*')
        .order('draw_date', { ascending: false })
        .limit(1)
        .single();

      if (drawError && drawError.code !== 'PGRST116') {
        throw drawError;
      }
      setLatestDraw(drawData);

      // Load user's results
      const { data: resultsData, error: resultsError } = await supabase
        .from('lottery_results')
        .select(`
          *,
          draw:lottery_draws(*),
          entry:lottery_entries(*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (resultsError) throw resultsError;
      setResults(resultsData || []);

    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateEntryNumbers = async (entryId: string, newNumbers: number[]) => {
    try {
      const { error } = await supabase
        .from('lottery_entries')
        .update({ numbers: newNumbers })
        .eq('id', entryId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setEntries(prev => prev.map(entry => 
        entry.id === entryId ? { ...entry, numbers: newNumbers } : entry
      ));

      setEditingEntry(null);
      toast({
        title: "Numbers updated",
        description: "Your lottery numbers have been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error updating numbers",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const cancelSubscription = async () => {
    if (!subscription) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        }
      });

      if (error) throw error;

      window.open(data.url, '_blank');
    } catch (error: any) {
      toast({
        title: "Error accessing customer portal",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if username matches the logged-in user's email (simplified approach)
  const userSlug = user.email?.split('@')[0] || '';
  if (username !== userSlug) {
    return <Navigate to={`/lottery/${userSlug}`} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lottery Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.email}</p>
        </div>

        {/* Subscription Status */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CreditCard className="w-5 h-5" />
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                    {subscription.status.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-gray-400 mt-1">
                    {subscription.lines_count} line{subscription.lines_count > 1 ? 's' : ''} active
                  </p>
                  {subscription.next_draw_date && (
                    <p className="text-sm text-gray-400">
                      Next draw: {new Date(subscription.next_draw_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button variant="outline" onClick={cancelSubscription}>
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 mb-4">No active subscription found</p>
                <Button asChild>
                  <a href="/lottery">Start Playing</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="numbers" className="space-y-8">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="numbers">My Numbers</TabsTrigger>
            <TabsTrigger value="results">Results & Wins</TabsTrigger>
          </TabsList>

          <TabsContent value="numbers" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Your Lottery Numbers</CardTitle>
                <CardDescription>
                  Click "Edit" to change your numbers for future draws
                </CardDescription>
              </CardHeader>
              <CardContent>
                {entries.length > 0 ? (
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <div key={entry.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-white">
                            Line {entry.line_number}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant={entry.is_active ? 'default' : 'secondary'}>
                              {entry.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            {editingEntry === entry.id ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingEntry(null)}
                              >
                                Cancel
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingEntry(entry.id)}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>

                        {editingEntry === entry.id ? (
                          <div className="space-y-4">
                            <NumberSelector
                              selectedNumbers={entry.numbers}
                              onNumbersChange={(newNumbers) => {
                                // Update the entry state immediately for UI feedback
                                setEntries(prev => prev.map(e => 
                                  e.id === entry.id ? { ...e, numbers: newNumbers } : e
                                ));
                              }}
                              maxNumbers={6}
                              maxValue={49}
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => updateEntryNumbers(entry.id, entry.numbers)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Save Changes
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setEditingEntry(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                              {entry.numbers.map((number, index) => (
                                <div
                                  key={index}
                                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white"
                                >
                                  {number}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No lottery entries found</p>
                    <Button asChild>
                      <a href="/lottery">Play Now</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {/* Latest Draw */}
            {latestDraw && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Calendar className="w-5 h-5" />
                    Latest Draw - {new Date(latestDraw.draw_date).toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {latestDraw.winning_numbers.map((number, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center font-bold text-black"
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Jackpot</p>
                      <p className="font-semibold text-white">€{latestDraw.jackpot_amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Lucky Dip</p>
                      <p className="font-semibold text-white">€{latestDraw.lucky_dip_amount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results History */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="w-5 h-5" />
                  Your Results
                </CardTitle>
                <CardDescription>Your recent draw results and winnings</CardDescription>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result) => (
                      <div key={result.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-white">
                            Draw: {new Date(result.draw.draw_date).toLocaleDateString()}
                          </p>
                          {result.is_winner && (
                            <Badge className="bg-green-600">
                              Winner! €{result.prize_amount}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Your Numbers</p>
                            <div className="flex gap-1 mt-1">
                              {result.entry.numbers.map((number, index) => (
                                <div
                                  key={index}
                                  className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white"
                                >
                                  {number}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-400">Matches</p>
                            <p className="font-semibold text-white">{result.matches} numbers</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No results yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Your results will appear here after the draws
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LotteryDashboard;