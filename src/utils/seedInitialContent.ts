
import { supabase } from "@/integrations/supabase/client-extensions";

// Sample news article content
const newsArticles = [
  {
    title: "German Exiles Win Local Derby",
    summary: "In a thrilling match, German Exiles RL secured a victory against their local rivals.",
    content: `<p>In a thrilling match that kept fans on the edge of their seats until the final whistle, German Exiles Rugby League secured an impressive victory against their local rivals this weekend.</p>
    <p>The team demonstrated excellent teamwork and strategy throughout the game, with standout performances from several key players. The victory marks an important milestone in the team's journey this season.</p>
    <p>Head Coach commented after the match, "I'm incredibly proud of the effort our players put in today. This win is the result of months of dedication and hard work in training."</p>`,
    image_url: null
  },
  {
    title: "New Player Signings Announced",
    summary: "German Exiles RL is excited to announce several new player additions to strengthen the squad.",
    content: `<p>German Exiles Rugby League is thrilled to announce the signing of several new talented players who will be joining the squad for the upcoming season.</p>
    <p>These strategic additions bring a wealth of experience and skill to the team, strengthening several key positions and adding depth to the squad. The new signings are expected to make an immediate impact as the team prepares for the challenging season ahead.</p>
    <p>Club Chairman said, "These signings represent our continued commitment to building a competitive team capable of challenging for honors. We're excited to welcome these players to our club family."</p>`,
    image_url: null
  },
  {
    title: "Community Outreach Program Launches",
    summary: "German Exiles RL launches new community initiative to promote rugby league in local schools.",
    content: `<p>German Exiles Rugby League is proud to announce the launch of a new community outreach program aimed at introducing rugby league to local schools and community centers.</p>
    <p>The initiative will involve team members visiting schools to conduct workshops and training sessions, sharing their passion for the sport with young people across the region. The program aims to promote physical activity, teamwork, and the core values of rugby league.</p>
    <p>Community Coordinator stated, "Rugby league has given so much to all of us, and this program is our way of giving back. We hope to inspire the next generation of players and supporters through this initiative."</p>`,
    image_url: null
  }
];

// Sample players data
const players = [
  {
    name: "Thomas Müller",
    number: 10,
    position: "Center",
    team: "heritage",
    heritage: "German",
    club: "Munich RL",
    bio: "Thomas has been playing rugby league for over 10 years and brings valuable experience to the team.",
    photo_url: null
  },
  {
    name: "Marcus Schmidt",
    number: 8,
    position: "Prop",
    team: "heritage",
    heritage: "German",
    club: "Berlin RL",
    bio: "Known for his powerful runs and solid defense, Marcus is a cornerstone of the forward pack.",
    photo_url: null
  },
  {
    name: "Jan Fischer",
    number: 7,
    position: "Halfback",
    team: "heritage",
    heritage: "German",
    club: "Hamburg RL",
    bio: "Jan's exceptional kicking game and vision make him a key playmaker for the team.",
    photo_url: null
  },
  {
    name: "James Wilson",
    number: 1,
    position: "Fullback",
    team: "community",
    heritage: "British",
    club: "London Exiles",
    bio: "James brings speed and agility to the backline, with a safe pair of hands under the high ball.",
    photo_url: null
  },
  {
    name: "Ryan O'Connor",
    number: 13,
    position: "Lock",
    team: "community",
    heritage: "Irish",
    club: "Dublin Raiders",
    bio: "Ryan's work rate and tackling ability make him an invaluable member of the forward pack.",
    photo_url: null
  }
];

// Sample media folders
const mediaFolders = [
  {
    title: "2024 Season Launch",
    description: "Photos from our 2024 season launch event",
    date: "2024-03-15",
    thumbnail_url: null
  },
  {
    title: "Heritage Team Training",
    description: "Training session with our Heritage team",
    date: "2024-04-10",
    thumbnail_url: null
  },
  {
    title: "Community Outreach Day",
    description: "Team members visiting local schools",
    date: "2024-04-22",
    thumbnail_url: null
  },
  {
    title: "Schlicht Exiles 9s - Rotterdam 2025",
    description: "Tournament photos from our recent competition in Rotterdam",
    date: "2025-04-22",
    thumbnail_url: null
  }
];

// Function to seed initial content
export async function seedInitialContent() {
  try {
    console.log("Checking for existing content...");
    
    // Check for news articles
    const { data: existingNews, error: newsError } = await supabase.rest.from('news').select('id');
    
    if (!newsError && (!existingNews || existingNews.length === 0)) {
      console.log("Creating news articles...");
      // Insert one by one to handle potential errors better
      for (const article of newsArticles) {
        await supabase.rest.from('news').insert([article]);
      }
    }
    
    // Check for players
    const { data: existingPlayers, error: playersError } = await supabase.rest.from('players').select('id');
    
    if (!playersError && (!existingPlayers || existingPlayers.length === 0)) {
      console.log("Creating players...");
      for (const player of players) {
        await supabase.rest.from('players').insert([player]);
      }
    }
    
    // Check for media folders
    const { data: existingMedia, error: mediaError } = await supabase.rest.from('media_folders').select('id');
    
    if (!mediaError && (!existingMedia || existingMedia.length === 0)) {
      console.log("Creating media folders...");
      for (const folder of mediaFolders) {
        await supabase.rest.from('media_folders').insert([folder]);
      }
    }
    
    // Seed sample media items for the Rotterdam folder if it exists
    const { data: rotterdamFolder } = await supabase.rest
      .from('media_folders')
      .select('id')
      .eq('title', 'Schlicht Exiles 9s - Rotterdam 2025')
      .maybeSingle();
    
    if (rotterdamFolder) {
      // First check if there are any existing items for this folder
      const { data: existingItems } = await supabase.rest
        .from('media_items')
        .select('id')
        .eq('folder_id', rotterdamFolder.id);
        
      if (!existingItems || existingItems.length === 0) {
        // Sample image URLs from the lovable uploads
        const sampleImages = [
          "/lovable-uploads/dc8c46be-81e9-4ddf-9b23-adc3f72d2989.png",
          "/lovable-uploads/2c677fd8-f43a-45a8-b0a1-491ba2d9eae4.png",
          "/lovable-uploads/9c438e26-41cf-42af-90d6-4797bbc5f8b0.png",
          "/lovable-uploads/dd1e1552-347d-4fc8-a19f-4f4e00b56168.png",
          "/lovable-uploads/5bf2f50a-6738-4cc5-804e-fb82f4d1634b.png",
          "/lovable-uploads/a2d09cab-2bb3-49ff-9913-9d7108a38278.png",
          "/lovable-uploads/b469f12d-4b0e-4ec7-a440-89ef8e502500.png"
        ];
        
        // Insert sample media items
        for (let i = 0; i < sampleImages.length; i++) {
          await supabase.rest.from('media_items').insert([{
            folder_id: rotterdamFolder.id,
            url: sampleImages[i],
            type: 'image',
            title: `Rotterdam Event - Image ${i + 1}`
          }]);
        }
        
        // Update thumbnail for the folder
        await supabase.rest
          .from('media_folders')
          .update({ thumbnail_url: sampleImages[0] })
          .eq('id', rotterdamFolder.id);
      }
    }
    
    console.log("Content seeding check completed");
  } catch (error) {
    console.error("Error checking/seeding initial content:", error);
  }
}
