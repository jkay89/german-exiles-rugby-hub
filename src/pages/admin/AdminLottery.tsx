import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Save, Calendar, Percent, Gift, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LotteryEntriesTable from "@/components/admin/LotteryEntriesTable";
import { TestEmailSender } from "@/components/admin/TestEmailSender";

interface LotteryEntry {
  id: string;
  user_id: string;
  numbers: number[];
  line_number: number;
  is_active: boolean;
  created_at: string;
  stripe_subscription_id?: string;
}

interface LotteryDraw {
  id: string;
  draw_date: string;
  winning_numbers: number[];
  jackpot_amount: number;
  lucky_dip_amount: number;
  created_at: string;
}

const AdminLottery = () => {
  const { isAuthenticated, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [draws, setDraws] = useState<LotteryDraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDraw, setNewDraw] = useState({
    draw_date: "",
    winning_numbers: [0, 0, 0, 0],
    jackpot_amount: 0,
    lucky_dip_amount: 50
  });
  const [nextDrawDate, setNextDrawDate] = useState("");
  const [currentJackpot, setCurrentJackpot] = useState(1000);
  const [newJackpotAmount, setNewJackpotAmount] = useState("");
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [newPromoCode, setNewPromoCode] = useState({
    code_name: "",
    reason: "",
    discount_percentage: 0,
    usage_limit: null as number | null,
    expires_at: ""
  });

  useEffect(() => {
    if (!isAuthenticated && !adminLoading) {
      navigate("/admin");
    }
  }, [isAuthenticated, adminLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([
        fetchDraws(),
        fetchCurrentJackpot(),
        fetchPromoCodes()
      ]).finally(() => {
        setLoading(false);
      });
      fetchNextDrawDate();
    }
  }, [isAuthenticated]);

  const fetchDraws = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_draws')
        .select('*')
        .order('draw_date', { ascending: false });

      if (error) throw error;
      setDraws(data || []);
    } catch (error) {
      console.error('Error fetching draws:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lottery draws",
        variant: "destructive",
      });
    }
  };

  const fetchNextDrawDate = () => {
    // Calculate next draw date (last day of next month)
    const now = new Date();
    const lastDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    const formattedDate = lastDayOfNextMonth.toISOString().split('T')[0];
    setNextDrawDate(formattedDate);
  };

  const fetchCurrentJackpot = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_settings')
        .select('setting_value')
        .eq('setting_key', 'current_jackpot')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setCurrentJackpot(Number(data.setting_value));
        setNewJackpotAmount(data.setting_value);
      }
    } catch (error) {
      console.error('Error fetching current jackpot:', error);
    }
  };

  const updateCurrentJackpot = async () => {
    if (!newJackpotAmount || Number(newJackpotAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid jackpot amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('lottery_settings')
        .upsert({
          setting_key: 'current_jackpot',
          setting_value: newJackpotAmount
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;

      setCurrentJackpot(Number(newJackpotAmount));
      toast({
        title: "Success",
        description: "Current jackpot amount updated successfully",
      });
    } catch (error) {
      console.error('Error updating jackpot:', error);
      toast({
        title: "Error",
        description: "Failed to update jackpot amount",
        variant: "destructive",
      });
    }
  };

  const fetchPromoCodes = async () => {
    console.log("fetchPromoCodes called");
    try {
      const { data, error } = await supabase
        .from('lottery_promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      console.log("Promo codes fetch result:", { data, error });
      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch promo codes",
        variant: "destructive",
      });
    }
  };

  const handleAddPromoCode = async () => {
    if (!newPromoCode.code_name || !newPromoCode.reason || newPromoCode.discount_percentage <= 0) {
      toast({
        title: "Invalid Data",
        description: "Please fill in all required fields with valid values",
        variant: "destructive",
      });
      return;
    }

    try {
      const promoData = {
        code_name: newPromoCode.code_name.toUpperCase(),
        reason: newPromoCode.reason,
        discount_percentage: newPromoCode.discount_percentage,
        usage_limit: newPromoCode.usage_limit,
        expires_at: newPromoCode.expires_at || null
      };

      const { error } = await supabase
        .from('lottery_promo_codes')
        .insert([promoData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Promo code created successfully",
      });

      setNewPromoCode({
        code_name: "",
        reason: "",
        discount_percentage: 0,
        usage_limit: null,
        expires_at: ""
      });

      fetchPromoCodes();
    } catch (error: any) {
      console.error('Error creating promo code:', error);
      if (error.code === '23505') {
        toast({
          title: "Error",
          description: "A promo code with this name already exists",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create promo code",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeletePromoCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lottery_promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Promo code deleted successfully",
      });

      fetchPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
      toast({
        title: "Error",
        description: "Failed to delete promo code",
        variant: "destructive",
      });
    }
  };

  const togglePromoCodeStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('lottery_promo_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Promo code ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });

      fetchPromoCodes();
    } catch (error) {
      console.error('Error updating promo code status:', error);
      toast({
        title: "Error",
        description: "Failed to update promo code status",
        variant: "destructive",
      });
    }
  };

  const handleAddDraw = async () => {
    if (!newDraw.draw_date || newDraw.winning_numbers.some(n => n < 1 || n > 32)) {
      toast({
        title: "Invalid Data",
        description: "Please provide a valid date and numbers between 1-32",
        variant: "destructive",
      });
      return;
    }

    try {
      const finalJackpotAmount = newDraw.jackpot_amount || currentJackpot;
      
      const { error } = await supabase
        .from('lottery_draws')
        .insert([{
          draw_date: newDraw.draw_date,
          winning_numbers: newDraw.winning_numbers,
          jackpot_amount: finalJackpotAmount,
          lucky_dip_amount: newDraw.lucky_dip_amount
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lottery draw added successfully",
      });

      setNewDraw({
        draw_date: "",
        winning_numbers: [0, 0, 0, 0],
        jackpot_amount: 0,
        lucky_dip_amount: 50
      });

      fetchDraws();
    } catch (error) {
      console.error('Error adding draw:', error);
      toast({
        title: "Error",
        description: "Failed to add lottery draw",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDraw = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lottery_draws')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Draw deleted successfully",
      });

      fetchDraws();
    } catch (error) {
      console.error('Error deleting draw:', error);
      toast({
        title: "Error",
        description: "Failed to delete draw",
        variant: "destructive",
      });
    }
  };

  const updateWinningNumber = (index: number, value: number) => {
    const newNumbers = [...newDraw.winning_numbers];
    newNumbers[index] = value;
    setNewDraw({ ...newDraw, winning_numbers: newNumbers });
  };

  if (adminLoading) {
    console.log("AdminLottery: admin loading...");
    return (
      <div className="pt-16 min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("AdminLottery: not authenticated, isAuthenticated:", isAuthenticated, "adminLoading:", adminLoading);
    return null;
  }

  console.log("AdminLottery: rendering main content, loading:", loading);

  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <h1 className="text-3xl font-bold text-white mb-8">Lottery Management</h1>

        {/* Current Jackpot Management */}
        <Card className="bg-gray-900 border-gray-800 text-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5 text-yellow-400" />
              Current Jackpot Prize Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-gray-400 mb-4">
                Current jackpot prize: <span className="text-2xl font-bold text-yellow-400">£{currentJackpot.toLocaleString()}</span>
              </p>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="new-jackpot">New Jackpot Amount (£)</Label>
                  <Input
                    id="new-jackpot"
                    type="number"
                    value={newJackpotAmount}
                    onChange={(e) => setNewJackpotAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter new jackpot amount"
                  />
                </div>
                <Button 
                  onClick={updateCurrentJackpot}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Update Jackpot
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Draw Info */}
        <Card className="bg-gray-900 border-gray-800 text-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Next Draw Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Next scheduled draw: <span className="text-white">{nextDrawDate ? new Date(nextDrawDate).toLocaleDateString('en-GB') : 'Calculating...'}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This is automatically calculated as the last day of next month
            </p>
          </CardContent>
        </Card>

        {/* Add New Draw */}
        <Card className="bg-gray-900 border-gray-800 text-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-400" />
              Add New Draw Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="draw-date">Draw Date</Label>
                <Input
                  id="draw-date"
                  type="date"
                  value={newDraw.draw_date}
                  onChange={(e) => setNewDraw({ ...newDraw, draw_date: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="jackpot-amount">Jackpot Amount (£)</Label>
                <Input
                  id="jackpot-amount"
                  type="number"
                  value={newDraw.jackpot_amount || currentJackpot}
                  onChange={(e) => setNewDraw({ ...newDraw, jackpot_amount: Number(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder={`Default: ${currentJackpot}`}
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use current jackpot (£{currentJackpot.toLocaleString()})</p>
              </div>
            </div>

            <div>
              <Label>Winning Numbers (1-32)</Label>
              <div className="flex gap-2 mt-2">
                {newDraw.winning_numbers.map((number, index) => (
                  <Input
                    key={index}
                    type="number"
                    min="1"
                    max="32"
                    value={number || ''}
                    onChange={(e) => updateWinningNumber(index, Number(e.target.value))}
                    className="w-16 bg-gray-800 border-gray-700 text-white text-center"
                    placeholder={`#${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="lucky-dip-amount">Lucky Dip Amount per Winner (£)</Label>
              <Input
                id="lucky-dip-amount"
                type="number"
                value={newDraw.lucky_dip_amount}
                onChange={(e) => setNewDraw({ ...newDraw, lucky_dip_amount: Number(e.target.value) })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button onClick={handleAddDraw} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Add Draw Result
            </Button>
          </CardContent>
        </Card>

        {/* Promo Code Management */}
        <Card className="bg-gray-900 border-gray-800 text-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-400" />
              Promo Code Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Promo Code */}
            <div className="border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Create New Promo Code</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="promo-code-name">Code Name</Label>
                  <Input
                    id="promo-code-name"
                    type="text"
                    placeholder="e.g., SAVE20"
                    value={newPromoCode.code_name}
                    onChange={(e) => setNewPromoCode({ ...newPromoCode, code_name: e.target.value.toUpperCase() })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="promo-reason">Reason/Description</Label>
                  <Input
                    id="promo-reason"
                    type="text"
                    placeholder="e.g., Holiday Special"
                    value={newPromoCode.reason}
                    onChange={(e) => setNewPromoCode({ ...newPromoCode, reason: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="promo-discount">Discount Percentage (%)</Label>
                  <Input
                    id="promo-discount"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g., 20"
                    value={newPromoCode.discount_percentage || ''}
                    onChange={(e) => setNewPromoCode({ ...newPromoCode, discount_percentage: Number(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="promo-usage-limit">Usage Limit (Optional)</Label>
                  <Input
                    id="promo-usage-limit"
                    type="number"
                    min="1"
                    placeholder="Leave blank for unlimited"
                    value={newPromoCode.usage_limit || ''}
                    onChange={(e) => setNewPromoCode({ ...newPromoCode, usage_limit: e.target.value ? Number(e.target.value) : null })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="promo-expires">Expires At (Optional)</Label>
                  <Input
                    id="promo-expires"
                    type="datetime-local"
                    value={newPromoCode.expires_at}
                    onChange={(e) => setNewPromoCode({ ...newPromoCode, expires_at: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddPromoCode} 
                className="bg-purple-600 hover:bg-purple-700 mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Promo Code
              </Button>
            </div>

            {/* Existing Promo Codes */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Existing Promo Codes</h3>
              {promoCodes.length === 0 ? (
                <p className="text-gray-400">No promo codes created yet</p>
              ) : (
                <div className="space-y-3">
                  {promoCodes.map((promo) => (
                    <div key={promo.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-purple-400">{promo.code_name}</span>
                          <Badge className={`${promo.is_active ? 'bg-green-600' : 'bg-gray-600'}`}>
                            {promo.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <span className="text-yellow-400 flex items-center gap-1">
                            <Percent className="w-4 h-4" />
                            {promo.discount_percentage}% off
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{promo.reason}</p>
                        <div className="text-xs text-gray-500 mt-1 space-x-4">
                          {promo.usage_limit && (
                            <span>Limit: {promo.used_count}/{promo.usage_limit}</span>
                          )}
                          {promo.expires_at && (
                            <span>Expires: {new Date(promo.expires_at).toLocaleDateString('en-GB')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => togglePromoCodeStatus(promo.id, promo.is_active)}
                          variant={promo.is_active ? "outline" : "default"}
                          size="sm"
                        >
                          {promo.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          onClick={() => handleDeletePromoCode(promo.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Existing Draws */}
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Draw History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-400">Loading draws...</p>
            ) : draws.length === 0 ? (
              <p className="text-gray-400">No draws found</p>
            ) : (
              <div className="space-y-4">
                {draws.map((draw) => (
                  <div key={draw.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{new Date(draw.draw_date).toLocaleDateString('en-GB')}</p>
                        <div className="flex gap-2 mt-2">
                          {draw.winning_numbers.map((number, index) => (
                            <Badge 
                              key={index}
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white"
                            >
                              {number}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        <p>Jackpot: £{draw.jackpot_amount.toLocaleString()}</p>
                        <p>Lucky Dip: £{draw.lucky_dip_amount}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteDraw(draw.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Test Email Sender */}
        <div className="mb-8">
          <TestEmailSender />
        </div>
        
        {/* Lottery Entries Management */}
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              All Lottery Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LotteryEntriesTable />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLottery;
