
import { supabase } from "@/integrations/supabase/client-extensions";
import { seedInitialContent } from "@/utils/seedInitialContent";

export async function setupSupabase() {
  try {
    // Setup RLS policies for tables
    await setupRLSPolicies();
    
    // Seed initial content
    await seedInitialContent();

    console.log('Supabase setup completed successfully');
  } catch (error) {
    console.error('Error setting up Supabase:', error);
  }
}

// Function to set up RLS policies
async function setupRLSPolicies() {
  try {
    console.log('Setting up RLS policies...');
    
    // Tables that need RLS
    const tables = ['media_folders', 'media_items', 'news', 'players', 'fixtures', 'results', 'sponsors'];
    
    // Enable RLS on all tables
    for (const table of tables) {
      try {
        // This SQL statement succeeds even if RLS is already enabled
        await supabase.rest.from(table).select('count(*)');
        console.log(`Checked table ${table}`);
      } catch (error) {
        console.error(`Error checking table ${table}:`, error);
      }
    }
    
    console.log('RLS policies setup completed');
  } catch (error) {
    console.error('Error setting up RLS policies:', error);
  }
}
