import { Logo } from "./navigation/Logo";
import { DesktopNavigation } from "./navigation/DesktopNavigation";
import { MobileNavigation } from "./navigation/MobileNavigation";
import LotteryNavigation from "./navigation/LotteryNavigation";
import AuthButton from "./auth/AuthButton";
import AdminAuthButton from "./auth/AdminAuthButton";
import { useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const isLotteryPage = location.pathname.startsWith('/lottery') || location.pathname === '/auth';
  const isAdminPage = location.pathname.startsWith('/admin');

  const renderAuthButton = () => {
    if (isLotteryPage) return <AuthButton />;
    if (isAdminPage) return <AdminAuthButton />;
    return null;
  };

  return (
    <nav className="fixed top-0 w-full bg-black text-white z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: logo + auth + mobile toggle */}
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="hidden md:flex items-center gap-4">
            {isLotteryPage && <LotteryNavigation />}
            {renderAuthButton()}
          </div>
          <MobileNavigation />
        </div>
        {/* Bottom row: desktop nav links wrapped & centered */}
        {!isLotteryPage && (
          <div className="hidden md:block border-t border-gray-800">
            <DesktopNavigation />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
