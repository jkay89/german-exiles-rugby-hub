
import { supabase } from "@/integrations/supabase/client-extensions";

// Define interfaces for our news types
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// Function to fetch news articles
export async function fetchNewsArticles() {
  try {
    const { data, error } = await supabase.rest
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as NewsArticle[];
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return [];
  }
}

// Function to fetch a single news article
export async function fetchNewsArticle(id: string) {
  try {
    const { data, error } = await supabase.rest
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as NewsArticle;
  } catch (error) {
    console.error("Error fetching news article:", error);
    return null;
  }
}

// Improved function to upload image for news with better bucket handling
export async function uploadNewsImage(file: File) {
  const bucketName = 'news';
  
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
    console.error("Error in uploadNewsImage:", error);
    throw error;
  }
}

// Function to create a news article
export async function createNewsArticle(articleData: {
  title: string;
  summary: string;
  content: string;
  image_url?: string;
}) {
  try {
    const { data, error } = await supabase.rest
      .from('news')
      .insert([articleData])
      .select();
    
    if (error) throw error;
    return data[0] as NewsArticle;
  } catch (error) {
    console.error("Error creating news article:", error);
    throw error;
  }
}

// Function to update a news article
export async function updateNewsArticle(id: string, articleData: {
  title: string;
  summary: string;
  content: string;
  image_url?: string;
  updated_at: string;
}) {
  try {
    const { error } = await supabase.rest
      .from('news')
      .update(articleData)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating news article:", error);
    throw error;
  }
}

// Function to delete a news article
export async function deleteNewsArticle(id: string) {
  try {
    const { error } = await supabase.rest
      .from('news')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting news article:", error);
    throw error;
  }
}
