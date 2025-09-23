import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Save, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LotteryDraw {
  id: string;
  draw_date: string;
  winning_numbers: number[];
  jackpot_amount: number;
  lucky_dip_amount: number;
  created_at: string;
}

const AdminLottery = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [draws, setDraws] = useState<LotteryDraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentJackpot, setCurrentJackpot] = useState(1000);
  const [newDraw, setNewDraw] = useState({
    draw_date: "",
    winning_numbers: [0, 0, 0, 0],
    jackpot_amount: 0,
    lucky_dip_amount: 50
  });
  const [nextDrawDate, setNextDrawDate] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDraws();
      fetchNextDrawDate();
      fetchCurrentJackpot();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchNextDrawDate = () => {
    // Calculate next draw date (last day of next month)
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setNextDrawDate(nextMonth.toISOString().split('T')[0]);
  };

  const fetchCurrentJackpot = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_settings')
        .select('setting_value')
        .eq('setting_key', 'current_jackpot')
        .single();

      if (error) throw error;
      if (data) {
        setCurrentJackpot(Number(data.setting_value));
      }
    } catch (error) {
      console.error('Error fetching current jackpot:', error);
    }
  };

  const updateCurrentJackpot = async (newAmount: number) => {
    try {
      const { error } = await supabase
        .from('lottery_settings')
        .update({ setting_value: newAmount.toString() })
        .eq('setting_key', 'current_jackpot');

      if (error) throw error;

      setCurrentJackpot(newAmount);
      toast({
        title: "Success",
        description: "Current jackpot updated successfully",
      });
    } catch (error) {
      console.error('Error updating current jackpot:', error);
      toast({
        title: "Error",
        description: "Failed to update current jackpot",
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
      const { error } = await supabase
        .from('lottery_draws')
        .insert([{
          draw_date: newDraw.draw_date,
          winning_numbers: newDraw.winning_numbers,
          jackpot_amount: newDraw.jackpot_amount,
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

  if (!isAuthenticated) return null;

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
              Current Jackpot Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="current-jackpot">Current Jackpot Amount (£)</Label>
                <Input
                  id="current-jackpot"
                  type="number"
                  value={currentJackpot}
                  onChange={(e) => setCurrentJackpot(Number(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <Button 
                onClick={() => updateCurrentJackpot(currentJackpot)} 
                className="bg-yellow-600 hover:bg-yellow-700 mt-6"
              >
                Update Jackpot
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              This amount will be displayed on the lottery page as the current jackpot prize
            </p>
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
              Next scheduled draw: <span className="text-white">{new Date(nextDrawDate).toLocaleDateString('en-GB')}</span>
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
                  value={newDraw.jackpot_amount}
                  onChange={(e) => setNewDraw({ ...newDraw, jackpot_amount: Number(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
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
      </motion.div>
    </div>
  );
};

export default AdminLottery;
