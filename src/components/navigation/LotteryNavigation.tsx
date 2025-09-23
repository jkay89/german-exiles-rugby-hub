import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const LotteryNavigation = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-6">
      <Link 
        to="/lottery" 
        className="text-white hover:text-gray-300 transition-colors font-medium"
      >
        Play
      </Link>
      {user && (
        <Button asChild variant="ghost" size="sm">
          <Link to={`/lottery/${user.email?.split('@')[0] || ''}`}>
            My Dashboard
          </Link>
        </Button>
      )}
    </div>
  );
};

export default LotteryNavigation;