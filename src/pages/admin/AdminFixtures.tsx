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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format, parseISO } from "date-fns";

// Fixture type
interface Fixture {
  id: string;
  team: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  competition: string;
  is_home: boolean;
  created_at?: string;
}

// Result type
interface Result {
  id: string;
  fixture_id?: string;
  team: string;
  opponent: string;
  date: string;
  team_score: number;
  opponent_score: number;
  competition: string;
  is_home: boolean;
  motm?: string;
  created_at?: string;
}

const AdminFixtures = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("fixtures");
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    } else {
      if (activeTab === "fixtures") {
        fetchFixtures();
      } else {
        fetchResults();
      }
    }
  }, [isAuthenticated, navigate, activeTab]);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("fixtures")
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setFixtures(data as Fixture[] || []);
    } catch (error: any) {
      toast({
        title: "Error fetching fixtures",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("results")
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setResults(data as Result[] || []);
    } catch (error: any) {
      toast({
        title: "Error fetching results",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFixture = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const fixtureData = {
      team: formData.get("team") as string,
      opponent: formData.get("opponent") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      competition: formData.get("competition") as string,
      is_home: formData.get("isHome") === "home",
    };
    
    try {
      const { error } = await supabase
        .from("fixtures")
        .insert([fixtureData]);
      
      if (error) throw error;
      
      toast({
        title: "Fixture added",
        description: "The fixture has been added successfully",
      });
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      fetchFixtures();
    } catch (error: any) {
      toast({
        title: "Error adding fixture",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFixture = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingFixture) return;
    
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const fixtureData = {
      team: formData.get("team") as string,
      opponent: formData.get("opponent") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      competition: formData.get("competition") as string,
      is_home: formData.get("isHome") === "home",
    };
    
    try {
      const { error } = await supabase
        .from("fixtures")
        .update(fixtureData)
        .eq('id', editingFixture.id);
      
      if (error) throw error;
      
      toast({
        title: "Fixture updated",
        description: "The fixture has been updated successfully",
      });
      
      setEditingFixture(null);
      fetchFixtures();
    } catch (error: any) {
      toast({
        title: "Error updating fixture",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddResult = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const resultData = {
      team: formData.get("team") as string,
      opponent: formData.get("opponent") as string,
      date: formData.get("date") as string,
      team_score: parseInt(formData.get("teamScore") as string),
      opponent_score: parseInt(formData.get("opponentScore") as string),
      competition: formData.get("competition") as string,
      is_home: formData.get("isHome") === "home",
      motm: formData.get("motm") as string || null,
    };
    
    try {
      const { error } = await supabase.from("results").insert([resultData]);
      
      if (error) throw error;
      
      toast({
        title: "Result added",
        description: "The match result has been added successfully",
      });
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      fetchResults();
    } catch (error: any) {
      toast({
        title: "Error adding result",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateResult = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingResult) return;
    
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const resultData = {
      team: formData.get("team") as string,
      opponent: formData.get("opponent") as string,
      date: formData.get("date") as string,
      team_score: parseInt(formData.get("teamScore") as string),
      opponent_score: parseInt(formData.get("opponentScore") as string),
      competition: formData.get("competition") as string,
      is_home: formData.get("isHome") === "home",
      motm: formData.get("motm") as string || null,
    };
    
    try {
      const { error } = await supabase
        .from("results")
        .update(resultData)
        .eq('id', editingResult.id);
      
      if (error) throw error;
      
      toast({
        title: "Result updated",
        description: "The match result has been updated successfully",
      });
      
      setEditingResult(null);
      fetchResults();
    } catch (error: any) {
      toast({
        title: "Error updating result",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFixture = async () => {
    if (!deleteItemId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("fixtures")
        .delete()
        .eq('id', deleteItemId);
        
      if (error) throw error;
      
      toast({
        title: "Fixture deleted",
        description: "The fixture has been deleted successfully",
      });
      
      setDeleteItemId(null);
      fetchFixtures();
    } catch (error: any) {
      toast({
        title: "Error deleting fixture",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteResult = async () => {
    if (!deleteItemId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("results")
        .delete()
        .eq('id', deleteItemId);
        
      if (error) throw error;
      
      toast({
        title: "Result deleted",
        description: "The match result has been deleted successfully",
      });
      
      setDeleteItemId(null);
      fetchResults();
    } catch (error: any) {
      toast({
        title: "Error deleting result",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
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

        <Tabs 
          defaultValue="fixtures" 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value);
            setEditingFixture(null);
            setEditingResult(null);
          }}
          className="w-full"
        >
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
                {editingFixture ? "Edit Fixture" : "Add New Fixture"}
              </h2>
              
              <form 
                onSubmit={editingFixture ? handleUpdateFixture : handleAddFixture} 
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2">Team</Label>
                    <Select 
                      name="team" 
                      required
                      defaultValue={editingFixture?.team}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="German Exiles">German Exiles</SelectItem>
                        <SelectItem value="Germany RL">Germany RL</SelectItem>
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
                      defaultValue={editingFixture?.opponent}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Date</Label>
                    <Input 
                      name="date" 
                      type="date" 
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      defaultValue={editingFixture?.date}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Time</Label>
                    <Input 
                      name="time" 
                      type="time" 
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      defaultValue={editingFixture?.time}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Location</Label>
                    <Input 
                      name="location" 
                      required 
                      placeholder="Enter venue/location"
                      className="bg-gray-800 border-gray-700 text-white"
                      defaultValue={editingFixture?.location}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Competition</Label>
                    <Input 
                      name="competition" 
                      required 
                      placeholder="Enter competition name"
                      className="bg-gray-800 border-gray-700 text-white"
                      defaultValue={editingFixture?.competition}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Home/Away</Label>
                    <Select 
                      name="isHome" 
                      required
                      defaultValue={editingFixture?.is_home ? "home" : "away"}
                    >
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
                
                <div className="flex justify-end gap-2">
                  {editingFixture && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEditingFixture(null)}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    className="bg-german-red hover:bg-german-gold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 
                      "Saving..." :
                      editingFixture ? "Update Fixture" : "Add Fixture"
                    }
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Upcoming Fixtures</h2>
              
              {loading ? (
                <p className="text-gray-400 text-center py-4">Loading fixtures...</p>
              ) : fixtures.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No fixtures found. Add a fixture to get started.</p>
              ) : (
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
                            {fixture.opponent}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {format(parseISO(fixture.date), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">{fixture.time}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{fixture.location}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{fixture.competition}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex items-center gap-1"
                                onClick={() => setEditingFixture(fixture)}
                              >
                                <Edit className="h-3 w-3" /> Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                className="flex items-center gap-1"
                                onClick={() => setDeleteItemId(fixture.id)}
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
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="mt-0">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-german-gold" />
                {editingResult ? "Edit Match Result" : "Add Match Result"}
              </h2>
              
              <form 
                onSubmit={editingResult ? handleUpdateResult : handleAddResult} 
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2">Team</Label>
                    <Select 
                      name="team" 
                      required
                      defaultValue={editingResult?.team}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="German Exiles">German Exiles</SelectItem>
                        <SelectItem value="Germany RL">Germany RL</SelectItem>
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
                      defaultValue={editingResult?.opponent}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Date</Label>
                    <Input 
                      name="date" 
                      type="date" 
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      defaultValue={editingResult?.date}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Home/Away</Label>
                    <Select 
                      name="isHome" 
                      required
                      defaultValue={editingResult?.is_home ? "home" : "away"}
                    >
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
                      defaultValue={editingResult?.team_score}
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
                      defaultValue={editingResult?.opponent_score}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Competition</Label>
                    <Input 
                      name="competition" 
                      required 
                      placeholder="Enter competition name"
                      className="bg-gray-800 border-gray-700 text-white"
                      defaultValue={editingResult?.competition}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2">Man of the Match</Label>
                    <Input 
                      name="motm" 
                      placeholder="Optional"
                      className="bg-gray-800 border-gray-700 text-white"
                      defaultValue={editingResult?.motm || ""}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  {editingResult && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEditingResult(null)}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    className="bg-german-red hover:bg-german-gold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 
                      "Saving..." :
                      editingResult ? "Update Result" : "Add Result"
                    }
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Match Results</h2>
              
              {loading ? (
                <p className="text-gray-400 text-center py-4">Loading results...</p>
              ) : results.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No results found. Add a result to get started.</p>
              ) : (
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
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {format(parseISO(result.date), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300 font-semibold">
                            {result.is_home 
                              ? `${result.team_score} - ${result.opponent_score}` 
                              : `${result.opponent_score} - ${result.team_score}`}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">{result.competition}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{result.motm || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex items-center gap-1"
                                onClick={() => setEditingResult(result)}
                              >
                                <Edit className="h-3 w-3" /> Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="flex items-center gap-1"
                                onClick={() => setDeleteItemId(result.id)}
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
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <AlertDialog open={!!deleteItemId} onOpenChange={(open) => !open && setDeleteItemId(null)}>
        <AlertDialogContent className="bg-gray-900 text-white border border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this {activeTab === 'fixtures' ? 'fixture' : 'result'}?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the {activeTab === 'fixtures' ? 'fixture' : 'result'} from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={activeTab === 'fixtures' ? handleDeleteFixture : handleDeleteResult} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminFixtures;
