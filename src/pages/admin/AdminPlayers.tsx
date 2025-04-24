
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";

const AdminPlayers = () => {
  const { isAuthenticated } = useAdmin();
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
          <h1 className="text-3xl font-bold text-white">Players Management</h1>
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Add New Player</h2>
          <p className="text-gray-400 mb-4">Create a new player profile for Heritage Team, Community Team, or Exiles 9s.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-german-red hover:bg-german-gold">Add to Heritage Team</Button>
            <Button className="bg-german-red hover:bg-german-gold">Add to Community Team</Button>
            <Button className="bg-german-red hover:bg-german-gold">Add to Exiles 9s</Button>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Manage Existing Players</h2>
          <p className="text-gray-400 mb-4">View and edit details of existing players.</p>
          
          <div className="tabs flex border-b border-gray-800 mb-4">
            <div className="px-4 py-2 border-b-2 border-german-red text-white font-medium">
              Heritage Team
            </div>
            <div className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer">
              Community Team
            </div>
            <div className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer">
              Exiles 9s
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Position</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Heritage</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Club</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-300">15</td>
                  <td className="px-4 py-3 text-sm text-gray-300">Jay Kay</td>
                  <td className="px-4 py-3 text-sm text-gray-300">Outside Backs</td>
                  <td className="px-4 py-3 text-sm text-gray-300">German</td>
                  <td className="px-4 py-3 text-sm text-gray-300">Thornhill Trojans</td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Delete</Button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-300">5</td>
                  <td className="px-4 py-3 text-sm text-gray-300">Zak Bredin</td>
                  <td className="px-4 py-3 text-sm text-gray-300">Half Back</td>
                  <td className="px-4 py-3 text-sm text-gray-300">German</td>
                  <td className="px-4 py-3 text-sm text-gray-300">Eastern Rhinos</td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Delete</Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPlayers;
