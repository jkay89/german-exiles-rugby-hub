import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Minus, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";

const TICKET_LABELS: Record<string, string> = {
  adult: "Adult",
  concession: "Concession",
  child: "Child",
  family: "Family (2 adults + 2 children)",
  hospitality: "Hospitality",
};
const TYPE_ORDER = ["adult", "concession", "child", "family", "hospitality"];

const customerSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  notes: z.string().max(500).optional(),
});

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
interface TicketType {
  id: string;
  ticket_type: string;
  price: number;
  is_active: boolean;
  display_order: number;
}

const TicketPurchase = () => {
  const { fixtureId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customer, setCustomer] = useState({ name: "", email: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fixtureId) return;
    const load = async () => {
      const { data: f } = await supabase.from("fixtures").select("*").eq("id", fixtureId).single();
      const { data: t } = await supabase
        .from("fixture_tickets").select("*").eq("fixture_id", fixtureId).eq("is_active", true)
        .order("display_order");
      setFixture(f as any);
      const sorted = (t || []).sort((a: any, b: any) =>
        TYPE_ORDER.indexOf(a.ticket_type) - TYPE_ORDER.indexOf(b.ticket_type)
      );
      setTickets(sorted as any);
      setLoading(false);
    };
    load();
  }, [fixtureId]);

  const setQty = (type: string, delta: number) => {
    setQuantities((q) => {
      const next = Math.max(0, Math.min(20, (q[type] || 0) + delta));
      return { ...q, [type]: next };
    });
  };

  const totalTickets = Object.values(quantities).reduce((s, n) => s + n, 0);
  const subtotal = tickets.reduce((s, t) => s + (quantities[t.ticket_type] || 0) * Number(t.price), 0);

  const handleCheckout = async () => {
    const parsed = customerSchema.safeParse(customer);
    if (!parsed.success) {
      toast({ title: "Check your details", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    if (totalTickets === 0) {
      toast({ title: "No tickets selected", description: "Please add at least one ticket.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const items = Object.entries(quantities)
        .filter(([, q]) => q > 0)
        .map(([ticketType, quantity]) => ({ ticketType, quantity }));

      const { data, error } = await supabase.functions.invoke("create-ticket-payment", {
        body: { fixtureId, customer: parsed.data, items, notes: parsed.data.notes },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (e: any) {
      toast({ title: "Checkout failed", description: e.message, variant: "destructive" });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!fixture || !fixture.tickets_on_sale) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 container mx-auto px-4 max-w-2xl text-center">
          <p className="text-muted-foreground mb-4">Tickets are not available for this fixture.</p>
          <Link to="/tickets"><Button variant="outline">Back to tickets</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <Link to="/tickets" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to all tickets
        </Link>

        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <Badge className="w-fit mb-2 bg-german-red text-white">{fixture.competition}</Badge>
            <CardTitle className="text-2xl text-foreground">
              {fixture.is_home ? `${fixture.team} vs ${fixture.opponent}` : `${fixture.opponent} vs ${fixture.team}`}
            </CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(fixture.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                {fixture.time ? ` · ${fixture.time}` : ""}
              </span>
              {fixture.location && (
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {fixture.location}</span>
              )}
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-card border-border mb-6">
          <CardHeader><CardTitle className="text-foreground">Select tickets</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {tickets.length === 0 ? (
              <p className="text-muted-foreground text-sm">No ticket types configured yet.</p>
            ) : tickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                <div>
                  <p className="font-semibold text-foreground">{TICKET_LABELS[t.ticket_type] || t.ticket_type}</p>
                  <p className="text-sm text-german-gold font-bold">£{Number(t.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button size="icon" variant="outline" onClick={() => setQty(t.ticket_type, -1)} disabled={!quantities[t.ticket_type]}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-bold text-foreground">{quantities[t.ticket_type] || 0}</span>
                  <Button size="icon" variant="outline" onClick={() => setQty(t.ticket_type, 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border mb-6">
          <CardHeader><CardTitle className="text-foreground">Your details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full name *</Label>
              <Input id="name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} maxLength={100} />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} maxLength={255} />
              <p className="text-xs text-muted-foreground mt-1">Confirmation will be sent here.</p>
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} maxLength={500} rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-foreground">Total ({totalTickets} ticket{totalTickets === 1 ? "" : "s"})</span>
              <span className="text-2xl font-bold text-german-gold">£{subtotal.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={submitting || totalTickets === 0}
              className="w-full bg-german-red hover:bg-german-gold text-white"
              size="lg"
            >
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Redirecting…</> : "Proceed to payment"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketPurchase;
