import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/admin");
      } else {
        setSession(session);
      }
    });
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      navigate("/admin");
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-german-gold">Admin Dashboard</h1>
          <Button 
            onClick={handleSignOut}
            variant="destructive"
          >
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900">
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="bg-gray-900 p-6 rounded-lg mt-4">
            <h2 className="text-xl font-bold text-white mb-4">Player Management</h2>
            {/* Player management implementation will go here */}
          </TabsContent>

          <TabsContent value="fixtures" className="bg-gray-900 p-6 rounded-lg mt-4">
            <h2 className="text-xl font-bold text-white mb-4">Fixture Management</h2>
            {/* Fixture management implementation will go here */}
          </TabsContent>

          <TabsContent value="news" className="bg-gray-900 p-6 rounded-lg mt-4">
            <h2 className="text-xl font-bold text-white mb-4">News Management</h2>
            {/* News management implementation will go here */}
          </TabsContent>

          <TabsContent value="content" className="bg-gray-900 p-6 rounded-lg mt-4">
            <h2 className="text-xl font-bold text-white mb-4">Content Management</h2>
            {/* Content management implementation will go here */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;