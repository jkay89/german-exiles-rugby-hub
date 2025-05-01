
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

// Function to upload image for news
export async function uploadNewsImage(file: File) {
  try {
    // First check if the bucket exists, if not try to create it
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('news');
    
    if (bucketError && bucketError.message.includes('not found')) {
      console.log("News bucket not found, attempting to create it...");
      const { error: createError } = await supabase.storage.createBucket('news', {
        public: true,
        fileSizeLimit: 50000000, // 50MB
      });
      
      if (createError) {
        console.error("Error creating news bucket:", createError);
        throw new Error(`Failed to create news bucket: ${createError.message}`);
      }
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('news')
      .upload(filePath, file);
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('news')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading news image:", error);
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
