
import { compareAsc } from "date-fns";

export interface PlayerStats {
  id: number;
  name: string;
  position: string;
  gamesPlayed: number;
  trysScored: number;
  pointsScored: number;
  yellowCards: number;
  redCards: number;
  manOfTheMatch: number;
  image?: string;
}

export interface MatchResult {
  date: string;
  opponent: string;
  location: string;
  homeScore?: number;
  awayScore?: number;
  isHome: boolean;
}

// Sample player statistics data
export const getPlayerStats = (): PlayerStats[] => {
  return [
    {
      id: 1,
      name: "Chris Ruettel",
      position: "Forward",
      gamesPlayed: 3,
      trysScored: 2,
      pointsScored: 8,
      yellowCards: 0,
      redCards: 0,
      manOfTheMatch: 1,
    },
    {
      id: 2,
      name: "Matt King",
      position: "Centre",
      gamesPlayed: 4,
      trysScored: 3,
      pointsScored: 12,
      yellowCards: 1,
      redCards: 0,
      manOfTheMatch: 0,
    },
    {
      id: 3,
      name: "Jack Smith",
      position: "Half-Back",
      gamesPlayed: 4,
      trysScored: 0,
      pointsScored: 4,
      yellowCards: 0,
      redCards: 0,
      manOfTheMatch: 0,
    },
    {
      id: 4,
      name: "Mark Evans",
      position: "Winger",
      gamesPlayed: 2,
      trysScored: 4,
      pointsScored: 16,
      yellowCards: 0,
      redCards: 0,
      manOfTheMatch: 2,
    },
    {
      id: 5,
      name: "Thomas Müller",
      position: "Prop",
      gamesPlayed: 4,
      trysScored: 1,
      pointsScored: 4,
      yellowCards: 2,
      redCards: 0,
      manOfTheMatch: 0,
    },
  ];
};

// Empty match results data since the German Exiles don't have any results yet
export const getMatchResults = (): MatchResult[] => {
  return [];
};
