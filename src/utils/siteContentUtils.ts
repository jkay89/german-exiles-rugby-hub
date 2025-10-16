import { supabase } from "@/integrations/supabase/client";

export interface SiteContent {
  id: string;
  section_key: string;
  section_label: string;
  page: string;
  content_type: string;
  content_value: string | null;
  published_value: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SitePage {
  id: string;
  page_key: string;
  page_title: string;
  page_path: string;
  template: string;
  is_active: boolean;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch all content for a specific page
export const fetchPageContent = async (page: string): Promise<SiteContent[]> => {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('page', page)
    .order('display_order');

  if (error) {
    console.error('Error fetching page content:', error);
    return [];
  }

  return data || [];
};

// Fetch published content for display
export const fetchPublishedContent = async (page: string): Promise<Record<string, string>> => {
  const { data, error } = await supabase
    .from('site_content')
    .select('section_key, published_value')
    .eq('page', page)
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching published content:', error);
    return {};
  }

  const contentMap: Record<string, string> = {};
  data?.forEach(item => {
    contentMap[item.section_key] = item.published_value || '';
  });

  return contentMap;
};

// Update content (draft)
export const updateContent = async (
  id: string,
  contentValue: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('site_content')
    .update({ 
      content_value: contentValue,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating content:', error);
    throw error;
  }

  return true;
};

// Publish content (make draft live)
export const publishContent = async (id: string): Promise<boolean> => {
  // First get the current draft value
  const { data: content, error: fetchError } = await supabase
    .from('site_content')
    .select('content_value')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching content:', fetchError);
    throw fetchError;
  }

  // Update published value with draft value
  const { error } = await supabase
    .from('site_content')
    .update({ 
      published_value: content.content_value,
      is_published: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error publishing content:', error);
    throw error;
  }

  return true;
};

// Publish all content for a page
export const publishAllPageContent = async (page: string): Promise<boolean> => {
  const { data: contents } = await supabase
    .from('site_content')
    .select('id, content_value')
    .eq('page', page);

  if (contents) {
    for (const content of contents) {
      await supabase
        .from('site_content')
        .update({ 
          published_value: content.content_value,
          is_published: true 
        })
        .eq('id', content.id);
    }
  }

  return true;
};

// Create new content section
export const createContentSection = async (
  data: Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>
): Promise<SiteContent> => {
  const { data: newContent, error } = await supabase
    .from('site_content')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Error creating content section:', error);
    throw error;
  }

  return newContent;
};

// Delete content section
export const deleteContentSection = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('site_content')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting content section:', error);
    throw error;
  }

  return true;
};

// Upload image for content
export const uploadContentImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `content/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
