
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { FixtureTabType } from "@/hooks/useFixtures";

interface FixtureTabsProps {
  activeTab: FixtureTabType;
  setActiveTab: (tab: FixtureTabType) => void;
  navigate: NavigateFunction;
}

const FixtureTabs = ({ activeTab, setActiveTab, navigate }: FixtureTabsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="inline-flex items-center space-x-2 rounded-md bg-gray-800 p-1">
        <Button
          variant={activeTab === "upcoming" ? "default" : "ghost"}
          onClick={() => setActiveTab("upcoming")}
          className={`h-9 rounded-md px-3 ${activeTab === "upcoming" ? "bg-german-gold text-black" : "text-white"}`}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Upcoming
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "ghost"}
          onClick={() => setActiveTab("past")}
          className={`h-9 rounded-md px-3 ${activeTab === "past" ? "bg-german-gold text-black" : "text-white"}`}
        >
          <Trophy className="w-4 h-4 mr-2" />
          Past
        </Button>
      </div>
      
      <Button 
        variant="outline" 
        onClick={() => navigate('/')}
        className="border-german-red text-white hover:bg-german-red hover:text-white"
      >
        Back to Home
      </Button>
    </div>
  );
};

export default FixtureTabs;
