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
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const { data, error } = await supabase.functions.invoke("upload-to-cloudinary", {
      body: formData,
    });

    if (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    if (!data || !data.url) {
      throw new Error("Invalid response from upload function");
    }

    return data as CloudinaryUploadResult;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
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
