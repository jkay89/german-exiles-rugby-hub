
import { supabase } from "@/integrations/supabase/client-extensions";

// Define interfaces for our media types
export interface MediaFolder {
  id: string;
  title: string;
  description?: string;
  date: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface MediaItem {
  id: string;
  folder_id: string;
  url: string;
  type: string;
  title?: string;
  created_at: string;
}

// Function to fetch media folders
export async function fetchMediaFolders() {
  try {
    const { data, error } = await supabase.rest
      .from('media_folders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as MediaFolder[];
  } catch (error) {
    console.error("Error fetching media folders:", error);
    return [];
  }
}

// Function to fetch media items by folder
export async function fetchMediaItems(folderId: string) {
  try {
    const { data, error } = await supabase.rest
      .from('media_items')
      .select('*')
      .eq('folder_id', folderId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as MediaItem[];
  } catch (error) {
    console.error("Error fetching media items:", error);
    return [];
  }
}

// Function to create a media folder
export async function createMediaFolder(folderData: {
  title: string;
  description?: string;
  date: string;
  thumbnail_url?: string;
}) {
  try {
    const { data, error } = await supabase.rest
      .from('media_folders')
      .insert([folderData])
      .select();
    
    if (error) throw error;
    return data[0] as MediaFolder;
  } catch (error) {
    console.error("Error creating media folder:", error);
    throw error;
  }
}

// Improved function to upload media file to storage with better bucket handling
export async function uploadMediaFile(file: File, bucketName: string = 'media') {
  try {
    console.log(`Starting upload to ${bucketName} bucket with file: ${file.name}`);
    
    // Force bucket creation regardless of check - this is a more aggressive approach
    console.log(`Ensuring ${bucketName} bucket exists...`);
    try {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 50000000, // 50MB
      });
      
      if (createError) {
        // Log error but continue - the bucket might already exist
        console.log(`Note: Couldn't create bucket '${bucketName}'. It might already exist: ${createError.message}`);
      } else {
        console.log(`Successfully created or confirmed bucket '${bucketName}'`);
      }
    } catch (err) {
      console.log(`Exception when creating bucket ${bucketName}:`, err);
      // Continue anyway - the bucket might exist
    }
    
    // Force bucket to be public
    try {
      const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
        public: true,
        fileSizeLimit: 50000000, // 50MB
      });
      
      if (updateError) {
        console.log(`Note: Couldn't update bucket '${bucketName}' settings: ${updateError.message}`);
      } else {
        console.log(`Successfully updated bucket '${bucketName}' to be public`);
      }
    } catch (err) {
      console.log(`Exception when updating bucket ${bucketName}:`, err);
      // Continue anyway
    }
    
    // Proceed with upload regardless of bucket creation/update success
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    console.log(`Attempting to upload file ${fileName} to ${bucketName}...`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
    
    if (error) {
      console.error(`Error uploading file to ${bucketName}:`, error);
      throw error;
    }
    
    console.log(`File uploaded successfully to ${bucketName}/${fileName}`);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    console.log(`Public URL generated: ${urlData.publicUrl}`);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadMediaFile:", error);
    throw error;
  }
}

// Function to update a media folder
export async function updateMediaFolder(id: string, folderData: {
  title: string;
  description?: string;
  date: string;
  thumbnail_url?: string;
}) {
  try {
    const { error } = await supabase.rest
      .from('media_folders')
      .update(folderData)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating media folder:", error);
    throw error;
  }
}

// Function to delete a media folder
export async function deleteMediaFolder(id: string) {
  try {
    // First delete all media items in this folder
    const { error: itemsDeleteError } = await supabase.rest
      .from('media_items')
      .delete()
      .eq('folder_id', id);
    
    if (itemsDeleteError) throw itemsDeleteError;
    
    // Then delete the folder
    const { error: folderDeleteError } = await supabase.rest
      .from('media_folders')
      .delete()
      .eq('id', id);
    
    if (folderDeleteError) throw folderDeleteError;
    
    return true;
  } catch (error) {
    console.error("Error deleting media folder:", error);
    throw error;
  }
}

// Function to create a media item
export async function createMediaItem(itemData: {
  folder_id: string;
  url: string;
  type: string;
  title?: string;
}) {
  try {
    const { error } = await supabase.rest
      .from('media_items')
      .insert([itemData])
      .select();
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error creating media item:", error);
    throw error;
  }
}

// Function to delete a media item
export async function deleteMediaItem(id: string) {
  try {
    const { error } = await supabase.rest
      .from('media_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting media item:", error);
    throw error;
  }
}
