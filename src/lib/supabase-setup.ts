
import { supabase } from "@/integrations/supabase/client-extensions";
import { seedInitialContent } from "@/utils/seedInitialContent";

export async function setupSupabase() {
  try {
    console.log('Setting up Supabase...');
    
    // Seed initial content
    await seedInitialContent();

    console.log('Supabase setup completed successfully');
  } catch (error) {
    console.error('Error setting up Supabase:', error);
  }
}
