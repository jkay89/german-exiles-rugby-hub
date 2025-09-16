import { supabase } from "@/integrations/supabase/client";

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  contact_email?: string | null;
  contact_number?: string | null;
  photo_url?: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchCommitteeMembers = async (): Promise<CommitteeMember[]> => {
  const { data, error } = await supabase
    .from('committee_members')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching committee members:', error);
    throw error;
  }

  return data || [];
};

export const createCommitteeMember = async (member: Omit<CommitteeMember, 'id' | 'created_at' | 'updated_at'>): Promise<CommitteeMember> => {
  const { data, error } = await supabase
    .from('committee_members')
    .insert([member])
    .select()
    .single();

  if (error) {
    console.error('Error creating committee member:', error);
    throw error;
  }

  return data;
};

export const updateCommitteeMember = async (id: string, member: Partial<CommitteeMember>): Promise<CommitteeMember> => {
  const { data, error } = await supabase
    .from('committee_members')
    .update(member)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating committee member:', error);
    throw error;
  }

  return data;
};

export const deleteCommitteeMember = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('committee_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting committee member:', error);
    throw error;
  }
};