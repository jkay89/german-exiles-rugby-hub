import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
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
      throw new Error("Cloudinary credentials not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { bucket, table, urlColumn, idColumn, folder, batchSize = 5 } = await req.json();

    console.log(`Starting migration for bucket: ${bucket}, table: ${table}, batch size: ${batchSize}`);

    // Get all database records with their URLs
    const { data: dbRecords, error: dbError } = await supabase
      .from(table)
      .select(`${idColumn}, ${urlColumn}`);

    if (dbError) {
      console.error("Error fetching database records:", dbError);
      throw dbError;
    }

    console.log(`Found ${dbRecords?.length || 0} records in database`);

    // Build a map of filename -> record for matching
    const fileToRecord = new Map<string, any>();
    let alreadyMigratedCount = 0;
    
    if (dbRecords) {
      for (const record of dbRecords) {
        const url = record[urlColumn];
        if (url) {
          if (url.includes('cloudinary.com')) {
            // Already on Cloudinary
            alreadyMigratedCount++;
          } else if (url.includes(`/storage/v1/object/public/${bucket}/`)) {
            // Extract filename from Supabase storage URL
            const filename = url.split(`/storage/v1/object/public/${bucket}/`)[1];
            if (filename) {
              fileToRecord.set(filename, record);
            }
          }
        }
      }
    }

    console.log(`Records on Cloudinary: ${alreadyMigratedCount}, Records to migrate: ${fileToRecord.size}`);

    // List all files in the bucket
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list();

    if (listError) throw listError;

    console.log(`Found ${files?.length || 0} files in storage bucket`);

    // Filter to only files that have a matching database record and aren't migrated yet
    const unmigrated = (files || []).filter(file => fileToRecord.has(file.name));

    console.log(`Total files in bucket: ${files?.length}, Matched with DB: ${unmigrated.length}, Already on Cloudinary: ${alreadyMigratedCount}`);

    // Process only a small batch at a time (default 5 files max)
    const maxFilesPerRun = Math.min(batchSize, 5);
    const filesToProcess = unmigrated.slice(0, maxFilesPerRun);
    
    const results = {
      total: files?.length || 0,
      migrated: 0,
      failed: 0,
      skipped: 0,
      remaining: Math.max(0, unmigrated.length - maxFilesPerRun),
      alreadyMigrated: alreadyMigratedCount,
      errors: [] as any[],
    };

    console.log(`Processing ${filesToProcess.length} files (${results.remaining} remaining, ${results.alreadyMigrated} already done)`);

    // Process each file with strict size checking
    for (const file of filesToProcess) {
      try {
        // Skip if file size is too large (check metadata first)
        const fileSize = file.metadata?.size || 0;
        if (fileSize > 8 * 1024 * 1024) {
          console.log(`Skipping ${file.name} - ${(fileSize / 1024 / 1024).toFixed(2)}MB (too large)`);
          results.skipped++;
          results.errors.push({
            file: file.name,
            error: `File too large (${(fileSize / 1024 / 1024).toFixed(2)}MB) - resize manually`,
          });
          continue;
        }

        console.log(`Processing: ${file.name} (${(fileSize / 1024 / 1024).toFixed(2)}MB)`);
        
        // Download file from Supabase storage
        const { data: fileData, error: downloadError } = await supabase.storage
          .from(bucket)
          .download(file.name);

        if (downloadError) throw downloadError;

        const arrayBuffer = await fileData.arrayBuffer();
        let processedArrayBuffer = arrayBuffer;
        
        // Check file size - if over 3MB, resize it
        const targetSize = 3 * 1024 * 1024; // 3MB threshold
        if (arrayBuffer.byteLength > targetSize) {
          console.log(`File ${file.name} is ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB, resizing...`);
          
          try {
            // Decode image
            const image = await Image.decode(new Uint8Array(arrayBuffer));
            
            // More aggressive resizing - max 1200px
            const maxDimension = 1200;
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
            
            // Encode as JPEG with 70% quality for better compression
            const encoded = await resized.encodeJPEG(70);
            processedArrayBuffer = encoded.buffer;
            
            console.log(`Resized ${file.name} from ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB to ${(processedArrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB`);
            
            // Clear the original to free memory
            (arrayBuffer as any) = null;
          } catch (resizeError) {
            console.error(`Failed to resize ${file.name}:`, resizeError);
            results.failed++;
            results.errors.push({
              file: file.name,
              error: `Resize failed: ${resizeError.message}`,
            });
            continue;
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

        // Update database with new URL using the record ID
        const record = fileToRecord.get(file.name);
        if (record) {
          const { error: updateError } = await supabase
            .from(table)
            .update({ [urlColumn]: newUrl })
            .eq(idColumn, record[idColumn]);

          if (updateError) {
            console.error(`Failed to update database for ${file.name}:`, updateError);
          } else {
            console.log(`Updated database record ${record[idColumn]} with new URL`);
          }
        }

        results.migrated++;
        console.log(`Successfully migrated ${file.name}`);
        
        // Small delay between files to allow garbage collection
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error migrating ${file.name}:`, error);
        results.failed++;
        results.errors.push({
          file: file.name,
          error: error.message,
        });
        
        // Longer delay after errors
        await new Promise(resolve => setTimeout(resolve, 500));
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
