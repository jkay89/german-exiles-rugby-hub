import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ExternalLink, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SubscriptionManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to manage your subscription.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to Stripe",
          description: "Manage your subscription in the new tab."
        });
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Error",
        description: "Unable to open subscription management. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Manage Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-400">
          Manage your lottery subscription, update payment methods, or cancel anytime.
        </p>
        
        <Button
          onClick={handleManageSubscription}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ExternalLink className="w-4 h-4 mr-2" />
          )}
          {isLoading ? "Opening..." : "Manage Subscription"}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          You'll be taken to Stripe's secure portal to manage your subscription
        </p>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManager;