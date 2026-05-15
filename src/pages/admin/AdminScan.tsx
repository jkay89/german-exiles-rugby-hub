import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Camera, CameraOff, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FixtureLite {
  id: string;
  team: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
}

interface ScanResult {
  result: "valid" | "already_used" | "wrong_fixture" | "not_found" | "invalid";
  message?: string;
  ticket?: {
    id: string;
    ticket_label?: string;
    holder_name?: string;
    used_at?: string;
  };
  fixture?: { team: string; opponent: string; date: string };
  scannedAt: number;
}

const COOLDOWN_MS = 2500;

const AdminScan = () => {
  const { isAuthenticated, loading } = useAdmin();
  const navigate = useNavigate();
  const [fixtures, setFixtures] = useState<FixtureLite[]>([]);
  const [fixtureId, setFixtureId] = useState<string>("");
  const [scanning, setScanning] = useState(true);
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const lastCodeRef = useRef<{ code: string; ts: number } | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/admin");
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("fixtures")
        .select("id, team, opponent, date, time, location")
        .gte("date", today)
        .order("date")
        .limit(20);
      setFixtures((data as any) || []);
    })();
  }, [isAuthenticated]);

  const validate = async (code: string) => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("validate-ticket", {
        body: { ticketId: code, fixtureId: fixtureId || undefined },
      });
      const result: ScanResult = {
        ...(data as any),
        scannedAt: Date.now(),
      };
      if (error) {
        result.result = "invalid";
        result.message = error.message;
      }
      setLast(result);
      setHistory((h) => [result, ...h].slice(0, 25));
      // Beep / haptic feedback
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(result.result === "valid" ? 80 : [60, 40, 60]);
      }
    } finally {
      setBusy(false);
    }
  };

  const onScan = (codes: IDetectedBarcode[]) => {
    if (busy || !codes.length) return;
    const code = codes[0].rawValue?.trim();
    if (!code) return;
    const now = Date.now();
    if (lastCodeRef.current && lastCodeRef.current.code === code && now - lastCodeRef.current.ts < COOLDOWN_MS) {
      return;
    }
    lastCodeRef.current = { code, ts: now };
    validate(code);
  };

  const stats = useMemo(() => {
    const valid = history.filter((h) => h.result === "valid").length;
    const denied = history.length - valid;
    return { valid, denied, total: history.length };
  }, [history]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading…</div>;
  }
  if (!isAuthenticated) return null;

  const styleByResult: Record<ScanResult["result"], { wrap: string; icon: JSX.Element; title: string }> = {
    valid: { wrap: "border-green-600/50 bg-green-600/10", icon: <CheckCircle2 className="w-12 h-12 text-green-500" />, title: "ADMIT" },
    already_used: { wrap: "border-amber-600/50 bg-amber-600/10", icon: <AlertTriangle className="w-12 h-12 text-amber-500" />, title: "ALREADY USED" },
    wrong_fixture: { wrap: "border-amber-600/50 bg-amber-600/10", icon: <AlertTriangle className="w-12 h-12 text-amber-500" />, title: "WRONG MATCH" },
    not_found: { wrap: "border-destructive/50 bg-destructive/10", icon: <XCircle className="w-12 h-12 text-destructive" />, title: "NOT FOUND" },
    invalid: { wrap: "border-destructive/50 bg-destructive/10", icon: <XCircle className="w-12 h-12 text-destructive" />, title: "INVALID" },
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Gate Scanner</h1>
          <div className="flex gap-2 text-sm">
            <Badge variant="outline" className="border-green-600/50 text-green-500">{stats.valid} admitted</Badge>
            <Badge variant="outline" className="border-destructive/50 text-destructive">{stats.denied} denied</Badge>
          </div>
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Match (optional filter)</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={fixtureId || "any"} onValueChange={(v) => setFixtureId(v === "any" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Any match" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any match (accept all valid tickets)</SelectItem>
                {fixtures.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.team} vs {f.opponent} — {new Date(f.date).toLocaleDateString("en-GB")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fixtureId && (
              <p className="text-xs text-muted-foreground mt-2">
                Tickets for other matches will be rejected.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-4 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative bg-black aspect-square">
              {scanning ? (
                <Scanner
                  onScan={onScan}
                  constraints={{ facingMode: "environment" }}
                  formats={["qr_code"]}
                  scanDelay={300}
                  components={{ finder: true, audio: false }}
                  styles={{
                    container: { width: "100%", height: "100%" },
                    video: { width: "100%", height: "100%", objectFit: "cover" },
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <CameraOff className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="p-3 flex justify-between items-center bg-muted/40">
              <Button variant="outline" size="sm" onClick={() => setScanning((s) => !s)}>
                {scanning ? <><CameraOff className="w-4 h-4 mr-2" /> Pause</> : <><Camera className="w-4 h-4 mr-2" /> Resume</>}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setLast(null); lastCodeRef.current = null; }}>
                <RotateCcw className="w-4 h-4 mr-2" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {last && (
          <Card className={cn("mb-4 border-2", styleByResult[last.result].wrap)}>
            <CardContent className="p-6 flex items-center gap-4">
              {styleByResult[last.result].icon}
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold">{styleByResult[last.result].title}</p>
                {last.ticket?.ticket_label && (
                  <p className="text-lg">{last.ticket.ticket_label}</p>
                )}
                {last.ticket?.holder_name && (
                  <p className="text-sm text-muted-foreground truncate">{last.ticket.holder_name}</p>
                )}
                {last.message && (
                  <p className="text-sm text-muted-foreground mt-1">{last.message}</p>
                )}
                {last.result === "wrong_fixture" && last.fixture && (
                  <p className="text-sm mt-1">
                    Ticket is for: <strong>{last.fixture.team} vs {last.fixture.opponent}</strong>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {history.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent scans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 text-sm py-1 border-b border-border/40 last:border-0">
                  {h.result === "valid"
                    ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    : <XCircle className="w-4 h-4 text-destructive shrink-0" />}
                  <span className="flex-1 truncate">
                    {h.ticket?.ticket_label || "Unknown"} {h.ticket?.holder_name ? `· ${h.ticket.holder_name}` : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(h.scannedAt).toLocaleTimeString("en-GB")}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminScan;
