import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Trophy, Heart, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import stadiumImg from "@/assets/millennium-stadium-featherstone.jpg";

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

const GALLERY_IMAGES = [
  "https://res.cloudinary.com/dvfs51lfd/image/upload/v1762765479/media/kglxcs6vv35wylek2kl4.jpg",
  "https://res.cloudinary.com/dvfs51lfd/image/upload/v1762765482/media/tsychxwuqe1vps5z7wdl.jpg",
  "https://res.cloudinary.com/dvfs51lfd/image/upload/v1762765486/media/yletkizlrtuzdibinzov.jpg",
  "https://res.cloudinary.com/dvfs51lfd/image/upload/v1762765492/media/jz5fzb2sjh4rpy75jtzn.jpg",
  "https://res.cloudinary.com/dvfs51lfd/image/upload/v1762765495/media/sgshyk3oewfyckdjs8pn.jpg",
  "https://res.cloudinary.com/dvfs51lfd/image/upload/v1762765500/media/angvxi69s7qkrcsrpm4w.jpg",
  "https://res.cloudinary.com/dvfs51lfd/image/upload/v1762765505/media/qmdwfrwmzodjj7a7x0qj.jpg",
  "https://res.cloudinary.com/dvfs51lfd/image/upload/v1762765509/media/x3y3nprqdhbao3kxqghs.jpg",
  "https://res.cloudinary.com/dvfs51lfd/image/upload/v1762765514/media/h0ltled7gbu7gthx6f4f.jpg",
];

const HERO_IMAGE = GALLERY_IMAGES[0];

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
      {/* HERO */}
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Kaiser Cup action shot"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-german-gold" />
            <span className="uppercase tracking-[0.3em] text-german-gold text-sm">German Exiles Rugby League</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-gradient-to-b from-white to-german-gold bg-clip-text text-transparent">
            The Kaiser Cup
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-gray-200">
            A celebration of German rugby league — a pathway, a fundraiser, and a fixture worth travelling for.
          </p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* DESCRIPTION */}
      {event?.description && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-6 py-20"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-german-gold mb-8">About the Kaiser Cup</h2>
            <div className="prose prose-invert mx-auto whitespace-pre-line text-gray-200 text-lg leading-relaxed">
              {event.description}
            </div>
          </div>
        </motion.section>
      )}

      {/* EVENT DETAILS */}
      {(formattedDate || event?.event_time || event?.venue || event?.location) && (
        <section className="container mx-auto px-6 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-german-red/20 via-gray-900 to-german-gold/10 border border-german-gold/30 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-german-gold mb-8">2026 Match Day</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {formattedDate && (
                <div className="flex flex-col items-center gap-2">
                  <Calendar className="h-7 w-7 text-german-red" />
                  <span className="text-sm uppercase tracking-wider text-gray-400">Date</span>
                  <span className="font-semibold">{formattedDate}</span>
                </div>
              )}
              {event?.event_time && (
                <div className="flex flex-col items-center gap-2">
                  <Clock className="h-7 w-7 text-german-red" />
                  <span className="text-sm uppercase tracking-wider text-gray-400">Kick-Off</span>
                  <span className="font-semibold">{event.event_time}</span>
                </div>
              )}
              {event?.venue && (
                <div className="flex flex-col items-center gap-2">
                  <MapPin className="h-7 w-7 text-german-red" />
                  <span className="text-sm uppercase tracking-wider text-gray-400">Venue</span>
                  <span className="font-semibold">{event.venue}</span>
                </div>
              )}
              {event?.location && (
                <div className="flex flex-col items-center gap-2">
                  <MapPin className="h-7 w-7 text-german-red" />
                  <span className="text-sm uppercase tracking-wider text-gray-400">Location</span>
                  <span className="font-semibold">{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* THE VENUE — Millennium Stadium */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[60vh] min-h-[420px]">
          <img
            src={stadiumImg}
            alt="Millennium Stadium, Featherstone"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            width={1920}
            height={1024}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10 container mx-auto h-full flex items-center px-6"
          >
            <div className="max-w-xl">
              <span className="uppercase tracking-[0.3em] text-german-gold text-sm">The 2026 Venue</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5">Millennium Stadium, Featherstone</h2>
              <p className="text-gray-200 text-lg leading-relaxed">
                A true heartland of rugby league. In 2026 the Kaiser Cup heads to the home of Featherstone Rovers — a stadium steeped in history, atmosphere and community spirit. The perfect stage for an international showcase.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUE BLUE FEV REVIVAL */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-german-red/20 border border-german-red/40 mb-6">
            <Heart className="h-4 w-4 text-german-red" />
            <span className="text-sm uppercase tracking-wider text-german-red">In Partnership With</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-german-gold mb-6">
            Standing With True Blue Fev Revival
          </h2>
          <p className="text-gray-200 text-lg leading-relaxed mb-6">
            In 2026 we're proud to stand alongside the <strong className="text-white">True Blue Fev Revival</strong> — a passionate group of lifelong Featherstone Rovers supporters working to bring their beloved club back to the Rugby League for 2027.
          </p>
          <p className="text-gray-300 leading-relaxed mb-6">
            After Rovers were denied RFL membership for 2026, supporters Mick Wilkinson, Gareth Dyas and the True Blue committee united the fanbase, formed a constitution, and began raising funds to give any new owners the strongest possible start.
          </p>
          <p className="text-gray-300 leading-relaxed">
            By taking the 2026 Kaiser Cup to the Millennium Stadium, German Exiles are joining that revival — combining our international fundraising platform with theirs, putting bums on seats, and ensuring that rugby league in Featherstone has a future as bright as its past.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <Users className="h-6 w-6 text-german-gold mb-3" />
              <h3 className="font-semibold mb-1">United Fanbase</h3>
              <p className="text-sm text-gray-400">Bringing supporters back together as one community.</p>
            </div>
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <Heart className="h-6 w-6 text-german-red mb-3" />
              <h3 className="font-semibold mb-1">Fundraising Together</h3>
              <p className="text-sm text-gray-400">Match day proceeds support both programmes.</p>
            </div>
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
              <Trophy className="h-6 w-6 text-german-gold mb-3" />
              <h3 className="font-semibold mb-1">A Future For Rovers</h3>
              <p className="text-sm text-gray-400">Helping Featherstone return to the league in 2027.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* GALLERY */}
      <section className="container mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <span className="uppercase tracking-[0.3em] text-german-gold text-sm">Würzburg 2025</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Moments From The Kaiser Cup</h2>
          <p className="text-gray-400 mt-3">Photos by Malte Rohrmoser</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto">
          {GALLERY_IMAGES.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              className="aspect-square overflow-hidden rounded-lg group"
            >
              <img
                src={src}
                alt={`Kaiser Cup 2025 - photo ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* SPONSORS */}
      <section className="container mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <span className="uppercase tracking-[0.3em] text-german-gold text-sm">Made Possible By</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Our Kaiser Cup Sponsors</h2>
        </div>
        <div className="space-y-14 max-w-6xl mx-auto">
          {grouped.length === 0 ? (
            <p className="text-center text-gray-400">Sponsors for the 2026 Kaiser Cup will be announced soon.</p>
          ) : (
            grouped.map((group) => (
              <section key={group.category} className="text-center">
                <h3 className="text-2xl font-bold text-german-gold mb-6">{group.label}</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {group.items.map((s) => {
                    const inner = (
                      <div className="h-32 w-48 bg-gray-900 rounded-lg flex flex-col items-center justify-center p-4 border border-gray-700 hover:border-german-gold transition-colors">
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
      </section>
    </div>
  );
};

export default KaiserCup;
