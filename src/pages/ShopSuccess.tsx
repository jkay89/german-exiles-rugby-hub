import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

const ShopSuccess = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState<"verifying" | "paid" | "unpaid" | "error">("verifying");
  const { clearCart } = useCart();

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      return;
    }
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-shop-payment", {
          body: { sessionId },
        });
        if (error) throw error;
        if (data?.paid) {
          setState("paid");
          clearCart();
        } else {
          setState("unpaid");
        }
      } catch (e) {
        console.error(e);
        setState("error");
      }
    })();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-10 px-4 max-w-xl mx-auto flex items-center justify-center min-h-[80vh]">
        <Card className="w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            {state === "verifying" && (
              <>
                <Loader2 className="h-16 w-16 text-muted-foreground mx-auto animate-spin" />
                <h1 className="text-2xl font-bold">Confirming your payment…</h1>
                <p className="text-muted-foreground">Please wait a moment.</p>
              </>
            )}
            {state === "paid" && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h1 className="text-3xl font-bold">Order Confirmed!</h1>
                <p className="text-muted-foreground">
                  Thank you for your purchase. You will receive a confirmation email shortly.
                  Our team will dispatch your order as soon as possible.
                </p>
              </>
            )}
            {state === "unpaid" && (
              <>
                <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />
                <h1 className="text-2xl font-bold">Payment not completed</h1>
                <p className="text-muted-foreground">
                  We couldn't confirm your payment. If you believe this is an error,
                  please contact us.
                </p>
              </>
            )}
            {state === "error" && (
              <>
                <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
                <h1 className="text-2xl font-bold">Something went wrong</h1>
                <p className="text-muted-foreground">
                  We couldn't verify your order. Please contact us if you were charged.
                </p>
              </>
            )}
            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
              <Button variant="outline" onClick={() => navigate("/")}>Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopSuccess;
