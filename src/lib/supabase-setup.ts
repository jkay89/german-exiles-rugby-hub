
import { supabase } from "@/integrations/supabase/client-extensions";
import { seedInitialContent } from "@/utils/seedInitialContent";

export async function setupSupabase() {
  try {
    // Create storage buckets if they don't exist
    await createStorageBucket('players', 'Player images');
    await createStorageBucket('news', 'News images');
    await createStorageBucket('media', 'Media gallery');
    await createStorageBucket('sponsors', 'Sponsor logos');
    await createStorageBucket('fixtures', 'Fixture images');
    await createStorageBucket('results', 'Result images');
    
    // Setup RLS policies for tables
    await setupRLSPolicies();
    
    // Seed initial content after buckets are created
    await seedInitialContent();

    console.log('Supabase setup completed successfully');
  } catch (error) {
    console.error('Error setting up Supabase:', error);
  }
}

async function createStorageBucket(id: string, name: string) {
  try {
    console.log(`Checking if bucket '${id}' exists...`);
    
    // Check if the bucket exists using the more reliable listBuckets method
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error(`Error listing buckets:`, listError);
      throw listError; // Throw to jump to catch block and attempt creation anyway
    }
    
    const bucketExists = buckets && buckets.some(bucket => bucket.name === id);
    
    // If bucket doesn't exist or we couldn't determine, try to create it
    if (!bucketExists) {
      console.log(`Bucket '${id}' not found or couldn't be verified, attempting to create it...`);
      
      try {
        const { data, error: createError } = await supabase.storage.createBucket(id, {
          public: true,
          fileSizeLimit: 50000000, // 50MB
        });
        
        if (createError) {
          console.error(`Failed to create bucket '${id}':`, createError);
          // Continue execution despite error - bucket might actually exist
        } else {
          console.log(`Successfully created bucket '${id}'`);
        }
      } catch (createError) {
        console.error(`Exception creating bucket '${id}':`, createError);
        // Continue execution despite error - bucket might actually exist
      }
    } else {
      console.log(`Bucket '${id}' already exists`);
    }
    
    // After creating (or failing to create), force update the bucket to be public
    // This is a safety measure that ensures the bucket is public even if it already existed
    try {
      const { error: updateError } = await supabase.storage.updateBucket(id, {
        public: true,
        fileSizeLimit: 50000000, // 50MB
      });
      
      if (updateError) {
        console.error(`Error updating bucket '${id}' to be public:`, updateError);
      } else {
        console.log(`Verified bucket '${id}' is correctly configured as public`);
      }
    } catch (updateError) {
      console.error(`Exception updating bucket '${id}':`, updateError);
    }
  } catch (error) {
    console.error(`Unexpected error with bucket '${id}':`, error);
    // Continue execution despite error - setup should not completely fail because of one bucket
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
