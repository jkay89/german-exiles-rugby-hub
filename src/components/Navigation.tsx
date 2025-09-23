
import { Logo } from "./navigation/Logo";
import { DesktopNavigation } from "./navigation/DesktopNavigation";
import { MobileNavigation } from "./navigation/MobileNavigation";
import AuthButton from "./auth/AuthButton";
import AdminAuthButton from "./auth/AdminAuthButton";
import { useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const isLotteryPage = location.pathname.startsWith('/lottery') || location.pathname === '/auth';
  const isAdminPage = location.pathname.startsWith('/admin');

  const renderAuthButton = () => {
    if (isLotteryPage) {
      return <AuthButton />;
    }
    if (isAdminPage) {
      return <AdminAuthButton />;
    }
    return null;
  };

  return (
    <nav className="fixed top-0 w-full bg-black text-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="flex items-center gap-4">
            <DesktopNavigation />
            {renderAuthButton()}
          </div>
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
