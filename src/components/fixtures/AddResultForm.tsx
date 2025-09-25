import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client-extensions";
import { useToast } from "@/components/ui/use-toast";
import { Fixture } from "@/hooks/useFixtures";
import { Plus } from "lucide-react";

interface AddResultFormProps {
  fixture: Fixture;
  onResultAdded: () => void;
}

const AddResultForm = ({ fixture, onResultAdded }: AddResultFormProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamScore, setTeamScore] = useState<number | "">("");
  const [opponentScore, setOpponentScore] = useState<number | "">("");
  const [motm, setMotm] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (teamScore === "" || opponentScore === "") {
      toast({
        title: "Error",
        description: "Please enter both team scores",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create the result entry
      const resultData = {
        fixture_id: fixture.id,
        team: fixture.team || (fixture.is_home ? "German Exiles" : "Germany RL"),
        opponent: fixture.opponent,
        date: fixture.date,
        team_score: Number(teamScore),
        opponent_score: Number(opponentScore),
        competition: fixture.competition,
        is_home: fixture.is_home,
        motm: motm.trim() || null,
      };

      const { error: resultError } = await supabase.rest
        .from("results")
        .insert([resultData]);

      if (resultError) throw resultError;

      // Remove the fixture from upcoming fixtures
      const { error: deleteError } = await supabase.rest
        .from("fixtures")
        .delete()
        .eq("id", fixture.id);

      if (deleteError) throw deleteError;

      toast({
        title: "Result Added",
        description: "The match result has been recorded successfully",
      });

      // Reset form and close dialog
      setTeamScore("");
      setOpponentScore("");
      setMotm("");
      setOpen(false);
      onResultAdded();
    } catch (error: any) {
      console.error("Error adding result:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add result",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ourTeam = fixture.team || (fixture.is_home ? "German Exiles" : "Germany RL");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-german-red hover:bg-german-gold text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Result
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Add Match Result</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center py-2">
            <h3 className="text-lg font-semibold">
              {fixture.is_home ? `${ourTeam} vs ${fixture.opponent}` : `${fixture.opponent} vs ${ourTeam}`}
            </h3>
            <p className="text-gray-400 text-sm">{fixture.competition}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">
                {fixture.is_home ? ourTeam : fixture.opponent} Score
              </Label>
              <Input
                type="number"
                min="0"
                value={fixture.is_home ? teamScore : opponentScore}
                onChange={(e) => fixture.is_home ? setTeamScore(e.target.value === "" ? "" : Number(e.target.value)) : setOpponentScore(e.target.value === "" ? "" : Number(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            <div>
              <Label className="text-white">
                {fixture.is_home ? fixture.opponent : ourTeam} Score
              </Label>
              <Input
                type="number"
                min="0"
                value={fixture.is_home ? opponentScore : teamScore}
                onChange={(e) => fixture.is_home ? setOpponentScore(e.target.value === "" ? "" : Number(e.target.value)) : setTeamScore(e.target.value === "" ? "" : Number(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-white">Man of the Match (Optional)</Label>
            <Input
              type="text"
              value={motm}
              onChange={(e) => setMotm(e.target.value)}
              placeholder="Enter player name"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-german-red hover:bg-german-gold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Result"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResultForm;