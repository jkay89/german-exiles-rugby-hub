import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Trophy, Calendar, Settings } from "lucide-react";

export const DrawTabNavigation = () => {
  const location = useLocation();

  const tabs = [
    { path: "/lottery", label: "Play", icon: Trophy },
    { path: "/lottery/draw", label: "The Draw", icon: Play },
    { path: "/lottery/terms", label: "Terms", icon: Settings },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 p-4 bg-gray-900 border-b border-gray-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;
        
        return (
          <Button
            key={tab.path}
            asChild
            variant={isActive ? "default" : "outline"}
            className={`${
              isActive 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Link to={tab.path} className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {tab.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
};