import { supabase } from "@/integrations/supabase/client";

export const sponsorDescriptions: Record<string, string> = {
  'Safetech Innovations': 'Safetech Innovations is a global cybersecurity company dedicated to protecting organizations from cyber threats and providing cutting-edge security solutions. Founded by a team of professionals with extensive experience in information security.',
  'Golden Guard VPN': 'Providing secure VPN services for online privacy and security, protecting your digital footprint with cutting-edge encryption technology.',
  'Feet 1st Physiotherapy': 'Professional physiotherapy services helping you recover and perform at your best through expert treatment and rehabilitation.',
  'LogicI': 'Technology and innovation solutions provider, delivering intelligent systems and digital transformation services.',
  'Beau Bijou Design': 'Elegant jewelry and design services, creating beautiful bespoke pieces for every occasion.',
  'ForJosef': 'Proud supporter of German Exiles Rugby League, helping to build the future of the sport.',
  'Tudor Joinery Ltd': 'Professional joinery and carpentry services, crafting quality woodwork with traditional skills and modern techniques.',
  'In Memory of Paul Readman': 'Honoring the memory and legacy of Paul Readman, a valued member of the German Exiles community.',
  'Adams Decor': 'Quality decorating services for residential and commercial properties, bringing your vision to life.',
  'David Gray TV': 'Official media partner providing video content and coverage for German Exiles Rugby League events and matches.',
  'Elite Workforce Solutions': 'Professional recruitment services connecting talented individuals with leading employers.',
  'Wellness Hub': 'Your partner in health and wellness, offering comprehensive support for physical and mental wellbeing.',
  'Specialist Wind Services': 'Expert wind turbine services including maintenance, repair, and installation for renewable energy solutions.',
  'CMS Yorkshire Ltd': 'Construction management services delivering quality projects on time and within budget.',
  'Schlicht': 'Proud supporter of German Exiles Rugby League, investing in the growth and development of the sport.',
  'Maxamaze': 'Event planning and entertainment services creating unforgettable experiences for all occasions.',
  'Fellowes Farriery': 'Professional farrier services providing expert hoof care for horses across the region.',
  'White Hart Halstead': 'Traditional pub and restaurant serving quality food and drinks in a welcoming atmosphere.',
  'EMEA Channels': 'Channel management solutions helping businesses optimize their distribution and partnership strategies.',
  'Pronto Rugby': 'Rugby equipment and apparel provider, supplying quality gear for players and teams at all levels.',
};

export const populateSponsors = async () => {
  const sponsors = [
    { name: 'Safetech Innovations', logo_url: '/lovable-uploads/f79f5262-9a43-411e-85bf-4800b6fc4f3e.png', website_url: 'https://www.safetechinnovations.com', tier: 'platinum' },
    { name: 'Golden Guard VPN', logo_url: '/lovable-uploads/5dc48408-4d0a-448f-93fe-ee8f8babb02d.png', website_url: 'https://goldenguardvpn.com', tier: 'gold' },
    { name: 'Feet 1st Physiotherapy', logo_url: '/lovable-uploads/e7db2841-b98f-4200-b721-aa7e05d0aa97.png', website_url: null, tier: 'gold' },
    { name: 'LogicI', logo_url: '/lovable-uploads/024f0ade-065d-4049-8caf-ac7afe87606a.png', website_url: 'https://logic-i.co.uk/', tier: 'gold' },
    { name: 'Beau Bijou Design', logo_url: '/lovable-uploads/f46f89dd-c0de-4241-8bcb-893623c26c05.png', website_url: 'https://beaubijoudesign.com/', tier: 'silver' },
    { name: 'ForJosef', logo_url: '/lovable-uploads/86e094ab-21e7-4af4-8964-005499f0b682.png', website_url: null, tier: 'silver' },
    { name: 'Tudor Joinery Ltd', logo_url: '/lovable-uploads/8d54172b-b325-494c-89e9-032f9cad56a5.png', website_url: 'https://tudorjoinery.com/', tier: 'silver' },
    { name: 'In Memory of Paul Readman', logo_url: '/lovable-uploads/11121476-1703-48ad-800a-7b6b2a71c787.png', website_url: null, tier: 'silver' },
    { name: 'Adams Decor', logo_url: '/lovable-uploads/792d38c5-2df1-44a3-9961-07579b56c10a.png', website_url: null, tier: 'silver' },
    { name: 'David Gray TV', logo_url: '/lovable-uploads/16188376-5748-432a-abef-0098489ceeab.png', website_url: 'https://davidgray.tv/', tier: 'media' },
    { name: 'Elite Workforce Solutions', logo_url: '/lovable-uploads/3e949f9d-3ac2-457d-aef1-de9e847d7819.png', website_url: 'https://eliteworkforcesolutions.com', tier: 'affiliate' },
    { name: 'Wellness Hub', logo_url: '/lovable-uploads/035a87e1-0bf3-41af-b5da-8f1cb7bb505d.png', website_url: 'https://thewellnesshubonline.co.uk/', tier: 'affiliate' },
    { name: 'Specialist Wind Services', logo_url: '/lovable-uploads/65a024fb-0b0d-4198-9a6a-2d8c59564522.png', website_url: 'https://specialistwindservices.com', tier: 'affiliate' },
    { name: 'CMS Yorkshire Ltd', logo_url: '/lovable-uploads/4e1ee62c-2d2a-46ab-998d-a562b4f3cb94.png', website_url: 'tel:07795614724', tier: 'affiliate' },
    { name: 'Schlicht', logo_url: '/lovable-uploads/bb2145ba-aeb7-4eb0-a94d-d97384947ca3.png', website_url: null, tier: 'affiliate' },
    { name: 'Maxamaze', logo_url: '/lovable-uploads/7f7ce763-cdc0-470e-add5-e2f5a39c317b.png', website_url: 'https://maxamaze.com/en', tier: 'affiliate' },
    { name: 'Fellowes Farriery', logo_url: '/lovable-uploads/a7745d47-664b-422c-9554-85a26b65bcc7.png', website_url: 'https://fellowesfarriery.co.uk', tier: 'affiliate' },
    { name: 'White Hart Halstead', logo_url: '/lovable-uploads/4791d07f-a2e5-47bc-8c14-9efa1e7c3743.png', website_url: 'https://whitehartathalstead.co.uk', tier: 'affiliate' },
    { name: 'EMEA Channels', logo_url: '/lovable-uploads/74ff3e9a-e806-4964-9697-5c26462f1d56.png', website_url: 'https://emeachannels.com', tier: 'affiliate' },
    { name: 'Pronto Rugby', logo_url: '/lovable-uploads/82bb56c2-068c-4f65-bd30-ad7d4ff3a8c2.png', website_url: 'https://prontorugby.com', tier: 'affiliate' },
  ];

  const sponsorsWithDescriptions = sponsors.map(sponsor => ({
    ...sponsor,
    description: sponsorDescriptions[sponsor.name] || `${sponsor.name} - proud supporter of German Exiles Rugby League`,
  }));

  try {
    const { data, error } = await supabase
      .from('sponsors')
      .insert(sponsorsWithDescriptions)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error populating sponsors:', error);
    return { success: false, error };
  }
};
