
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
      date: "2025-09-06",
      opponent: "German Domestic XIII",
      location: "Munich, Germany",
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
