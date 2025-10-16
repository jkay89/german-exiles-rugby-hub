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

    // Determine if this is an image or other file type
    const isImage = file.type.startsWith('image/');
    const resourceType = isImage ? 'image' : 'raw';
    
    console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}, resourceType: ${resourceType}`);

    // Hard limit to prevent memory issues - reject files over 10MB upfront
    const maxFileSize = 10 * 1024 * 1024;
    if (file.size > maxFileSize) {
      throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 10MB. Please compress or resize the image before uploading.`);
    }

    // Convert file to array buffer
    let arrayBuffer = await file.arrayBuffer();
    let processedArrayBuffer = arrayBuffer;
    
    // Resize images over 2MB to prevent memory issues
    const targetSize = 2 * 1024 * 1024;
    if (isImage && arrayBuffer.byteLength > targetSize) {
      console.log(`File is ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB, resizing...`);
      
      try {
        // Decode image
        const image = await Image.decode(new Uint8Array(arrayBuffer));
        
        // More aggressive size reduction for large files
        const maxDimension = arrayBuffer.byteLength > 5 * 1024 * 1024 ? 1200 : 1500;
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
        
        // More aggressive compression for large files
        const quality = arrayBuffer.byteLength > 5 * 1024 * 1024 ? 65 : 75;
        const encoded = await resized.encodeJPEG(quality);
        processedArrayBuffer = encoded.buffer;
        
        console.log(`Resized from ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB to ${(processedArrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
        
        // If still too large after compression, reject it
        if (processedArrayBuffer.byteLength > 8 * 1024 * 1024) {
          throw new Error(`File still too large after compression (${(processedArrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB). Please use a smaller image.`);
        }
      } catch (resizeError) {
        console.error(`Failed to resize:`, resizeError);
        // If resize fails and file is large, reject it
        if (arrayBuffer.byteLength > 5 * 1024 * 1024) {
          throw new Error(`Cannot process file: ${resizeError.message || 'Memory limit exceeded'}. Please use a smaller image (under 5MB).`);
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
    
    // Create signature - resource type is implied by the endpoint URL, don't include in signature
    const encoder = new TextEncoder();
    const signatureParams = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const data = encoder.encode(signatureParams);
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

    // Upload to Cloudinary - use appropriate endpoint
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    
    console.log(`Uploading to Cloudinary: ${uploadUrl}`);
    
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: uploadData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        resourceType: resourceType,
        uploadUrl: uploadUrl
      });
      throw new Error(`Cloudinary upload failed (${response.status}): ${errorText}`);
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
