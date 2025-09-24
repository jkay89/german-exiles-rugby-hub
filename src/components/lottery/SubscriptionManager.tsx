import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface SubscriptionDetails {
  hasSubscription: boolean;
  status?: string;
  linesCount?: number;
  pricePerLine?: number;
  totalAmount?: number;
  currency?: string;
  nextPaymentDate?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  stripeSubscriptionId?: string;
  createdAt?: string;
  canceledAt?: string | null;
}

const SubscriptionManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSubscriptionDetails();
  }, []);

  const loadSubscriptionDetails = async () => {
    try {
      setDetailsLoading(true);
      const { data, error } = await supabase.functions.invoke('get-subscription-details', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        }
      });

      if (error) {
        console.error('Error loading subscription details:', error);
        setSubscriptionDetails({ hasSubscription: false });
      } else {
        setSubscriptionDetails(data);
      }
    } catch (error) {
      console.error('Failed to load subscription details:', error);
      setSubscriptionDetails({ hasSubscription: false });
    } finally {
      setDetailsLoading(false);
    }
  };

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
        {detailsLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading subscription status...
          </div>
        ) : subscriptionDetails?.hasSubscription ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Badge 
                variant={
                  subscriptionDetails.status === 'active' ? 'default' : 
                  subscriptionDetails.status === 'canceled' ? 'destructive' : 'secondary'
                } 
                className="text-sm"
              >
                {subscriptionDetails.status?.toUpperCase() || 'UNKNOWN'}
              </Badge>
              {subscriptionDetails.status === 'canceled' && (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
            
            {subscriptionDetails.status === 'active' ? (
              <p className="text-gray-400">
                Manage your active lottery subscription, update payment methods, or cancel anytime.
              </p>
            ) : subscriptionDetails.status === 'canceled' ? (
              <div className="space-y-2">
                <p className="text-red-400">
                  Your subscription has been canceled.
                </p>
                {subscriptionDetails.canceledAt && (
                  <p className="text-sm text-gray-500">
                    Canceled on {new Date(subscriptionDetails.canceledAt).toLocaleDateString('en-GB')}
                  </p>
                )}
                {subscriptionDetails.currentPeriodEnd && (
                  <p className="text-sm text-gray-400">
                    Access until: {new Date(subscriptionDetails.currentPeriodEnd).toLocaleDateString('en-GB')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-yellow-400">
                Subscription status: {subscriptionDetails.status}
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-400">
            No active subscription found.
          </p>
        )}
        
        <Button
          onClick={handleManageSubscription}
          disabled={isLoading || !subscriptionDetails?.hasSubscription}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
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