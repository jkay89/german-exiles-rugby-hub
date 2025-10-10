import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

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
      console.error("Missing Cloudinary credentials");
      throw new Error("Cloudinary credentials not configured");
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "uploads";

    if (!file) {
      throw new Error("No file provided");
    }

    console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // Convert file to array buffer
    let arrayBuffer = await file.arrayBuffer();
    let processedArrayBuffer = arrayBuffer;
    
    // Check file size - if over 5MB, resize it aggressively
    const targetSize = 5 * 1024 * 1024; // 5MB to be safe
    if (arrayBuffer.byteLength > targetSize) {
      console.log(`File is ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB, resizing...`);
      
      try {
        // Decode image
        const image = await Image.decode(new Uint8Array(arrayBuffer));
        
        // Calculate new dimensions (max 1500px on longest side for large files)
        const maxDimension = 1500;
        let newWidth = image.width;
        let newHeight = image.height;
        
        if (image.width > image.height) {
          if (image.width > maxDimension) {
            newWidth = maxDimension;
            newHeight = Math.round((image.height * maxDimension) / image.width);
          }
        } else {
          if (image.height > maxDimension) {
            newHeight = maxDimension;
            newWidth = Math.round((image.width * maxDimension) / image.height);
          }
        }
        
        // Resize image
        const resized = image.resize(newWidth, newHeight);
        
        // Encode as JPEG with 75% quality for aggressive compression
        const encoded = await resized.encodeJPEG(75);
        processedArrayBuffer = encoded.buffer;
        
        console.log(`Resized from ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB to ${(processedArrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
        
        // If still too large after compression, reject it
        if (processedArrayBuffer.byteLength > 10 * 1024 * 1024) {
          throw new Error(`File too large even after compression (${(processedArrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB) - please resize manually`);
        }
      } catch (resizeError) {
        console.error(`Failed to resize:`, resizeError);
        // If original is over 10MB, reject it
        if (arrayBuffer.byteLength > 10 * 1024 * 1024) {
          throw new Error("File too large and resize failed");
        }
        processedArrayBuffer = arrayBuffer;
      }
    }

    // Convert to base64 in chunks to avoid stack overflow
    const uint8Array = new Uint8Array(processedArrayBuffer);
    let base64 = '';
    const chunkSize = 8192;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      base64 += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    const base64Encoded = btoa(base64);
    const dataUri = `data:${file.type};base64,${base64Encoded}`;

    // Generate timestamp for signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Create signature
    const encoder = new TextEncoder();
    const dataToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const data = encoder.encode(dataToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Create upload payload with authentication
    const uploadData = new FormData();
    uploadData.append("file", dataUri);
    uploadData.append("folder", folder);
    uploadData.append("timestamp", timestamp.toString());
    uploadData.append("api_key", apiKey);
    uploadData.append("signature", signature);

    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    console.log(`Uploading to Cloudinary: ${uploadUrl}`);
    
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: uploadData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload failed:", errorText);
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const result = await response.json();
    console.log("Upload successful:", result.secure_url);

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
    console.error("Error in upload-to-cloudinary function:", error);
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
