import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME");
    const apiKey = Deno.env.get("CLOUDINARY_API_KEY");
    const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Missing Cloudinary credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { url, folderId, folder = "media" } = await req.json();

    if (!url) {
      throw new Error("No URL provided");
    }

    console.log(`Downloading file from URL: ${url}`);

    // Download the file from the URL
    const fileResponse = await fetch(url);
    
    if (!fileResponse.ok) {
      throw new Error(`Failed to download file: ${fileResponse.statusText}`);
    }

    const fileBlob = await fileResponse.blob();
    
    // Check if content is actually an image or video, not HTML
    const contentType = fileBlob.type;
    console.log(`Downloaded content type: ${contentType}, size: ${fileBlob.size}`);
    
    if (contentType.includes('text/html') || contentType.includes('text/plain')) {
      throw new Error('URL returned a web page instead of a file. Make sure you are using a direct file download link, not a folder or preview link.');
    }
    
    if (!contentType.startsWith('image/') && !contentType.startsWith('video/')) {
      throw new Error(`Invalid file type: ${contentType}. Only images and videos are supported. Make sure the URL points directly to a media file.`);
    }
    
    const arrayBuffer = await fileBlob.arrayBuffer();
    
    // Get filename from URL or use timestamp
    const urlParts = url.split('/');
    const filenameFromUrl = urlParts[urlParts.length - 1].split('?')[0];
    const filename = filenameFromUrl || `file-${Date.now()}`;
    
    console.log(`Downloaded ${filename}, size: ${fileBlob.size} bytes, type: ${fileBlob.type}`);

    // Check file size
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (fileBlob.size > maxFileSize) {
      throw new Error(`File too large (${(fileBlob.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 10MB.`);
    }

    // Convert to base64 for Cloudinary upload
    const uint8Array = new Uint8Array(arrayBuffer);
    let base64 = '';
    const chunkSize = 8192;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      base64 += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    const base64Encoded = btoa(base64);
    const dataUri = `data:${fileBlob.type};base64,${base64Encoded}`;

    // Determine resource type
    const isImage = fileBlob.type.startsWith('image/');
    const resourceType = isImage ? 'image' : 'raw';

    // Generate Cloudinary signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    const encoder = new TextEncoder();
    const signatureParams = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const data = encoder.encode(signatureParams);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Upload to Cloudinary
    const uploadData = new FormData();
    uploadData.append("file", dataUri);
    uploadData.append("folder", folder);
    uploadData.append("timestamp", timestamp.toString());
    uploadData.append("api_key", apiKey);
    uploadData.append("signature", signature);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    
    console.log(`Uploading to Cloudinary: ${uploadUrl}`);
    
    const cloudinaryResponse = await fetch(uploadUrl, {
      method: "POST",
      body: uploadData,
    });

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error("Cloudinary upload failed:", errorText);
      throw new Error(`Cloudinary upload failed (${cloudinaryResponse.status}): ${errorText}`);
    }

    const result = await cloudinaryResponse.json();
    console.log("Upload successful:", result.secure_url);

    // Create media item in database if folderId provided
    if (folderId) {
      const fileType = isImage ? 'image' : fileBlob.type.startsWith('video/') ? 'video' : 'other';
      
      const { error: dbError } = await supabase
        .from('media_items')
        .insert([{
          folder_id: folderId,
          url: result.secure_url,
          type: fileType,
          title: filename
        }]);

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw new Error(`Failed to save media item: ${dbError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in upload-from-url function:", error);
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
