
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy } from "lucide-react";
import { NavigateFunction } from "react-router-dom";
import { FixtureTabType } from "@/hooks/useFixtures";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton = ({ active, onClick, icon, label }: TabButtonProps) => (
  <Button
    variant={active ? "default" : "ghost"}
    onClick={onClick}
    className={`h-9 rounded-md px-3 ${active ? "bg-german-gold text-black" : "text-white"}`}
  >
    {icon}
    {label}
  </Button>
);

interface FixtureTabsProps {
  activeTab: FixtureTabType;
  setActiveTab: (tab: FixtureTabType) => void;
  navigate: NavigateFunction;
}

const FixtureTabs = ({ activeTab, setActiveTab, navigate }: FixtureTabsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="inline-flex items-center space-x-2 rounded-md bg-gray-800 p-1">
        <TabButton 
          active={activeTab === "upcoming"} 
          onClick={() => setActiveTab("upcoming")} 
          icon={<Calendar className="w-4 h-4 mr-2" />} 
          label="Upcoming"
        />
        <TabButton 
          active={activeTab === "past"} 
          onClick={() => setActiveTab("past")} 
          icon={<Trophy className="w-4 h-4 mr-2" />} 
          label="Past"
        />
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
