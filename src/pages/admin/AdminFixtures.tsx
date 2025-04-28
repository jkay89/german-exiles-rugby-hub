
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";

// Temporary fixture type until we create the proper database
interface Fixture {
  id: string;
  team: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  competition: string;
  isHome: boolean;
}

// Temporary result type until we create the proper database
interface Result {
  id: string;
  fixtureId?: string;
  team: string;
  opponent: string;
  date: string;
  teamScore: number;
  opponentScore: number;
  competition: string;
  isHome: boolean;
  motm?: string;
}

const AdminFixtures = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("fixtures");
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Mock data for demonstration - would be replaced with Supabase data
  useEffect(() => {
    const mockFixtures = [
      {
        id: "1",
        team: "Heritage Team",
        opponent: "Netherlands Rugby League",
        date: "2025-05-15",
        time: "15:00",
        location: "Rotterdam Stadium",
        competition: "European Championship",
        isHome: false,
      },
      {
        id: "2",
        team: "Community Team",
        opponent: "France Rugby League",
        date: "2025-06-10",
        time: "14:00",
        location: "Berlin Stadium",
        competition: "Friendly",
        isHome: true,
      }
    ];
    
    const mockResults = [
      {
        id: "1",
        team: "Heritage Team",
        opponent: "Belgium Rugby League",
        date: "2025-03-20",
        teamScore: 24,
        opponentScore: 18,
        competition: "European Championship",
        isHome: true,
        motm: "Jay Kay",
      }
    ];
    
    setFixtures(mockFixtures);
    setResults(mockResults);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleAddFixture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFixture = {
      id: Date.now().toString(),
      team: formData.get("team") as string,
      opponent: formData.get("opponent") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      competition: formData.get("competition") as string,
      isHome: formData.get("isHome") === "home",
    };
    
    // Here we would add Supabase code to insert fixture
    setFixtures([...fixtures, newFixture]);
    toast({
      title: "Fixture added",
      description: "The fixture has been added successfully",
    });
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  const handleAddResult = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newResult = {
      id: Date.now().toString(),
      team: formData.get("team") as string,
      opponent: formData.get("opponent") as string,
      date: formData.get("date") as string,
      teamScore: parseInt(formData.get("teamScore") as string),
      opponentScore: parseInt(formData.get("opponentScore") as string),
      competition: formData.get("competition") as string,
      isHome: formData.get("isHome") === "home",
      motm: formData.get("motm") as string,
    };
    
    // Here we would add Supabase code to insert result
    setResults([...results, newResult]);
    toast({
      title: "Result added",
      description: "The match result has been added successfully",
    });
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  const handleDeleteFixture = (id: string) => {
    // Here we would add Supabase code to delete fixture
    setFixtures(fixtures.filter(fixture => fixture.id !== id));
    toast({
      title: "Fixture removed",
      description: "The fixture has been removed successfully",
    });
  };

  const handleDeleteResult = (id: string) => {
    // Here we would add Supabase code to delete result
    setResults(results.filter(result => result.id !== id));
    toast({
      title: "Result removed",
      description: "The match result has been removed successfully",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Fixtures & Results</h1>
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Tabs defaultValue="fixtures" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800 text-white">
            <TabsTrigger 
              value="fixtures" 
              className="data-[state=active]:bg-german-red data-[state=active]:text-white"
            >
              Upcoming Fixtures
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="data-[state=active]:bg-german-red data-[state=active]:text-white"
            >
              Match Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="fixtures" className="mt-0">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-german-gold" />
                Add New Fixture
              </h2>
              
              <form onSubmit={handleAddFixture} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2">Team</Label>
                    <Select name="team" required>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="Heritage Team">Heritage Team</SelectItem>
                        <SelectItem value="Community Team">Community Team</SelectItem>
                        <SelectItem value="Exiles 9s">Exiles 9s</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Opponent</Label>
                    <Input 
                      name="opponent" 
                      required 
                      placeholder="Enter opponent name"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Date</Label>
                    <Input 
                      name="date" 
                      type="date" 
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Time</Label>
                    <Input 
                      name="time" 
                      type="time" 
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Location</Label>
                    <Input 
                      name="location" 
                      required 
                      placeholder="Enter venue/location"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Competition</Label>
                    <Input 
                      name="competition" 
                      required 
                      placeholder="Enter competition name"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Home/Away</Label>
                    <Select name="isHome" required>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="away">Away</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="bg-german-red hover:bg-german-gold">Add Fixture</Button>
                </div>
              </form>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Upcoming Fixtures</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Team</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Opponent</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Time</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Location</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Competition</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {fixtures.map((fixture) => (
                      <tr key={fixture.id}>
                        <td className="px-4 py-3 text-sm text-gray-300">{fixture.team}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">
                          {fixture.isHome ? fixture.opponent : `vs ${fixture.opponent}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">{fixture.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{fixture.time}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{fixture.location}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{fixture.competition}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                              <Edit className="h-3 w-3" /> Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteFixture(fixture.id)}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="mt-0">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-german-gold" />
                Add Match Result
              </h2>
              
              <form onSubmit={handleAddResult} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2">Team</Label>
                    <Select name="team" required>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="Heritage Team">Heritage Team</SelectItem>
                        <SelectItem value="Community Team">Community Team</SelectItem>
                        <SelectItem value="Exiles 9s">Exiles 9s</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Opponent</Label>
                    <Input 
                      name="opponent" 
                      required 
                      placeholder="Enter opponent name"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Date</Label>
                    <Input 
                      name="date" 
                      type="date" 
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Home/Away</Label>
                    <Select name="isHome" required>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="away">Away</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Our Score</Label>
                    <Input 
                      name="teamScore" 
                      type="number" 
                      min="0"
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Opponent Score</Label>
                    <Input 
                      name="opponentScore" 
                      type="number" 
                      min="0"
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Competition</Label>
                    <Input 
                      name="competition" 
                      required 
                      placeholder="Enter competition name"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Man of the Match</Label>
                    <Input 
                      name="motm" 
                      placeholder="Optional"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="bg-german-red hover:bg-german-gold">Add Result</Button>
                </div>
              </form>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Match Results</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Team</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Opponent</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Score</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Competition</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">MOTM</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {results.map((result) => (
                      <tr key={result.id}>
                        <td className="px-4 py-3 text-sm text-gray-300">{result.team}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{result.opponent}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{result.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-300 font-semibold">
                          {result.isHome 
                            ? `${result.teamScore} - ${result.opponentScore}` 
                            : `${result.opponentScore} - ${result.teamScore}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">{result.competition}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{result.motm || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                              <Edit className="h-3 w-3" /> Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDeleteResult(result.id)}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminFixtures;
