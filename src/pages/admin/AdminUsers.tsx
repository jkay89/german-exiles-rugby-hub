import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AdminUsers = () => {
  const { isAuthenticated, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/admin");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/dashboard")}
            className="text-white hover:text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-white mb-8">Admin Users Management</h1>
        <p className="text-gray-400 mb-8">
          Manage admin users for the German Exiles RL website. Only users with @germanexilesrl.co.uk emails can be made admins.
        </p>
        
        <AdminUsersTable />
      </motion.div>
    </div>
  );
};

export default AdminUsers;