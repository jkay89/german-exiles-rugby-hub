
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, Images, Plus, Edit, Calendar } from "lucide-react";

const AdminDashboard = () => {
  const { isAuthenticated, currentAdmin, logout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

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
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <p className="text-gray-400">Logged in as: <span className="text-german-gold">{currentAdmin}</span></p>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-german-gold" />
                Players Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Add, edit, or remove players from various teams.</p>
              <Link to="/admin/players">
                <Button className="w-full bg-german-red hover:bg-german-gold">Manage Players</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Images className="h-5 w-5 text-german-gold" />
                News Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Create, edit, or delete news articles.</p>
              <Link to="/admin/news">
                <Button className="w-full bg-german-red hover:bg-german-gold">Manage News</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-german-gold" />
                Media Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Upload and organize photos and videos.</p>
              <Link to="/admin/media">
                <Button className="w-full bg-german-red hover:bg-german-gold">Manage Media</Button>
              </Link>
            </CardContent>
          </Card>
        
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-german-gold" />
                Sponsor Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Add, edit, or remove sponsors from the website.</p>
              <Link to="/admin/sponsors">
                <Button className="w-full bg-german-red hover:bg-german-gold">Manage Sponsors</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-german-gold" />
                Fixtures & Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Manage fixtures and update match results.</p>
              <Link to="/admin/fixtures">
                <Button className="w-full bg-german-red hover:bg-german-gold">Manage Fixtures</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900 border-gray-800 text-white mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add New Player
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create News Article
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Upload Media
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
