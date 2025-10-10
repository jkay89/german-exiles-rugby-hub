import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME");
    const apiKey = Deno.env.get("CLOUDINARY_API_KEY");
    const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET");

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary credentials not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { bucket, table, urlColumn, idColumn, folder } = await req.json();

    console.log(`Starting migration for bucket: ${bucket}, table: ${table}`);

    // List all files in the bucket
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list();

    if (listError) throw listError;

    console.log(`Found ${files?.length || 0} files in bucket ${bucket}`);

    const results = {
      total: files?.length || 0,
      migrated: 0,
      failed: 0,
      errors: [] as any[],
    };

    for (const file of files || []) {
      try {
        console.log(`Migrating file: ${file.name}`);

        // Download file from Supabase storage
        const { data: fileData, error: downloadError } = await supabase.storage
          .from(bucket)
          .download(file.name);

        if (downloadError) throw downloadError;

        // Convert blob to base64 in chunks to avoid stack overflow
        const arrayBuffer = await fileData.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let base64 = '';
        const chunkSize = 8192;
        
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.subarray(i, i + chunkSize);
          base64 += String.fromCharCode.apply(null, Array.from(chunk));
        }
        
        const base64Encoded = btoa(base64);
        const mimeType = file.metadata?.mimetype || "image/jpeg";
        const dataUri = `data:${mimeType};base64,${base64Encoded}`;

        // Upload to Cloudinary
        const timestamp = Math.round(new Date().getTime() / 1000);
        const dataToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(dataToSign);
        const hashBuffer = await crypto.subtle.digest("SHA-1", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const uploadData = new FormData();
        uploadData.append("file", dataUri);
        uploadData.append("folder", folder);
        uploadData.append("timestamp", timestamp.toString());
        uploadData.append("api_key", apiKey);
        uploadData.append("signature", signature);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: uploadData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Cloudinary upload failed: ${errorText}`);
        }

        const uploadResult = await uploadResponse.json();
        const newUrl = uploadResult.secure_url;

        console.log(`File uploaded to Cloudinary: ${newUrl}`);

        // Update database with new URL
        const oldUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${file.name}`;
        
        const { error: updateError } = await supabase
          .from(table)
          .update({ [urlColumn]: newUrl })
          .eq(urlColumn, oldUrl);

        if (updateError) {
          console.error(`Failed to update database for ${file.name}:`, updateError);
        }

        results.migrated++;
        console.log(`Successfully migrated ${file.name}`);
      } catch (error) {
        console.error(`Error migrating ${file.name}:`, error);
        results.failed++;
        results.errors.push({
          file: file.name,
          error: error.message,
        });
      }
    }

    console.log(`Migration complete. Migrated: ${results.migrated}, Failed: ${results.failed}`);

    return new Response(
      JSON.stringify(results),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in migrate-to-cloudinary function:", error);
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
