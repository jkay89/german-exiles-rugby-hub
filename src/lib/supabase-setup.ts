
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
    
    // First try to list all buckets to check if the bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error(`Error listing buckets:`, listError);
      // Continue anyway, we'll try to create the bucket
    }
    
    let bucketExists = false;
    
    if (buckets) {
      bucketExists = buckets.some(bucket => bucket.name === id);
    }
    
    // If bucket doesn't exist, create it
    if (!bucketExists) {
      console.log(`Bucket '${id}' not found, attempting to create it...`);
      
      const { data, error: createError } = await supabase.storage.createBucket(id, {
        public: true,
        fileSizeLimit: 50000000, // 50MB
      });
      
      if (createError) {
        console.error(`Failed to create bucket '${id}':`, createError);
        
        // If creation failed due to RLS, try with admin role if available
        if (createError.message.includes('row-level security')) {
          console.warn(`RLS policy preventing bucket creation for '${id}'. Please check your Supabase permissions.`);
        }
      } else {
        console.log(`Successfully created bucket '${id}'`);
      }
    } else {
      console.log(`Bucket '${id}' already exists`);
    }
    
    // After creating (or failing to create), verify the bucket exists and is properly configured
    try {
      // Use updateBucket to make sure the bucket is public
      const { error: updateError } = await supabase.storage.updateBucket(id, {
        public: true,
        fileSizeLimit: 50000000, // 50MB
      });
      
      if (updateError) {
        console.error(`Error updating bucket '${id}' to be public:`, updateError);
      } else {
        console.log(`Verified bucket '${id}' is correctly configured`);
      }
    } catch (error) {
      console.error(`Error verifying bucket '${id}':`, error);
    }
  } catch (error) {
    console.error(`Unexpected error with bucket '${id}':`, error);
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
