
import { supabase } from "@/integrations/supabase/client";

export async function setupSupabase() {
  try {
    // Create storage buckets if they don't exist
    await createStorageBucket('players', 'Player images');
    await createStorageBucket('news', 'News images');
    await createStorageBucket('media', 'Media gallery');
    await createStorageBucket('sponsors', 'Sponsor logos');
    await createStorageBucket('fixtures', 'Fixture images');
    await createStorageBucket('results', 'Result images');

    // Create tables if they don't exist
    await createMediaTables();

    console.log('Supabase setup completed successfully');
  } catch (error) {
    console.error('Error setting up Supabase:', error);
  }
}

async function createStorageBucket(id: string, name: string) {
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
}

async function createMediaTables() {
  // Check if media_folders table exists
  const { error: folderError } = await supabase
    .from('media_folders')
    .select('id')
    .limit(1)
    .single();

  if (folderError && folderError.message.includes('relation "media_folders" does not exist')) {
    console.log('Creating media_folders and media_items tables...');
    
    // Create media_folders table
    const { error: createFoldersError } = await supabase.rpc('create_media_tables');
    
    if (createFoldersError) {
      console.error('Error creating media tables:', createFoldersError);
    } else {
      console.log('Media tables created successfully');
    }
  } else {
    console.log('Media tables already exist');
  }
}
