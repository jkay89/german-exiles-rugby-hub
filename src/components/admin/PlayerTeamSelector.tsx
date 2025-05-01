
import { Button } from "@/components/ui/button";

interface PlayerTeamSelectorProps {
  onSelectTeam: (team: string) => void;
}

const PlayerTeamSelector = ({ onSelectTeam }: PlayerTeamSelectorProps) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Add New Player</h2>
      <p className="text-gray-400 mb-4">Create a new player profile for Heritage Team, Community Team, or Exiles 9s.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          className="bg-german-red hover:bg-german-gold" 
          onClick={() => onSelectTeam("heritage")}
        >
          Add to Heritage Team
        </Button>
        <Button 
          className="bg-german-red hover:bg-german-gold"
          onClick={() => onSelectTeam("community")}
        >
          Add to Community Team
        </Button>
        <Button 
          className="bg-german-red hover:bg-german-gold"
          onClick={() => onSelectTeam("exiles9s")}
        >
          Add to Exiles 9s
        </Button>
      </div>
    </div>
  );
};

export default PlayerTeamSelector;
