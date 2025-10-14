import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url || !url.includes('cloudinary.com')) {
      throw new Error('Invalid document URL');
    }

    console.log(`Proxying download for: ${url}`);

    // Fetch the file from Cloudinary
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
    }

    // Get the file content
    const blob = await response.blob();
    
    // Extract filename from URL or use generic name
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1] || 'document';

    // Return the file with appropriate headers
    return new Response(blob, {
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in download-document function:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
