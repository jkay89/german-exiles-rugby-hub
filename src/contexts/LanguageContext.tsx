
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
    "upcoming_fixtures": "Upcoming Fixtures",
    "fixtures_announced_soon": "Fixtures will be announced soon. Check back later for updates.",
    
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
    "upcoming_fixtures": "Kommende Spiele",
    "fixtures_announced_soon": "Spielpläne werden in Kürze bekannt gegeben. Schauen Sie später für Updates vorbei.",
    
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
  }
};
