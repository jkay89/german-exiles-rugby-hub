import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Calendar, CheckCircle, Loader2 } from "lucide-react";

const TICKET_TYPES = [
  { key: "adult", label: "Adult" },
  { key: "concession", label: "Concession" },
  { key: "child", label: "Child" },
  { key: "family", label: "Family (2 adults + 2 children)" },
  { key: "hospitality", label: "Hospitality" },
];

interface Fixture {
  id: string;
  team: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  competition: string;
  is_home: boolean;
  tickets_on_sale: boolean;
}
interface FixtureTicket {
  id?: string;
  fixture_id: string;
  ticket_type: string;
  price: number;
  is_active: boolean;
}
interface OrderRow {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  created_at: string;
  fixture_id: string;
  stripe_session_id: string | null;
}

const AdminTickets = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [ticketsByFixture, setTicketsByFixture] = useState<Record<string, FixtureTicket[]>>({});
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin");
  }, [isAuthenticated, navigate]);

  useEffect(() => { if (isAuthenticated) load(); }, [isAuthenticated]);

  const load = async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const { data: fxs } = await supabase
      .from("fixtures").select("*").gte("date", today).order("date");
    setFixtures((fxs as any) || []);

    if (fxs && fxs.length > 0) {
      const ids = fxs.map((f: any) => f.id);
      const { data: tix } = await supabase
        .from("fixture_tickets").select("*").in("fixture_id", ids);
      const grouped: Record<string, FixtureTicket[]> = {};
      const missingRows: Array<{ fixture_id: string; ticket_type: string; price: number; is_active: boolean; display_order: number }> = [];
      ids.forEach((id) => {
        const existing = (tix || []).filter((t: any) => t.fixture_id === id);
        grouped[id] = TICKET_TYPES.map((tt, index) => {
          const found = existing.find((e: any) => e.ticket_type === tt.key);
          if (found) return { ...found, price: Number(found.price) };

          missingRows.push({ fixture_id: id, ticket_type: tt.key, price: 0, is_active: true, display_order: index });
          return { fixture_id: id, ticket_type: tt.key, price: 0, is_active: true };
        });
      });
      setTicketsByFixture(grouped);

      if (missingRows.length > 0) {
        const { error } = await supabase.from("fixture_tickets").upsert(missingRows, {
          onConflict: "fixture_id,ticket_type",
          ignoreDuplicates: true,
        });
        if (error) {
          toast({ title: "Some ticket rows could not be restored", description: error.message, variant: "destructive" });
        }
      }
    }

    const { data: ordersData } = await supabase
      .from("ticket_orders").select("*").order("created_at", { ascending: false }).limit(50);
    setOrders((ordersData as any) || []);
    setLoading(false);
  };

  const toggleSale = async (fixtureId: string, value: boolean) => {
    const { error } = await supabase.from("fixtures").update({ tickets_on_sale: value }).eq("id", fixtureId);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setFixtures((fs) => fs.map((f) => f.id === fixtureId ? { ...f, tickets_on_sale: value } : f));
    toast({ title: value ? "Ticket sales enabled" : "Ticket sales disabled" });
  };

  const updateLocalPrice = (fixtureId: string, type: string, price: number) => {
    setTicketsByFixture((m) => ({
      ...m,
      [fixtureId]: m[fixtureId].map((t) => t.ticket_type === type ? { ...t, price } : t),
    }));
  };
  const updateLocalActive = (fixtureId: string, type: string, active: boolean) => {
    setTicketsByFixture((m) => ({
      ...m,
      [fixtureId]: m[fixtureId].map((t) => t.ticket_type === type ? { ...t, is_active: active } : t),
    }));
  };

  const savePrices = async (fixtureId: string) => {
    const rows = ticketsByFixture[fixtureId] || [];
    for (const [index, row] of rows.entries()) {
      const payload = {
        fixture_id: fixtureId,
        ticket_type: row.ticket_type,
        price: Number(row.price) || 0,
        is_active: row.is_active,
        display_order: index,
      };
      if (row.id) {
        await supabase.from("fixture_tickets").update(payload).eq("id", row.id);
      } else {
        await supabase.from("fixture_tickets").upsert(payload, { onConflict: "fixture_id,ticket_type" });
      }
    }
    toast({ title: "Prices saved" });
    load();
  };

  const manuallyConfirmOrder = async (orderId: string) => {
    setConfirmingOrderId(orderId);
    try {
      const { data, error } = await supabase.functions.invoke("manual-confirm-ticket-order", {
        body: { orderId },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Manual confirmation failed");

      toast({
        title: data.alreadyFulfilled ? "Already fulfilled" : "Order confirmed",
        description: data.alreadyFulfilled ? "Tickets had already been sent." : "Tickets have been generated and emailed.",
      });
      load();
    } catch (error: any) {
      toast({ title: "Confirmation failed", description: error.message, variant: "destructive" });
    } finally {
      setConfirmingOrderId(null);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-8">Ticket Management</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming fixtures</h2>
              {fixtures.length === 0 ? (
                <p className="text-muted-foreground">No upcoming fixtures.</p>
              ) : (
                <div className="space-y-4">
                  {fixtures.map((f) => (
                    <Card key={f.id} className="bg-card border-border">
                      <CardHeader>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <Badge className="mb-2 bg-german-red text-white">{f.competition}</Badge>
                            <CardTitle className="text-foreground">
                              {f.is_home ? `${f.team} vs ${f.opponent}` : `${f.opponent} vs ${f.team}`}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(f.date).toLocaleDateString("en-GB")} {f.time && `· ${f.time}`} {f.location && `· ${f.location}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-foreground">Tickets on sale</Label>
                            <Switch checked={f.tickets_on_sale} onCheckedChange={(v) => toggleSale(f.id, v)} />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {(ticketsByFixture[f.id] || []).map((t) => (
                            <div key={t.ticket_type} className="p-3 rounded-lg bg-muted/30 border border-border">
                              <div className="flex items-center justify-between mb-2">
                                <Label className="text-foreground text-sm">{TICKET_TYPES.find((x) => x.key === t.ticket_type)?.label}</Label>
                                <Switch checked={t.is_active} onCheckedChange={(v) => updateLocalActive(f.id, t.ticket_type, v)} />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">£</span>
                                <Input
                                  type="number" step="0.01" min="0"
                                  value={t.price}
                                  onChange={(e) => updateLocalPrice(f.id, t.ticket_type, parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button onClick={() => savePrices(f.id)} className="mt-4 bg-german-red hover:bg-german-gold text-white">
                          <Save className="h-4 w-4 mr-2" /> Save prices
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent orders</h2>
              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  {orders.length === 0 ? (
                    <p className="text-muted-foreground p-6">No ticket orders yet.</p>
                  ) : (
                    <div className="divide-y divide-border">
                      {orders.map((o) => {
                        const fx = fixtures.find((f) => f.id === o.fixture_id);
                        return (
                          <div key={o.id} className="p-4 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-mono text-xs text-muted-foreground">{o.id.slice(0, 8).toUpperCase()}</p>
                              <p className="text-foreground font-semibold">{o.customer_name}</p>
                              <p className="text-sm text-muted-foreground">{o.customer_email}</p>
                              {fx && <p className="text-xs text-muted-foreground">{fx.team} vs {fx.opponent}</p>}
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                              <p className="text-german-gold font-bold">£{Number(o.total).toFixed(2)}</p>
                              <Badge variant={o.status === "paid" || o.status === "fulfilled" ? "default" : "secondary"}>{o.status}</Badge>
                              <p className="text-xs text-muted-foreground">
                                {new Date(o.created_at).toLocaleString("en-GB")}
                              </p>
                              {(o.status === "pending" || o.status === "paid") && (
                                <Button
                                  size="sm"
                                  className="bg-german-red hover:bg-german-gold text-white"
                                  disabled={confirmingOrderId === o.id}
                                  onClick={() => manuallyConfirmOrder(o.id)}
                                >
                                  {confirmingOrderId === o.id ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                  )}
                                  Confirm &amp; email
                                </Button>
                              )}
                              {o.status === "pending" && o.stripe_session_id && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={async () => {
                                    toast({ title: "Verifying with Stripe…" });
                                    const { data, error } = await supabase.functions.invoke("verify-ticket-payment", {
                                      body: { sessionId: o.stripe_session_id },
                                    });
                                    if (error) {
                                      toast({ title: "Verify failed", description: error.message, variant: "destructive" });
                                    } else if (data?.paid) {
                                      toast({ title: "Order marked paid", description: "Tickets emailed to customer." });
                                      load();
                                    } else {
                                      toast({ title: "Not paid", description: `Stripe status: ${data?.status || "unknown"}`, variant: "destructive" });
                                    }
                                  }}
                                >
                                  Verify &amp; fulfil
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTickets;
