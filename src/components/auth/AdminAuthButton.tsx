import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminAuthButton = () => {
  const { isAuthenticated, logout, currentAdmin, loading } = useAdmin();

  if (loading) {
    return null; // Don't render anything while loading
  }

  if (!isAuthenticated) {
    return (
      <Button asChild className="bg-red-600 hover:bg-red-700">
        <Link to="/admin">Admin Login</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Admin: {currentAdmin}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
        <DropdownMenuItem asChild>
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-white">
            <User className="w-4 h-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={logout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminAuthButton;