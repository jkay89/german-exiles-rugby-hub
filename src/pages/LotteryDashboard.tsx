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
import { Loader2, Calendar, Trophy, Settings, CreditCard, Clock, History } from "lucide-react";
import { getNextDrawDate, formatDrawDate, isCurrentDrawPeriod, isPastDraw } from "@/utils/drawDateUtils";

interface LotteryEntry {
  id: string;
  numbers: number[];
  line_number: number;
  is_active: boolean;
  stripe_subscription_id: string;
  draw_date: string;
}

interface LotterySubscription {
  id: string;
  status: string;
  lines_count: number;
  stripe_subscription_id: string;
  next_draw_date: string;
}

interface SubscriptionDetails {
  hasSubscription: boolean;
  status?: string;
  linesCount?: number;
  pricePerLine?: number;
  totalAmount?: number;
  currency?: string;
  nextPaymentDate?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  stripeSubscriptionId?: string;
  createdAt?: string;
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
  const [currentEntries, setCurrentEntries] = useState<LotteryEntry[]>([]);
  const [previousEntries, setPreviousEntries] = useState<LotteryEntry[]>([]);
  const [subscription, setSubscription] = useState<LotterySubscription | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [latestDraw, setLatestDraw] = useState<LotteryDraw | null>(null);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);

  const nextDrawDate = getNextDrawDate();
  const nextDrawDateString = nextDrawDate.toISOString().split('T')[0];

  useEffect(() => {
    console.log("LotteryDashboard useEffect - authLoading:", authLoading, "user:", !!user);
    if (!authLoading && user) {
      loadUserData();
    }
  }, [user, authLoading]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user's lottery entries and separate by draw date
      const { data: allEntries, error: entriesError } = await supabase
        .from('lottery_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('draw_date', { ascending: false });

      if (entriesError) throw entriesError;

      // Separate current and previous entries
      const current: LotteryEntry[] = [];
      const previous: LotteryEntry[] = [];

      (allEntries || []).forEach(entry => {
        const entryDrawDate = new Date(entry.draw_date);
        if (entryDrawDate >= new Date() || isCurrentDrawPeriod(entryDrawDate)) {
          current.push(entry);
        } else {
          previous.push(entry);
        }
      });

      setCurrentEntries(current);
      setPreviousEntries(previous);

      // Load user's subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('lottery_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .maybeSingle();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError;
      }
      setSubscription(subscriptionData);

      // Load detailed subscription information from Stripe
      if (subscriptionData) {
        try {
          const { data: detailsData, error: detailsError } = await supabase.functions.invoke('get-subscription-details', {
            headers: {
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            }
          });

          if (detailsError) {
            console.error('Error loading subscription details:', detailsError);
          } else {
            setSubscriptionDetails(detailsData);
          }
        } catch (error) {
          console.error('Failed to load subscription details:', error);
        }
      }

      // Load latest draw
      const { data: drawData, error: drawError } = await supabase
        .from('lottery_draws')
        .select('*')
        .order('draw_date', { ascending: false })
        .limit(1)
        .maybeSingle();

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

      setCurrentEntries(prev => prev.map(entry => 
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

  const renderEntryNumbers = (entry: LotteryEntry, isEditing: boolean) => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <NumberSelector
            selectedNumbers={entry.numbers}
            onNumbersChange={(newNumbers) => {
              setCurrentEntries(prev => prev.map(e => 
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
      );
    }

    return (
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
    );
  };

  const canEditEntry = (entry: LotteryEntry) => {
    return entry.stripe_subscription_id && entry.stripe_subscription_id.startsWith('sub_');
  };

  if (authLoading) {
    console.log("LotteryDashboard: auth loading...");
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user) {
    console.log("LotteryDashboard: no user, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  const userSlug = user.email?.split('@')[0] || '';
  if (username !== userSlug) {
    console.log("LotteryDashboard: username mismatch, redirecting", { username, userSlug });
    return <Navigate to={`/lottery/${userSlug}`} replace />;
  }

  if (loading) {
    console.log("LotteryDashboard: loading data...");
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  console.log("LotteryDashboard: rendering main content");

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
            {subscription && subscriptionDetails ? (
              <div className="space-y-6">
                {/* Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
                    <Badge variant={subscriptionDetails.status === 'active' ? 'default' : 'secondary'} className="text-sm">
                      {subscriptionDetails.status?.toUpperCase()}
                    </Badge>
                    {subscriptionDetails.cancelAtPeriodEnd && (
                      <p className="text-xs text-yellow-400 mt-1">Cancels at period end</p>
                    )}
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Monthly Cost</h3>
                    <p className="text-xl font-bold text-white">
                      £{subscriptionDetails.totalAmount?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      £{subscriptionDetails.pricePerLine?.toFixed(2)} per line × {subscriptionDetails.linesCount} lines
                    </p>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Next Payment</h3>
                    <p className="text-lg font-semibold text-white">
                      {subscriptionDetails.nextPaymentDate ? 
                        new Date(subscriptionDetails.nextPaymentDate).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'long',
                          year: 'numeric'
                        }) : 'N/A'
                      }
                    </p>
                    <p className="text-xs text-gray-400">1st of each month</p>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="border-t border-gray-600 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Subscription Details</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-white">
                          <span className="text-gray-400">Lines:</span> {subscriptionDetails.linesCount}
                        </p>
                        <p className="text-white">
                          <span className="text-gray-400">Started:</span> {' '}
                          {new Date(subscriptionDetails.createdAt || '').toLocaleDateString('en-GB')}
                        </p>
                        <p className="text-white">
                          <span className="text-gray-400">Next Draw:</span> {formatDrawDate(nextDrawDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Payment Info</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-white">
                          <span className="text-gray-400">Billing Cycle:</span> Monthly
                        </p>
                        <p className="text-white">
                          <span className="text-gray-400">Current Period Ends:</span> {' '}
                          {subscriptionDetails.currentPeriodEnd ? 
                            new Date(subscriptionDetails.currentPeriodEnd).toLocaleDateString('en-GB') : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Management Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={cancelSubscription}>
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Button>
                    
                    {!subscriptionDetails.cancelAtPeriodEnd && (
                      <Button 
                        variant="outline" 
                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                        onClick={cancelSubscription}
                      >
                        Pause Subscription
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline"
                      className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                      disabled
                    >
                      Change Numbers
                      <span className="text-xs ml-2">(Available in dashboard)</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : subscription ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-white mr-2" />
                <span>Loading subscription details...</span>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Active Subscription</h3>
                  <p className="text-gray-400 mb-4">
                    Start a monthly subscription to automatically enter every draw with your chosen numbers.
                  </p>
                  <div className="space-y-2 text-sm text-gray-400 mb-4">
                    <p>✓ Never miss a draw</p>
                    <p>✓ Same numbers every month</p>
                    <p>✓ Cancel anytime</p>
                    <p>✓ Manage your subscription online</p>
                  </div>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <a href="/lottery">Start Subscription</a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="current" className="space-y-8">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="current">Current Numbers</TabsTrigger>
            <TabsTrigger value="previous">Previous Numbers</TabsTrigger>
            <TabsTrigger value="results">Results & Wins</TabsTrigger>
          </TabsList>

          {/* Current Numbers Tab */}
          <TabsContent value="current" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5" />
                  {formatDrawDate(nextDrawDate)} Numbers
                </CardTitle>
                <CardDescription>
                  Your lottery numbers for the next draw
                  {canEditEntry(currentEntries[0]) && " - Click 'Edit' to change subscription numbers"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentEntries.length > 0 ? (
                  <div className="space-y-4">
                    {currentEntries.map((entry) => (
                      <div key={entry.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-white">
                            Line {entry.line_number}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant={entry.is_active ? 'default' : 'secondary'}>
                              {entry.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            {canEditEntry(entry) ? (
                              editingEntry === entry.id ? (
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
                              )
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                One-time Entry
                              </Badge>
                            )}
                          </div>
                        </div>
                        {renderEntryNumbers(entry, editingEntry === entry.id)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No entries for the next draw</p>
                    <Button asChild>
                      <a href="/lottery">Enter Now</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Previous Numbers Tab */}
          <TabsContent value="previous" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <History className="w-5 h-5" />
                  Previous Numbers
                </CardTitle>
                <CardDescription>
                  Your lottery numbers from past draws
                </CardDescription>
              </CardHeader>
              <CardContent>
                {previousEntries.length > 0 ? (
                  <div className="space-y-4">
                    {/* Group by draw date */}
                    {Object.entries(
                      previousEntries.reduce((groups, entry) => {
                        const drawDate = entry.draw_date;
                        if (!groups[drawDate]) groups[drawDate] = [];
                        groups[drawDate].push(entry);
                        return groups;
                      }, {} as Record<string, LotteryEntry[]>)
                    ).map(([drawDate, entries]) => (
                      <div key={drawDate} className="border border-gray-600 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-3">
                          {formatDrawDate(new Date(drawDate))} Draw
                        </h3>
                        <div className="space-y-3">
                          {entries.map((entry) => (
                            <div key={entry.id} className="p-3 bg-gray-700 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white">Line {entry.line_number}</span>
                                <Badge variant={entry.stripe_subscription_id?.startsWith('sub_') ? 'default' : 'secondary'}>
                                  {entry.stripe_subscription_id?.startsWith('sub_') ? 'Subscription' : 'One-time'}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {entry.numbers.map((number, index) => (
                                  <div
                                    key={index}
                                    className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold text-white"
                                  >
                                    {number}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No previous entries found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
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
                        className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black"
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Jackpot</p>
                      <p className="font-semibold text-white">£{latestDraw.jackpot_amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Lucky Dip</p>
                      <p className="font-semibold text-white">£{latestDraw.lucky_dip_amount}</p>
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
                              Winner! £{result.prize_amount}
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