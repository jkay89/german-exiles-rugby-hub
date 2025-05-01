
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

// Upload function that uses direct admin access to bypass RLS
export async function uploadNewsImage(file: File) {
  try {
    console.log(`Uploading file ${file.name} to news bucket...`);
    
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `news_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Additional logging to debug the upload process
    console.log(`Generated filename: ${fileName}`);
    console.log(`File type: ${file.type}`);
    console.log(`File size: ${file.size} bytes`);
    
    // First make sure we're authenticated (the client is signed in as admin)
    const { data: sessionData } = await supabase.auth.getSession();
    console.log(`Auth session status: ${sessionData?.session ? 'Active' : 'No active session'}`);
    
    if (!sessionData?.session) {
      console.error("No active session, please sign in first");
      throw new Error("Authentication required");
    }
    
    // Upload directly to the bucket - no need for the public/ path prefix as we're 
    // relying on the bucket's public access setting
    const { data, error } = await supabase.storage
      .from('news')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });
    
    if (error) {
      console.error(`Error uploading file:`, error);
      throw error;
    }
    
    console.log(`File uploaded successfully: ${fileName}`);
    
    // Get public URL - no need for public/ prefix in the path
    const { data: urlData } = supabase.storage
      .from('news')
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
