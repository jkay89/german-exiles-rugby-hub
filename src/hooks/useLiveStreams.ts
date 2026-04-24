import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LiveStream {
  id: string;
  cloudflare_uid: string;
  title: string;
  description: string | null;
  playback_url: string | null;
  recording_url: string | null;
  is_live: boolean;
  scheduled_start: string | null;
  fixture_id: string | null;
  rtmp_url?: string | null;
  stream_key?: string | null;
  created_at: string;
}

export const useLiveStreams = () => {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("live_streams")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setStreams((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStreams();

    // Realtime: refresh when is_live changes
    const channel = supabase
      .channel("live_streams_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_streams" },
        () => fetchStreams(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const liveNow = streams.find((s) => s.is_live);
  const upcoming = streams.filter(
    (s) => !s.is_live && s.scheduled_start && new Date(s.scheduled_start) > new Date(),
  );
  const replays = streams.filter((s) => !s.is_live && s.recording_url);

  return { streams, liveNow, upcoming, replays, loading, error, refetch: fetchStreams };
};
