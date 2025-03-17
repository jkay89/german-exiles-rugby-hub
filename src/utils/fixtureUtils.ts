
import { compareAsc } from "date-fns";

export interface Fixture {
  date: string;
  opponent: string;
  location: string;
  time: string;
}

// Get all fixtures from the system
export const getFixtures = (): Fixture[] => {
  return [
    {
      date: "2025-04-19",
      opponent: "Rotterdam 9s",
      location: "Rotterdam, Netherlands",
      time: "TBC",
    },
    {
      date: "2025-06-06",
      opponent: "Aussie/Kiwi Exiles",
      location: "Wasps FC, Twyford Avenue Sports Ground, Twyford Ave, London W3 9QA",
      time: "TBC",
    },
    {
      date: "2025-08-23",
      opponent: "Royal Engineers RL",
      location: "Walton Sports Club, Walton Recreation Ground/Shay La WF2 6LA",
      time: "TBC",
    },
    {
      date: "2025-09-06",
      opponent: "Presidents XIII",
      location: "Würzburg, Bayern, Deutschland",
      time: "TBC",
    },
  ];
};

// Get the next upcoming fixture based on the current date
export const getNextFixture = (): Fixture | null => {
  const fixtures = getFixtures();
  const now = new Date();
  
  // Filter fixtures that haven't happened yet
  const upcomingFixtures = fixtures.filter(
    fixture => compareAsc(new Date(fixture.date), now) > 0
  );
  
  // Sort by date (ascending)
  upcomingFixtures.sort((a, b) => 
    compareAsc(new Date(a.date), new Date(b.date))
  );
  
  // Return the next fixture or null if none found
  return upcomingFixtures.length > 0 ? upcomingFixtures[0] : null;
};
