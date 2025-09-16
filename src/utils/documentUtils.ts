import { supabase } from "@/integrations/supabase/client";

export interface Document {
  id: string;
  title: string;
  description?: string | null;
  file_url: string;
  file_type: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export const fetchDocuments = async (): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }

  return data || [];
};

export const createDocument = async (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document> => {
  const { data, error } = await supabase
    .from('documents')
    .insert([document])
    .select()
    .single();

  if (error) {
    console.error('Error creating document:', error);
    throw error;
  }

  return data;
};

export const updateDocument = async (id: string, document: Partial<Document>): Promise<Document> => {
  const { data, error } = await supabase
    .from('documents')
    .update(document)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating document:', error);
    throw error;
  }

  return data;
};

export const deleteDocument = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};