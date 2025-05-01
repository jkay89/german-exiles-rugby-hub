
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
    // Try to use the RPC function first
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_media_folders');
      
      if (rpcError) throw rpcError;
      return rpcData as MediaFolder[];
    } catch (error) {
      // Fallback to raw REST API if RPC function doesn't exist
      const { data, error: restError } = await supabase.rest
        .from('media_folders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (restError) throw restError;
      return data as MediaFolder[];
    }
  } catch (error) {
    console.error("Error fetching media folders:", error);
    return [];
  }
}

// Function to fetch media items by folder
export async function fetchMediaItems(folderId: string) {
  try {
    // Try to use the RPC function first
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_media_items', { folder_id_param: folderId });
      
      if (rpcError) throw rpcError;
      return rpcData as MediaItem[];
    } catch (error) {
      // Fallback to raw REST API if RPC function doesn't exist
      const { data, error: restError } = await supabase.rest
        .from('media_items')
        .select('*')
        .eq('folder_id', folderId)
        .order('created_at', { ascending: true });
      
      if (restError) throw restError;
      return data as MediaItem[];
    }
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
      .insert([itemData]);
    
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
