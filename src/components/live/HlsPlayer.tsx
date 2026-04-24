import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";

interface HlsPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  isLive?: boolean;
}

export const HlsPlayer = ({ src, poster, autoPlay = true, isLive = false }: HlsPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setLoading(true);
    setError(null);

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({ lowLatencyMode: isLive, enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        if (autoPlay) video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) {
          setError("Stream unavailable");
          setLoading(false);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = src;
      video.addEventListener("loadedmetadata", () => setLoading(false));
      if (autoPlay) video.play().catch(() => {});
    } else {
      setError("HLS not supported in this browser");
      setLoading(false);
    }

    return () => {
      hls?.destroy();
    };
  }, [src, autoPlay, isLive]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const enterFullscreen = () => {
    const c = containerRef.current;
    const v = videoRef.current as any;
    if (!c || !v) return;

    const doc = document as any;
    const isFs =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.webkitCurrentFullScreenElement;

    if (isFs) {
      (doc.exitFullscreen || doc.webkitExitFullscreen)?.call(doc);
      return;
    }

    // iOS Safari: only the <video> element can go fullscreen
    if (typeof v.webkitEnterFullscreen === "function") {
      try {
        v.muted = false;
        setMuted(false);
        v.webkitEnterFullscreen();
        return;
      } catch {
        // fall through
      }
    }

    // Standard / Android Chrome / desktop
    const req =
      c.requestFullscreen ||
      (c as any).webkitRequestFullscreen ||
      (v.requestFullscreen as any) ||
      v.webkitRequestFullscreen;
    req?.call(c.requestFullscreen ? c : v);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-border group"
    >
      <video
        ref={videoRef}
        poster={poster}
        muted={muted}
        playsInline
        className="w-full h-full object-contain"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Live badge */}
      {isLive && !loading && !error && (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground" />
          </span>
          Live
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/40">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      )}

      {/* Controls */}
      {!error && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="text-white hover:text-primary transition"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <button
              onClick={toggleMute}
              className="text-white hover:text-primary transition"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <div className="flex-1" />
            <button
              onClick={enterFullscreen}
              className="text-white hover:text-primary transition"
              aria-label="Fullscreen"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
