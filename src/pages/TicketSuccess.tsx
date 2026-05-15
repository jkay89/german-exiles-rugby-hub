import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

const TicketSuccess = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "paid" | "error">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) { setStatus("error"); return; }
    (async () => {
      const { data, error } = await supabase.functions.invoke("verify-ticket-payment", {
        body: { sessionId },
      });
      if (error || !data?.paid) { setStatus("error"); return; }
      setOrderId(data.orderId);
      setStatus("paid");
    })();
  }, [params]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 container mx-auto px-4 max-w-xl">
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 mx-auto mb-4 text-german-gold animate-spin" />
                <p className="text-foreground">Confirming your payment…</p>
              </>
            )}
            {status === "paid" && (
              <>
                <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-german-gold" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Tickets confirmed!</h1>
                <p className="text-muted-foreground mb-2">
                  We've emailed your confirmation. Show it at the gate for entry.
                </p>
                {orderId && (
                  <p className="text-sm text-muted-foreground mb-6">
                    Reference: <span className="font-mono text-foreground">{orderId.slice(0, 8).toUpperCase()}</span>
                  </p>
                )}
                <Link to="/tickets"><Button variant="outline">Back to tickets</Button></Link>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="h-16 w-16 mx-auto mb-4 text-german-red" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Couldn't confirm payment</h1>
                <p className="text-muted-foreground mb-6">
                  If you were charged, please contact us with your email so we can send your tickets.
                </p>
                <Link to="/tickets"><Button variant="outline">Back to tickets</Button></Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketSuccess;
