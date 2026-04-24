// Polls Cloudflare for current state of a live input and updates DB.
// Also fetches recording (VOD) URL once available.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const accountId = Deno.env.get("CLOUDFLARE_ACCOUNT_ID")!;
    const apiToken = Deno.env.get("CLOUDFLARE_STREAM_API_TOKEN")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const body = await req.json().catch(() => ({}));
    const stream_id: string | undefined = body.stream_id;

    let query = admin.from("live_streams").select("*");
    if (stream_id) query = query.eq("id", stream_id);
    const { data: streams, error } = await query;
    if (error) throw error;

    const results: any[] = [];

    for (const s of streams || []) {
      // Check live state
      const liveRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs/${s.cloudflare_uid}/videos`,
        { headers: { Authorization: `Bearer ${apiToken}` } },
      );
      const liveJson = await liveRes.json();
      const videos = liveJson.result || [];

      // The currently-live video has status.state === "live-inprogress"
      const liveVideo = videos.find(
        (v: any) => v.status?.state === "live-inprogress",
      );
      // A finished recording is readyToStream with positive duration
      const readyVideo = videos.find(
        (v: any) => v.readyToStream && v.duration > 0,
      );

      const isLive = !!liveVideo;
      // Use the playback URL Cloudflare provides directly (correct customer subdomain + video UID)
      const livePlaybackUrl = liveVideo?.playback?.hls || null;
      const recordingUrl = readyVideo?.playback?.hls || s.recording_url;

      const updatePayload: Record<string, unknown> = {
        is_live: isLive,
        recording_url: recordingUrl,
      };
      // While live, point playback_url at the live video's HLS manifest
      if (livePlaybackUrl) {
        updatePayload.playback_url = livePlaybackUrl;
      }

      const { data: updated } = await admin
        .from("live_streams")
        .update(updatePayload)
        .eq("id", s.id)
        .select()
        .single();
      results.push(updated);
    }

    return new Response(JSON.stringify({ streams: results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
