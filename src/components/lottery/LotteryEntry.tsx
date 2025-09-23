import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, CreditCard, RefreshCw, Plus, Trash2 } from "lucide-react";
import NumberSelector from "./NumberSelector";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LotteryLine {
  id: string;
  numbers: number[];
}

const LotteryEntry = () => {
  const [lines, setLines] = useState<LotteryLine[]>([
    { id: "1", numbers: [] }
  ]);
  const [autoRenew, setAutoRenew] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
    return validLines.length * 5; // £5 per line
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
          lotteryLines: validLines.map(line => line.numbers)
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
                <div className="flex justify-between items-center">
                  <span className="text-white">Total Cost:</span>
                  <span className="text-2xl font-bold text-green-400">£{totalCost}</span>
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
            {autoRenew ? 'Subscribe' : 'Pay'} £{totalCost}
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