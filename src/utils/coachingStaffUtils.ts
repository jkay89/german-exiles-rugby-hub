import { supabase } from "@/integrations/supabase/client";

export interface CoachingStaffMember {
  id: string;
  name: string;
  role: string;
  contact_email?: string | null;
  contact_number?: string | null;
  photo_url?: string | null;
  bio?: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchCoachingStaff = async (): Promise<CoachingStaffMember[]> => {
  const { data, error } = await supabase
    .from('coaching_staff')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching coaching staff:', error);
    throw error;
  }

  return data || [];
};

export const createCoachingStaffMember = async (member: Omit<CoachingStaffMember, 'id' | 'created_at' | 'updated_at'>): Promise<CoachingStaffMember> => {
  const { data, error } = await supabase
    .from('coaching_staff')
    .insert([member])
    .select()
    .single();

  if (error) {
    console.error('Error creating coaching staff member:', error);
    throw error;
  }

  return data;
};

export const updateCoachingStaffMember = async (id: string, member: Partial<CoachingStaffMember>): Promise<CoachingStaffMember> => {
  const { data, error } = await supabase
    .from('coaching_staff')
    .update(member)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating coaching staff member:', error);
    throw error;
  }

  return data;
};

export const deleteCoachingStaffMember = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('coaching_staff')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting coaching staff member:', error);
    throw error;
  }
};