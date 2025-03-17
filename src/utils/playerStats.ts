
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

// Sample player statistics data with heritage team players (all with zero stats)
export const getPlayerStats = (): PlayerStats[] => {
  return [
    { id: 1, name: "Jay Kay", position: "Outside Backs", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0, image: "/lovable-uploads/7cdbd50d-8320-4db0-9303-53445bf0e348.png" },
    { id: 2, name: "Zak Bredin", position: "Centre", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0, image: "/lovable-uploads/2c677fd8-f43a-45a8-b0a1-491ba2d9eae4.png" },
    { id: 3, name: "Oliver Bowie", position: "Second Row", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 4, name: "Charlie Tetley", position: "Prop", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 5, name: "George Wood", position: "Centre", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 6, name: "Will Waring", position: "Second Row", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 7, name: "Anthony Hackman", position: "Prop", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 8, name: "Connor Hampson", position: "Prop", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 9, name: "Alex Land", position: "Prop", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 10, name: "Andy Hoggins", position: "Loose Forward", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 11, name: "Joe Wood", position: "Dummy Half", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 12, name: "Jamie Billsborough", position: "Hooker", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 13, name: "Brad Billsborough", position: "Half Back", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 14, name: "Ryan Hudson", position: "Prop", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 15, name: "Zach Burke", position: "Centre", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 16, name: "Eddie Briggs", position: "Second Row", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 17, name: "Eoin Bowie", position: "Second Row", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 18, name: "Joshua McConnell", position: "Loose Forward", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 19, name: "Ad Morley", position: "Centre", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 20, name: "Callum Corey", position: "Second Row", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 21, name: "Shaun Smith", position: "Centre", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 22, name: "Lewis Wilson", position: "Centre", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 23, name: "Michael MacDonald", position: "Half Back", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 24, name: "Arron Williams", position: "Second Row", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 25, name: "Jordan Williams", position: "Prop", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 26, name: "Louis Beattie", position: "Loose Forward", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 27, name: "Michael Knight", position: "Prop", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
    { id: 28, name: "James Adams", position: "Second Row", gamesPlayed: 0, trysScored: 0, pointsScored: 0, yellowCards: 0, redCards: 0, manOfTheMatch: 0 },
  ];
};

// Empty match results data since the German Exiles don't have any results yet
export const getMatchResults = (): MatchResult[] => {
  return [];
};
