
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

    // Seed initial content after buckets are created
    await seedInitialContent();

    console.log('Supabase setup completed successfully');
  } catch (error) {
    console.error('Error setting up Supabase:', error);
  }
}

async function createStorageBucket(id: string, name: string) {
  try {
    const { data, error } = await supabase.storage.getBucket(id);
    
    if (error && error.message.includes('The resource was not found')) {
      // Bucket doesn't exist, create it
      const { error: createError } = await supabase.storage.createBucket(id, {
        public: true,
        fileSizeLimit: 50000000, // 50MB
      });
      
      if (createError) {
        console.error(`Error creating bucket ${id}:`, createError);
      } else {
        console.log(`Created bucket: ${id}`);
      }
    } else if (error) {
      console.error(`Error checking bucket ${id}:`, error);
    } else {
      console.log(`Bucket exists: ${id}`);
    }
  } catch (error) {
    console.error(`Error with bucket ${id}:`, error);
  }
}
