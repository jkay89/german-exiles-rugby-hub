
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
