import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getMainSiteUrl } from "@/utils/subdomainUtils";

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
      <Link 
        to="/lottery/draw" 
        className="text-white hover:text-gray-300 transition-colors font-medium"
      >
        The Draw
      </Link>
      {user && (
        <Button asChild variant="ghost" size="sm">
          <Link to={`/lottery/${user.email?.split('@')[0] || ''}`}>
            My Dashboard
          </Link>
        </Button>
      )}
      <a 
        href={getMainSiteUrl()}
        className="text-gray-400 hover:text-white transition-colors font-medium text-sm"
      >
        ← Main Site
      </a>
    </div>
  );
};

export default LotteryNavigation;