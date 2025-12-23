
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { useNavigationLinks } from "./NavigationLinks";

export const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { mainLinks, teamLinks, CLUB_SHOP_URL } = useNavigationLinks();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden flex items-center">
      <LanguageSwitcher />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {mainLinks.map((link) => (
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
            
            {/* Lottery Link - styled distinctively */}
            <Link
              to="/lottery"
              className={`${
                location.pathname.startsWith('/lottery')
                  ? "bg-german-gold text-black"
                  : "bg-german-gold/20 text-german-gold"
              } block px-3 py-2 rounded-md text-base font-bold`}
              onClick={() => setIsOpen(false)}
            >
              Lottery
            </Link>
            
            {/* Club Shop External Link for Mobile */}
            <a 
              href={CLUB_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-1"
              onClick={() => setIsOpen(false)}
            >
              Shop <ExternalLink className="h-4 w-4" />
            </a>
            
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
    </div>
  );
};
