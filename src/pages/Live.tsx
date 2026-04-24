import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, PlayCircle, Radio } from "lucide-react";
import { format } from "date-fns";
import { useLiveStreams } from "@/hooks/useLiveStreams";
import { HlsPlayer } from "@/components/live/HlsPlayer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Live = () => {
  const { liveNow, upcoming, replays, loading } = useLiveStreams();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground flex items-center gap-3">
              <Radio className="h-9 w-9 text-primary" />
              Live & Replays
            </h1>
            <p className="text-muted-foreground mt-2">
              Watch German Exiles matches live or catch up on replays
            </p>
          </div>

          {/* LIVE NOW */}
          {liveNow && liveNow.playback_url ? (
            <section className="mb-12">
              <HlsPlayer src={liveNow.playback_url} isLive autoPlay={false} />
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-foreground">{liveNow.title}</h2>
                {liveNow.description && (
                  <p className="text-muted-foreground mt-1">{liveNow.description}</p>
                )}
              </div>
            </section>
          ) : (
            !loading && (
              <Card className="p-12 text-center bg-muted/40 border-border mb-12">
                <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  No live stream right now
                </h2>
                <p className="text-muted-foreground">
                  Check our fixtures page to see when we're next playing.
                </p>
                <Link to="/fixtures">
                  <Button variant="outline" className="mt-4">
                    View Fixtures
                  </Button>
                </Link>
              </Card>
            )
          )}

          {/* UPCOMING */}
          {upcoming.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-secondary" />
                Upcoming Broadcasts
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map((s) => (
                  <Card key={s.id} className="p-5 bg-card border-border">
                    <h3 className="font-semibold text-foreground">{s.title}</h3>
                    {s.scheduled_start && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                        <Clock className="h-4 w-4" />
                        {format(new Date(s.scheduled_start), "PPp")}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* REPLAYS */}
          {replays.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <PlayCircle className="h-6 w-6 text-secondary" />
                Replays
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {replays.map((s) => (
                  <Card key={s.id} className="overflow-hidden bg-card border-border">
                    {s.recording_url && (
                      <HlsPlayer src={s.recording_url} autoPlay={false} />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground">{s.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
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
