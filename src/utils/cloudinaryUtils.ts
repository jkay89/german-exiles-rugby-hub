import { supabase } from "@/integrations/supabase/client";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload a file to Cloudinary via the edge function
 * @param file - The file to upload
 * @param folder - The folder in Cloudinary (default: "uploads")
 * @returns Promise with Cloudinary upload result
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = "uploads"
): Promise<CloudinaryUploadResult> => {
  try {
    console.log(`[Cloudinary] Preparing upload for ${file.name} (${file.type}, ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    console.log(`[Cloudinary] Invoking edge function...`);
    const { data, error } = await supabase.functions.invoke("upload-to-cloudinary", {
      body: formData,
    });

    if (error) {
      console.error("[Cloudinary] Edge function error:", {
        message: error.message,
        context: error.context,
        status: error.status,
        name: error.name
      });
      
      // Provide more specific error messages
      if (error.message?.includes('FunctionsRelayError') || error.message?.includes('FunctionsFetchError')) {
        throw new Error(`Upload service unavailable. Please check if Cloudinary is configured correctly.`);
      } else if (error.message?.includes('timeout')) {
        throw new Error(`Upload timeout. File may be too large or network is slow.`);
      } else {
        throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
      }
    }

    if (!data) {
      console.error("[Cloudinary] No data returned from edge function");
      throw new Error("No response from upload service");
    }

    if (!data.url) {
      console.error("[Cloudinary] Invalid response structure:", data);
      throw new Error(`Invalid response from upload service: ${data.error || 'No URL returned'}`);
    }

    console.log(`[Cloudinary] Upload successful: ${data.url}`);
    return data as CloudinaryUploadResult;
  } catch (error: any) {
    console.error("[Cloudinary] Upload error:", {
      message: error.message,
      stack: error.stack,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    throw error;
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param files - Array of files to upload
 * @param folder - The folder in Cloudinary (default: "uploads")
 * @returns Promise with array of Cloudinary upload results
 */
export const uploadMultipleToCloudinary = async (
  files: File[],
  folder: string = "uploads"
): Promise<CloudinaryUploadResult[]> => {
  const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
  return Promise.all(uploadPromises);
};

/**
 * Get Cloudinary image URL with transformations
 * @param publicId - The public ID of the image in Cloudinary
 * @param transformations - Transformation parameters (e.g., "w_500,h_500,c_fill")
 * @returns Transformed image URL
 */
export const getCloudinaryUrl = (
  publicId: string,
  transformations?: string
): string => {
  const cloudName = "your-cloud-name"; // This will be replaced dynamically
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
};
