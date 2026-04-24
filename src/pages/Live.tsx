import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, PlayCircle, Radio, Tv } from "lucide-react";
import { format } from "date-fns";
import { useLiveStreams } from "@/hooks/useLiveStreams";
import { HlsPlayer } from "@/components/live/HlsPlayer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  en: {
    exiles_tv_tagline: "Your Home for German Exiles Rugby League",
    exiles_tv_subtagline: "Live Matches • Replays • Exclusive Content",
    no_live_stream: "No live stream right now",
    check_fixtures: "Check our fixtures page to see when we're next playing.",
    view_fixtures: "View Fixtures",
    upcoming_broadcasts: "Upcoming Broadcasts",
    replays: "Replays",
    live_badge: "Live",
  },
  de: {
    exiles_tv_tagline: "Ihre Heimat für German Exiles Rugby League",
    exiles_tv_subtagline: "Live-Spiele • Wiederholungen • Exklusive Inhalte",
    no_live_stream: "Kein Live-Stream zur Zeit",
    check_fixtures: "Schauen Sie auf unsere Spielplan-Seite, um zu sehen, wann wir als nächstes spielen.",
    view_fixtures: "Spielplan Ansehen",
    upcoming_broadcasts: "Kommende Übertragungen",
    replays: "Wiederholungen",
    live_badge: "Live",
  },
};

const Live = () => {
  const { liveNow, upcoming, replays, loading } = useLiveStreams();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ExilesTV Branded Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png"
                  alt="German Exiles RL Logo"
                  className="h-16 w-16 object-contain brightness-125"
                />
                <div className="absolute -bottom-1 -right-1 bg-german-red text-white p-1 rounded">
                  <Tv className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground flex items-center gap-3">
                  <span className="text-gradient bg-gradient-to-r from-german-red via-foreground to-german-gold bg-clip-text text-transparent">
                    ExilesTV
                  </span>
                </h1>
                <p className="text-german-gold font-semibold mt-1">
                  {t.exiles_tv_tagline}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground">
              {t.exiles_tv_subtagline}
            </p>
            
            {/* German Flag Accent Bar */}
            <div className="flex h-1.5 mt-4 rounded overflow-hidden max-w-md">
              <div className="flex-1 bg-black" />
              <div className="flex-1 bg-german-red" />
              <div className="flex-1 bg-german-gold" />
            </div>
          </div>

          {/* LIVE NOW */}
          {liveNow && liveNow.playback_url ? (
            <section className="mb-12">
              {/* Live Player Container with German Flag Border */}
              <div className="relative rounded-xl overflow-hidden ring-2 ring-german-red/50 shadow-2xl shadow-german-red/10">
                {/* German Flag Corner Accents */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-german-red to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-german-gold to-transparent z-10 pointer-events-none" />
                
                <HlsPlayer src={liveNow.playback_url} isLive autoPlay={false} />
              </div>
              
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{liveNow.title}</h2>
                  {liveNow.description && (
                    <p className="text-muted-foreground mt-1">{liveNow.description}</p>
                  )}
                </div>
                {/* Live Badge with German Colors */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-german-red via-german-red to-german-gold/80 text-white font-bold uppercase tracking-wider text-sm shadow-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                  </span>
                  {t.live_badge}
                </div>
              </div>
            </section>
          ) : (
            !loading && (
              <Card className="p-12 text-center bg-muted/40 border-border border-2 border-dashed border-german-red/30 mb-12 relative overflow-hidden">
                {/* German Flag Accent Background */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-black via-german-red to-german-gold" />
                
                <div className="relative z-10">
                  <div className="relative inline-block mb-4">
                    <Radio className="h-12 w-12 text-muted-foreground" />
                    <div className="absolute -bottom-1 -right-1 bg-german-red/20 p-1 rounded-full">
                      <Tv className="h-5 w-5 text-german-red" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {t.no_live_stream}
                  </h2>
                  <p className="text-muted-foreground">
                    {t.check_fixtures}
                  </p>
                  <Link to="/fixtures">
                    <Button variant="outline" className="mt-4 border-german-red/50 hover:bg-german-red/10 hover:text-german-red">
                      {t.view_fixtures}
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          )}

          {/* UPCOMING */}
          {upcoming.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-german-red" />
                {t.upcoming_broadcasts}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map((s) => (
                  <Card key={s.id} className="p-5 bg-card border-border hover:border-german-red/50 transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-german-red/10 text-german-red group-hover:bg-german-red group-hover:text-white transition-colors">
                        <Tv className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{s.title}</h3>
                        {s.scheduled_start && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                            <Clock className="h-4 w-4 text-german-gold" />
                            {format(new Date(s.scheduled_start), "PPp")}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* REPLAYS */}
          {replays.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <PlayCircle className="h-6 w-6 text-german-gold" />
                {t.replays}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {replays.map((s) => (
                  <Card key={s.id} className="overflow-hidden bg-card border-border hover:border-german-gold/50 transition-all hover:shadow-lg hover:shadow-german-gold/5">
                    {s.recording_url && (
                      <div className="relative">
                        <HlsPlayer src={s.recording_url} autoPlay={false} />
                        {/* Replay Badge */}
                        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium flex items-center gap-1">
                          <PlayCircle className="h-3 w-3" />
                          Replay
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground">{s.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-german-red" />
                        {format(new Date(s.created_at), "PP")}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Live;
