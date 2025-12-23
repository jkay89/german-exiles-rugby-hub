
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "../LanguageSwitcher";
import { useNavigationLinks } from "./NavigationLinks";
import { useLanguage } from "@/contexts/LanguageContext";

export const DesktopNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage(); // Fix for context issue
  const { mainLinks, teamLinks, CLUB_SHOP_URL } = useNavigationLinks();

  const isActive = (path: string) => location.pathname === path;
  const isTeamActive = teamLinks.some(link => isActive(link.href));

  return (
    <div className="hidden md:flex md:items-center">
      <div className="ml-10 flex items-center space-x-4">
        {mainLinks.map((link, index) => {
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
                    {t("the_club")} <ChevronDown className="h-4 w-4" />
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
        })}
        
        {/* Lottery Link - styled distinctively */}
        <Link
          to="/lottery"
          className={`${
            location.pathname.startsWith('/lottery')
              ? "bg-german-gold text-black"
              : "bg-german-gold/20 text-german-gold hover:bg-german-gold hover:text-black"
          } px-3 py-2 rounded-md text-sm font-bold transition-colors duration-200`}
        >
          Lottery
        </Link>
        
        {/* Club Shop External Link */}
        <a 
          href={CLUB_SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
        >
          Shop <ExternalLink className="h-3 w-3" />
        </a>
        
        <LanguageSwitcher />
      </div>
    </div>
  );
};
