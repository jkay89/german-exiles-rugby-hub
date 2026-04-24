// Create a new Cloudflare Stream Live Input and store it in the database
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: isAdmin } = await admin.rpc("is_admin", {
      _user_id: userData.user.id,
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const title: string = body.title || "Untitled Stream";
    const description: string | null = body.description ?? null;
    const fixture_id: string | null = body.fixture_id ?? null;
    const scheduled_start: string | null = body.scheduled_start ?? null;

    const accountId = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");
    const apiToken = Deno.env.get("CLOUDFLARE_STREAM_API_TOKEN");
    if (!accountId || !apiToken) {
      return new Response(
        JSON.stringify({ error: "Cloudflare credentials not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create a Cloudflare Stream Live Input
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meta: { name: title },
          recording: { mode: "automatic", requireSignedURLs: false },
        }),
      },
    );
    const cfJson = await cfRes.json();
    if (!cfRes.ok || !cfJson.success) {
      console.error("Cloudflare error", cfJson);
      return new Response(
        JSON.stringify({ error: "Cloudflare API error", details: cfJson }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const cfInput = cfJson.result;
    const cloudflare_uid: string = cfInput.uid;
    const rtmp_url: string = cfInput.rtmps?.url || cfInput.rtmp?.url;
    const stream_key: string =
      cfInput.rtmps?.streamKey || cfInput.rtmp?.streamKey;
    // HLS playback URL pattern (using customer subdomain or videodelivery.net)
    const playback_url = `https://customer-${accountId}.cloudflarestream.com/${cloudflare_uid}/manifest/video.m3u8`;

    const { data: inserted, error: insertErr } = await admin
      .from("live_streams")
      .insert({
        cloudflare_uid,
        title,
        description,
        rtmp_url,
        stream_key,
        playback_url,
        fixture_id,
        scheduled_start,
        is_live: false,
      })
      .select()
      .single();

    if (insertErr) {
      console.error("Insert error", insertErr);
      return new Response(JSON.stringify({ error: insertErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Link to fixture
    if (fixture_id) {
      await admin
        .from("fixtures")
        .update({ stream_id: inserted.id })
        .eq("id", fixture_id);
    }

    return new Response(JSON.stringify({ stream: inserted }), {
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
