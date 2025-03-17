
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');
  
  // Function to get translated text
  const t = (key: string): string => {
    // If translations[language][key] doesn't exist, return the key itself
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translations object
const translations = {
  en: {
    // Navigation
    "home": "Home",
    "about": "About Us",
    "fixtures": "Fixtures",
    "news": "News",
    "nrld": "NRLD",
    "sponsors": "Sponsors",
    "contact": "Contact",
    "teams": "Teams",
    "heritage_team": "Heritage Team",
    "community_team": "Community Team",
    "staff": "Staff",
    
    // Home page
    "hero_title": "German Exiles Rugby League",
    "hero_subtitle": "Bridging German talent worldwide through Rugby League excellence",
    "our_mission": "Our Mission",
    "mission_text": "German Exiles Rugby League serves as a pathway for German-eligible players based in the UK to represent their heritage. We're committed to growing Rugby League in Germany while providing opportunities for players to compete at an international level.",
    
    // NRLD page
    "nrld_title": "National Rugby League Deutschland",
    "nrld_description": "The NRLD is the governing body for Rugby League in Germany, dedicated to growing and developing the sport across the country. Working alongside international partners, we aim to establish Rugby League as a prominent sport in German sporting culture.",
    "upcoming_fixtures": "Upcoming Fixtures",
    "fixtures_announced_soon": "Fixtures will be announced soon. Check back later for updates.",
    "competitions": "Competitions",
    "competitions_text": "We organize and oversee various competitions including the German Rugby League Bundesliga, international fixtures, and youth development tournaments. These competitions provide crucial playing opportunities for athletes at all levels.",
    "development_programs": "Development Programs",
    "development_text": "Our development programs focus on player pathways, coach education, and referee development. We work closely with clubs and regions to ensure sustainable growth of the sport.",
    "future_vision": "Future Vision",
    "future_text": "The NRLD is committed to establishing Germany as a competitive nation in international Rugby League, with aims to participate in major tournaments and develop a strong domestic competition structure.",
    
    // Fixtures page
    "fixtures_results": "Fixtures & Results",
    "fixtures_description": "View our upcoming games, past results, and player statistics",
    "match_results": "Match Results",
    "no_results_yet": "No Results Yet",
    "no_matches_text": "The German Exiles haven't played any official matches yet. Stay tuned for our upcoming fixtures!",
    "player_stats": "Player Statistics",
    
    // News page
    "latest_news": "Latest News",
    "coming_soon": "Coming Soon",
    "news_coming_soon": "Stay tuned for the latest news and updates about German Exiles Rugby League.",
    
    // Sponsors page
    "platinum_sponsor": "Platinum Sponsor",
    "gold_sponsor": "Gold Sponsor",
    "silver_sponsors": "Silver Sponsors",
    "affiliate_sponsors": "Affiliate Sponsors",
    "become_sponsor": "Become a Sponsor",
    "sponsor_message": "Join us in supporting the development of Rugby League in Germany. Contact us to learn more about our sponsorship opportunities.",
    "contact_sponsorship": "Contact for Sponsorship",
    "visit_website": "Visit Website",
    
    // Common sections
    "next_fixture": "Next Fixture",
    "latest_result": "Latest Result",
    "no_upcoming_fixtures": "No upcoming fixtures",
    "view_fixture_schedule": "View fixture schedule",
    "view_all_fixtures": "View all fixtures",
    "check_back": "Check back for our latest matches",
    "player_highlights": "Player highlights and statistics",
    "season_starting_soon": "Season starting soon!",
    "become_part": "Become part of our growing team",
    "match_results_soon": "Match results coming soon!",
    "join_us": "Join Us",
    
    // About page
    "about_title": "About German Exiles RL",
    "about_description": "The German Exiles Rugby League serves as a vital bridge between heritage players and the German national rugby league system. Our mission is to identify, develop, and nurture talent while strengthening the foundations of rugby league in Germany. Through our comprehensive approach to player development, networking, and community building, we aim to contribute significantly to the growth and success of German Rugby League on both domestic and international stages.",
    "competitive_pathway": "Competitive Pathway",
    "competitive_pathway_text": "Providing opportunities for eligible non-professional heritage players & upcoming youth players (16+) to enter the German RL national setup",
    "bundesleague_development": "Bundesleague Development",
    "bundesleague_development_text": "Supporting and strengthening the German Bundesleague setup through collaboration and resource sharing",
    "networking_opportunities": "Networking Opportunities",
    "networking_opportunities_text": "Creating connections for eligible non-professional heritage players into semi & professional setups",
    "skill_development": "Skill Development",
    "skill_development_text": "Developing basic RL skills while fostering connections across Europe to promote rugby league and our sponsors' interests",
    
    // Team pages
    "heritage_team_title": "Heritage Team",
    "heritage_team_description": "Meet the players representing German Exiles Rugby League. Our heritage team consists of German-eligible players based in the UK, all committed to growing the sport in Germany.",
    "community_team_title": "Community Team",
    "community_team_description": "Our community team represents the growing rugby league community in Walton, Wakefield, with players from around the local area backed up with our Heritage players flying the flag of German Rugby League here in the UK. This page will be updated with player profiles soon.",
    "staff_title": "Staff",
    "staff_description": "Meet the dedicated staff members who work behind the scenes to support and develop German Exiles Rugby League.",
    "heritage": "Heritage",
    "german": "German",
    "british": "British",
    
    // Contact page
    "contact_title": "Contact Us",
    "contact_description": "Get in touch with German Exiles Rugby League",
    "send_message": "Send us a message",
    "name": "Name",
    "email": "Email",
    "message": "Message",
    "send_button": "Send Message",
    "connect_with_us": "Connect with us",
    "social_media": "Social Media",
    "message_sent": "Message Sent",
    "message_sent_description": "We'll get back to you as soon as possible."
  },
  de: {
    // Navigation
    "home": "Startseite",
    "about": "Über Uns",
    "fixtures": "Spielplan",
    "news": "Neuigkeiten",
    "nrld": "NRLD",
    "sponsors": "Sponsoren",
    "contact": "Kontakt",
    "teams": "Teams",
    "heritage_team": "Heritage-Team",
    "community_team": "Community-Team",
    "staff": "Mitarbeiter",
    
    // Home page
    "hero_title": "German Exiles Rugby League",
    "hero_subtitle": "Verbindung deutscher Talente weltweit durch Rugby League Exzellenz",
    "our_mission": "Unsere Mission",
    "mission_text": "German Exiles Rugby League dient als Weg für deutsche Spieler in Großbritannien, ihr Erbe zu vertreten. Wir setzen uns für das Wachstum von Rugby League in Deutschland ein und bieten Spielern die Möglichkeit, auf internationaler Ebene zu konkurrieren.",
    
    // NRLD page
    "nrld_title": "National Rugby League Deutschland",
    "nrld_description": "Die NRLD ist der Dachverband für Rugby League in Deutschland und widmet sich dem Wachstum und der Entwicklung des Sports im ganzen Land. In Zusammenarbeit mit internationalen Partnern wollen wir Rugby League als prominenten Sport in der deutschen Sportkultur etablieren.",
    "upcoming_fixtures": "Kommende Spiele",
    "fixtures_announced_soon": "Spielpläne werden in Kürze bekannt gegeben. Schauen Sie später für Updates vorbei.",
    "competitions": "Wettbewerbe",
    "competitions_text": "Wir organisieren und überwachen verschiedene Wettbewerbe, darunter die German Rugby League Bundesliga, internationale Spiele und Jugendentwicklungsturniere. Diese Wettbewerbe bieten wichtige Spielmöglichkeiten für Athleten aller Leistungsstufen.",
    "development_programs": "Entwicklungsprogramme",
    "development_text": "Unsere Entwicklungsprogramme konzentrieren sich auf Spielerwege, Trainerausbildung und Schiedsrichterentwicklung. Wir arbeiten eng mit Vereinen und Regionen zusammen, um ein nachhaltiges Wachstum des Sports zu gewährleisten.",
    "future_vision": "Zukunftsvision",
    "future_text": "Die NRLD ist bestrebt, Deutschland als wettbewerbsfähige Nation im internationalen Rugby League zu etablieren, mit dem Ziel, an großen Turnieren teilzunehmen und eine starke inländische Wettbewerbsstruktur zu entwickeln.",
    
    // Fixtures page
    "fixtures_results": "Spielplan & Ergebnisse",
    "fixtures_description": "Sehen Sie unsere kommenden Spiele, vergangene Ergebnisse und Spielerstatistiken",
    "match_results": "Spielergebnisse",
    "no_results_yet": "Noch keine Ergebnisse",
    "no_matches_text": "Die German Exiles haben noch keine offiziellen Spiele absolviert. Bleiben Sie dran für unsere kommenden Spiele!",
    "player_stats": "Spielerstatistiken",
    
    // News page
    "latest_news": "Neueste Nachrichten",
    "coming_soon": "Demnächst verfügbar",
    "news_coming_soon": "Bleiben Sie auf dem Laufenden für die neuesten Nachrichten und Updates über German Exiles Rugby League.",
    
    // Sponsors page
    "platinum_sponsor": "Platin-Sponsor",
    "gold_sponsor": "Gold-Sponsor",
    "silver_sponsors": "Silber-Sponsoren",
    "affiliate_sponsors": "Partner-Sponsoren",
    "become_sponsor": "Werden Sie Sponsor",
    "sponsor_message": "Unterstützen Sie die Entwicklung von Rugby League in Deutschland. Kontaktieren Sie uns, um mehr über unsere Sponsoring-Möglichkeiten zu erfahren.",
    "contact_sponsorship": "Kontakt für Sponsoring",
    "visit_website": "Website besuchen",
    
    // Common sections
    "next_fixture": "Nächstes Spiel",
    "latest_result": "Neuestes Ergebnis",
    "no_upcoming_fixtures": "Keine anstehenden Spiele",
    "view_fixture_schedule": "Spielplan anzeigen",
    "view_all_fixtures": "Alle Spiele anzeigen",
    "check_back": "Schauen Sie nach unseren neuesten Spielen",
    "player_highlights": "Spieler-Highlights und Statistiken",
    "season_starting_soon": "Saison beginnt bald!",
    "become_part": "Werden Sie Teil unseres wachsenden Teams",
    "match_results_soon": "Spielergebnisse kommen bald!",
    "join_us": "Mach Mit",
    
    // About page
    "about_title": "Über German Exiles RL",
    "about_description": "Die German Exiles Rugby League dient als wichtige Brücke zwischen Heritage-Spielern und dem deutschen Rugby-League-Nationalsystem. Unsere Mission ist es, Talente zu identifizieren, zu entwickeln und zu fördern und gleichzeitig die Grundlagen des Rugby League in Deutschland zu stärken. Durch unseren umfassenden Ansatz zur Spielerentwicklung, Vernetzung und Gemeinschaftsbildung wollen wir wesentlich zum Wachstum und Erfolg der deutschen Rugby League auf nationaler und internationaler Ebene beitragen.",
    "competitive_pathway": "Wettbewerbsweg",
    "competitive_pathway_text": "Bietet berechtigten nicht-professionellen Heritage-Spielern und aufstrebenden Jugendspielern (16+) die Möglichkeit, in die deutsche RL-Nationalmannschaft einzusteigen",
    "bundesleague_development": "Bundesliga-Entwicklung",
    "bundesleague_development_text": "Unterstützung und Stärkung der deutschen Bundesliga durch Zusammenarbeit und Ressourcenteilung",
    "networking_opportunities": "Vernetzungsmöglichkeiten",
    "networking_opportunities_text": "Schaffung von Verbindungen für berechtigte nicht-professionelle Heritage-Spieler in halb- und professionelle Aufstellungen",
    "skill_development": "Kompetenzentwicklung",
    "skill_development_text": "Entwicklung grundlegender RL-Fähigkeiten bei gleichzeitiger Förderung von Verbindungen in ganz Europa zur Förderung des Rugby League und der Interessen unserer Sponsoren",
    
    // Team pages
    "heritage_team_title": "Heritage-Team",
    "heritage_team_description": "Treffen Sie die Spieler, die German Exiles Rugby League vertreten. Unser Heritage-Team besteht aus deutschen Spielern mit Spielberechtigung in Großbritannien, die sich alle für die Entwicklung des Sports in Deutschland einsetzen.",
    "community_team_title": "Community-Team",
    "community_team_description": "Unser Community-Team repräsentiert die wachsende Rugby-League-Gemeinschaft in Walton, Wakefield, mit Spielern aus der Umgebung, unterstützt von unseren Heritage-Spielern, die die Flagge der German Rugby League hier in Großbritannien hochhalten. Diese Seite wird bald mit Spielerprofilen aktualisiert.",
    "staff_title": "Mitarbeiter",
    "staff_description": "Lernen Sie die engagierten Mitarbeiter kennen, die hinter den Kulissen arbeiten, um German Exiles Rugby League zu unterstützen und zu entwickeln.",
    "heritage": "Heritage",
    "german": "Deutsch",
    "british": "Britisch",
    
    // Contact page
    "contact_title": "Kontaktieren Sie uns",
    "contact_description": "Nehmen Sie Kontakt mit German Exiles Rugby League auf",
    "send_message": "Senden Sie uns eine Nachricht",
    "name": "Name",
    "email": "E-Mail",
    "message": "Nachricht",
    "send_button": "Nachricht senden",
    "connect_with_us": "Verbinden Sie sich mit uns",
    "social_media": "Soziale Medien",
    "message_sent": "Nachricht gesendet",
    "message_sent_description": "Wir werden uns so schnell wie möglich bei Ihnen melden."
  }
};
