import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface KaiserEvent {
  description: string | null;
  event_date: string | null;
  event_time: string | null;
  venue: string | null;
  location: string | null;
}

interface KaiserSponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  category: string;
  display_order: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  main: "Main Sponsors",
  ball: "Ball Sponsors",
  motm: "Man of the Match Sponsors",
  warm_up_top: "Warm-Up Top Sponsors",
  affiliate: "Affiliate Sponsors",
  other: "Other Sponsors",
};

const CATEGORY_ORDER = ["main", "ball", "motm", "warm_up_top", "affiliate", "other"];

const KaiserCup = () => {
  const [event, setEvent] = useState<KaiserEvent | null>(null);
  const [sponsors, setSponsors] = useState<KaiserSponsor[]>([]);

  useEffect(() => {
    document.title = "Kaiser Cup | German Exiles Rugby League";
    const load = async () => {
      const [{ data: ev }, { data: sp }] = await Promise.all([
        supabase.from("kaiser_cup_event" as any).select("*").limit(1).maybeSingle(),
        supabase
          .from("kaiser_cup_sponsors" as any)
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true }),
      ]);
      if (ev) setEvent(ev as any);
      if (sp) setSponsors(sp as any);
    };
    load();
  }, []);

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: sponsors.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  const formattedDate = event?.event_date
    ? new Date(event.event_date).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="pt-16 min-h-screen bg-black text-white">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-8 w-8 text-german-gold" />
          <h1 className="text-4xl md:text-5xl font-bold text-german-gold">Kaiser Cup</h1>
        </div>

        {event?.description && (
          <div className="prose prose-invert max-w-3xl mb-10 whitespace-pre-line text-gray-200 text-lg leading-relaxed">
            {event.description}
          </div>
        )}

        {(formattedDate || event?.event_time || event?.venue || event?.location) && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-12 max-w-3xl">
            <h2 className="text-2xl font-semibold text-german-gold mb-4">Event Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formattedDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-german-red" />
                  <span>{formattedDate}</span>
                </div>
              )}
              {event?.event_time && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-german-red" />
                  <span>{event.event_time}</span>
                </div>
              )}
              {event?.venue && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-german-red" />
                  <span>{event.venue}</span>
                </div>
              )}
              {event?.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-german-red" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-12">
          {grouped.length === 0 ? (
            <p className="text-gray-400">Sponsors for this year's Kaiser Cup will be announced soon.</p>
          ) : (
            grouped.map((group) => (
              <section key={group.category}>
                <h2 className="text-2xl font-bold text-german-gold mb-6">{group.label}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {group.items.map((s) => {
                    const inner = (
                      <div className="h-32 w-full bg-gray-900 rounded-lg flex flex-col items-center justify-center p-4 border border-gray-700 hover:border-german-gold transition-colors">
                        {s.logo_url ? (
                          <img
                            src={s.logo_url}
                            alt={`${s.name} logo`}
                            className="max-h-20 max-w-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-white font-semibold text-center">{s.name}</span>
                        )}
                      </div>
                    );
                    return s.website_url ? (
                      <a
                        key={s.id}
                        href={s.website_url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div key={s.id}>{inner}</div>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default KaiserCup;
