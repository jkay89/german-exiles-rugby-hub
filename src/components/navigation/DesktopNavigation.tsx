import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "../LanguageSwitcher";
import { useNavigationLinks } from "./NavigationLinks";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLotteryUrl } from "@/utils/subdomainUtils";

export const DesktopNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { mainLinks, teamLinks } = useNavigationLinks();

  const isActive = (path: string) => location.pathname === path;
  const isTeamActive = teamLinks.some((link) => isActive(link.href));

  const linkClass = (active: boolean) =>
    `${
      active
        ? "bg-german-red text-white"
        : "text-gray-300 hover:bg-gray-900 hover:text-white"
    } px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap`;

  // Split: render About Us, then The Club dropdown, then the rest
  const aboutIndex = 1;
  const before = mainLinks.slice(0, aboutIndex + 1);
  const after = mainLinks.slice(aboutIndex + 1);

  return (
    <div className="hidden md:flex md:flex-wrap md:items-center md:justify-center gap-1.5 py-2">
      {before.map((link) => (
        <Link key={link.href} to={link.href} className={linkClass(isActive(link.href))}>
          {link.label}
        </Link>
      ))}

      <DropdownMenu>
        <DropdownMenuTrigger
          className={`${
            isTeamActive
              ? "bg-german-red text-white"
              : "text-gray-300 hover:bg-gray-900 hover:text-white"
          } px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1 whitespace-nowrap`}
        >
          {t("the_club")} <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black border border-gray-700">
          {teamLinks.map((teamLink) => (
            <DropdownMenuItem key={teamLink.href} className="focus:bg-gray-800">
              <Link
                to={teamLink.href}
                className={`${
                  isActive(teamLink.href) ? "text-german-red" : "text-gray-300"
                } w-full px-2 py-1 text-sm`}
              >
                {teamLink.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {after.map((link) => (
        <Link key={link.href} to={link.href} className={linkClass(isActive(link.href))}>
          {link.label}
        </Link>
      ))}

      <a
        href={getLotteryUrl()}
        className={`${
          location.pathname.startsWith("/lottery")
            ? "bg-german-gold text-black"
            : "bg-german-gold/20 text-german-gold hover:bg-german-gold hover:text-black"
        } px-3 py-1.5 rounded-md text-sm font-bold transition-colors duration-200 whitespace-nowrap`}
      >
        Lottery
      </a>

      <LanguageSwitcher />
    </div>
  );
};
