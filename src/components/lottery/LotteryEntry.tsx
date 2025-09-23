import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar, CreditCard, RefreshCw, Plus, Trash2, Gift, Percent } from "lucide-react";
import NumberSelector from "./NumberSelector";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LotteryLine {
  id: string;
  numbers: number[];
}

interface PromoCode {
  id: string;
  code_name: string;
  discount_percentage: number;
  usage_limit: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
}

const LotteryEntry = () => {
  const [lines, setLines] = useState<LotteryLine[]>([
    { id: "1", numbers: [] }
  ]);
  const [autoRenew, setAutoRenew] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const { toast } = useToast();

  const addNewLine = () => {
    const newLine: LotteryLine = {
      id: Date.now().toString(),
      numbers: []
    };
    setLines([...lines, newLine]);
  };

  const removeLine = (lineId: string) => {
    if (lines.length > 1) {
      setLines(lines.filter(line => line.id !== lineId));
    }
  };

  const updateLineNumbers = (lineId: string, numbers: number[]) => {
    setLines(lines.map(line => 
      line.id === lineId ? { ...line, numbers } : line
    ));
  };

  const getValidLines = () => {
    return lines.filter(line => line.numbers.length === 4);
  };

  const getTotalCost = () => {
    const validLines = getValidLines();
    const baseCost = validLines.length * 5; // £5 per line
    
    if (appliedPromo) {
      const discount = (baseCost * appliedPromo.discount_percentage) / 100;
      return Math.max(0, baseCost - discount);
    }
    
    return baseCost;
  };

  const getOriginalCost = () => {
    const validLines = getValidLines();
    return validLines.length * 5; // £5 per line
  };

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setAppliedPromo(null);
      return;
    }

    setIsValidatingPromo(true);

    try {
      const { data, error } = await supabase
        .from('lottery_promo_codes')
        .select('*')
        .eq('code_name', promoCode.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Invalid promo code",
          description: "The promo code you entered is not valid or has expired.",
          variant: "destructive"
        });
        setAppliedPromo(null);
        return;
      }

      // Check if expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast({
          title: "Promo code expired",
          description: "This promo code has expired.",
          variant: "destructive"
        });
        setAppliedPromo(null);
        return;
      }

      // Check usage limit
      if (data.usage_limit && data.used_count >= data.usage_limit) {
        toast({
          title: "Promo code limit reached",
          description: "This promo code has reached its usage limit.",
          variant: "destructive"
        });
        setAppliedPromo(null);
        return;
      }

      setAppliedPromo(data);
      toast({
        title: "Promo code applied!",
        description: `${data.discount_percentage}% discount applied - ${data.reason}`,
      });
    } catch (error) {
      console.error('Error validating promo code:', error);
      toast({
        title: "Error",
        description: "Failed to validate promo code. Please try again.",
        variant: "destructive"
      });
      setAppliedPromo(null);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setAppliedPromo(null);
  };

  const handlePayment = async () => {
    const validLines = getValidLines();
    
    if (validLines.length === 0) {
      toast({
        title: "No valid lines",
        description: "Please select 4 numbers for at least one line.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to purchase lottery tickets.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      const functionName = autoRenew ? 'create-lottery-subscription' : 'create-lottery-payment';
      const priceId = autoRenew ? 'price_1SAW2kBMVhaJwA6CyXZ9WV8U' : 'price_1SAW2TBMVhaJwA6C7bPbdbDs';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { 
          priceId,
          quantity: validLines.length,
          lotteryLines: validLines.map(line => line.numbers),
          promoCode: appliedPromo?.code_name || null,
          originalAmount: getOriginalCost(),
          discountedAmount: totalCost
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to payment",
          description: "Please complete your payment in the new tab."
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const validLines = getValidLines();
  const totalCost = getTotalCost();
  const originalCost = getOriginalCost();
  const hasDiscount = appliedPromo && totalCost < originalCost;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Lottery Entry
          </CardTitle>
          <p className="text-gray-400">
            Next draw: Last week of {new Date().toLocaleString('default', { month: 'long' })}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lottery Lines */}
          {lines.map((line, index) => (
            <div key={line.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Line {index + 1}</h3>
                {lines.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLine(line.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <NumberSelector
                selectedNumbers={line.numbers}
                onNumbersChange={(numbers) => updateLineNumbers(line.id, numbers)}
              />
              {index < lines.length - 1 && <Separator className="bg-gray-700" />}
            </div>
          ))}

          {/* Add Line Button */}
          <Button
            variant="outline"
            onClick={addNewLine}
            className="w-full flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Another Line (+£5)
          </Button>

          {/* Auto Renew Option */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-renew" className="text-white font-medium">
                    Auto Renew Monthly
                  </Label>
                  <p className="text-sm text-gray-400">
                    Automatically enter every month so you never miss a draw
                  </p>
                </div>
                <Switch
                  id="auto-renew"
                  checked={autoRenew}
                  onCheckedChange={setAutoRenew}
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-gradient-to-r from-blue-600/10 to-red-600/10 border-blue-600/20">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white">Valid Lines:</span>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {validLines.length}
                  </Badge>
                </div>
                
                {hasDiscount && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Original Cost:</span>
                      <span className="text-lg text-gray-400 line-through">£{originalCost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400 flex items-center gap-2">
                        <Percent className="w-4 h-4" />
                        {appliedPromo?.code_name} (-{appliedPromo?.discount_percentage}%)
                      </span>
                      <span className="text-sm text-green-400">-£{(originalCost - totalCost).toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Cost:</span>
                  <span className={`text-2xl font-bold ${hasDiscount ? 'text-green-400' : 'text-green-400'}`}>
                    £{totalCost.toFixed(2)}
                  </span>
                </div>
                {autoRenew && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Billing:</span>
                    <Badge className="bg-blue-600">Monthly</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Promo Code Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Gift className="w-5 h-5 text-purple-400" />
                Promo Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-green-400" />
                    <span className="font-mono font-bold text-green-400">{appliedPromo.code_name}</span>
                    <Badge className="bg-green-600">{appliedPromo.discount_percentage}% off</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removePromoCode}
                    className="text-gray-400 hover:text-white"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="bg-gray-700 border-gray-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && validatePromoCode()}
                  />
                  <Button
                    onClick={validatePromoCode}
                    disabled={!promoCode.trim() || isValidatingPromo}
                    variant="outline"
                  >
                    {isValidatingPromo ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              )}
              <p className="text-xs text-gray-400">
                Have a promo code? Enter it above to get a discount on your lottery entry.
              </p>
            </CardContent>
          </Card>

          {/* Payment Button */}
          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={handlePayment}
            disabled={isProcessing || validLines.length === 0}
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4 mr-2" />
            )}
            {autoRenew ? 'Subscribe' : 'Pay'} £{totalCost.toFixed(2)}
          </Button>

          {validLines.length === 0 && (
            <p className="text-sm text-center text-yellow-400">
              Complete at least one line with 4 numbers to proceed
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LotteryEntry;