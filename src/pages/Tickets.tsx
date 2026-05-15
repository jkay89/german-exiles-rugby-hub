import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Ticket as TicketIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FixtureWithTickets {
  id: string;
  team: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  competition: string;
  is_home: boolean;
  tickets_on_sale: boolean;
  min_price: number | null;
}

const Tickets = () => {
  const [fixtures, setFixtures] = useState<FixtureWithTickets[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data: fxs } = await supabase
        .from("fixtures")
        .select("*")
        .eq("tickets_on_sale", true)
        .gte("date", today)
        .order("date", { ascending: true });

      if (!fxs || fxs.length === 0) {
        setFixtures([]);
        setLoading(false);
        return;
      }

      const ids = fxs.map((f: any) => f.id);
      const { data: tix } = await supabase
        .from("fixture_tickets")
        .select("fixture_id, price, is_active")
        .in("fixture_id", ids);

      const minByFixture: Record<string, number> = {};
      (tix || []).forEach((t: any) => {
        if (!t.is_active) return;
        const cur = minByFixture[t.fixture_id];
        const p = Number(t.price);
        if (cur === undefined || p < cur) minByFixture[t.fixture_id] = p;
      });

      setFixtures(fxs.map((f: any) => ({ ...f, min_price: minByFixture[f.id] ?? null })));
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-german-red/10 text-german-red text-sm font-semibold mb-4">
            <TicketIcon className="h-4 w-4" /> Match Tickets
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Buy Tickets
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Secure your seat for upcoming German Exiles fixtures. Confirmation emailed instantly.
          </p>
        </motion.div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading fixtures…</p>
        ) : fixtures.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <TicketIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No tickets are currently on sale. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {fixtures.map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-card border-border hover:border-german-gold transition-colors">
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <Badge className="mb-2 bg-german-red text-white">{f.competition}</Badge>
                        <CardTitle className="text-xl text-foreground">
                          {f.is_home ? `${f.team} vs ${f.opponent}` : `${f.opponent} vs ${f.team}`}
                        </CardTitle>
                      </div>
                      {f.min_price !== null && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">From</p>
                          <p className="text-2xl font-bold text-german-gold">£{f.min_price.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(f.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        {f.time ? ` · ${f.time}` : ""}
                      </span>
                      {f.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {f.location}
                        </span>
                      )}
                    </div>
                    <Link to={`/tickets/${f.id}`}>
                      <Button className="w-full bg-german-red hover:bg-german-gold text-white">
                        Buy Tickets
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
