
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/fixtures", label: t("fixtures") },
    { href: "/news", label: t("news") },
    { href: "/nrld", label: t("nrld") },
    { href: "/sponsors", label: t("sponsors") },
    { href: "/contact", label: t("contact") },
  ];

  const teamLinks = [
    { href: "/heritage-team", label: t("heritage_team") },
    { href: "/community-team", label: t("community_team") },
    { href: "/exiles-9s", label: "Exiles 9s" },
    { href: "/staff", label: t("staff") },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isTeamActive = teamLinks.some(link => isActive(link.href));

  const renderDesktopLinks = () => {
    return links.map((link, index) => {
      // Insert Teams dropdown after About Us
      if (index === 1) {
        return (
          <>
            <Link
              key={link.href}
              to={link.href}
              className={`${
                isActive(link.href)
                  ? "bg-german-red text-white"
                  : "text-gray-300 hover:bg-gray-900 hover:text-white"
              } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
            >
              {link.label}
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`${
                  isTeamActive
                    ? "bg-german-red text-white"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1`}
              >
                {t("teams")} <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border border-gray-700">
                {teamLinks.map((teamLink) => (
                  <DropdownMenuItem key={teamLink.href} className="focus:bg-gray-800">
                    <Link
                      to={teamLink.href}
                      className={`${
                        isActive(teamLink.href)
                          ? "text-german-red"
                          : "text-gray-300"
                      } w-full px-2 py-1 text-sm`}
                    >
                      {teamLink.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      }
      
      // Skip rendering About Us again since it's handled above
      if (index === 1) return null;

      return (
        <Link
          key={link.href}
          to={link.href}
          className={`${
            isActive(link.href)
              ? "bg-german-red text-white"
              : "text-gray-300 hover:bg-gray-900 hover:text-white"
          } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
        >
          {link.label}
        </Link>
      );
    });
  };

  return (
    <nav className="fixed top-0 w-full bg-black text-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png"
                alt="German Exiles RL Logo"
                className="h-12 w-12 object-contain brightness-125"
              />
              <span className="text-german-gold font-bold text-xl hidden sm:block">German Exiles RL</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="ml-10 flex items-center space-x-4">
              {renderDesktopLinks()}
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`${
                  isActive(link.href)
                    ? "bg-german-red text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile Team Links */}
            {teamLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`${
                  isActive(link.href)
                    ? "bg-german-red text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                } block px-3 py-2 rounded-md text-base font-medium ml-4`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
