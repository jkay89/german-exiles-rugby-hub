import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { useNavigationLinks } from "./NavigationLinks";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLotteryUrl } from "@/utils/subdomainUtils";

export const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { mainLinks, teamLinks } = useNavigationLinks();

  const isActive = (path: string) => location.pathname === path;
  const isTeamActive = teamLinks.some((link) => isActive(link.href));

  const close = () => {
    setIsOpen(false);
    setTeamOpen(false);
  };

  const aboutIndex = 1;
  const before = mainLinks.slice(0, aboutIndex + 1);
  const after = mainLinks.slice(aboutIndex + 1);

  const itemClass = (active: boolean) =>
    `${
      active
        ? "bg-german-red text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    } block px-3 py-2 rounded-md text-base font-medium`;

  return (
    <div className="md:hidden flex items-center">
      <LanguageSwitcher />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {before.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={itemClass(isActive(link.href))}
                onClick={close}
              >
                {link.label}
              </Link>
            ))}

            {/* The Club collapsible */}
            <button
              type="button"
              onClick={() => setTeamOpen((v) => !v)}
              className={`${
                isTeamActive
                  ? "bg-german-red text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium`}
              aria-expanded={teamOpen}
            >
              <span>{t("the_club")}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${teamOpen ? "rotate-180" : ""}`}
              />
            </button>
            {teamOpen && (
              <div className="pl-4 space-y-1">
                {teamLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={itemClass(isActive(link.href))}
                    onClick={close}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {after.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={itemClass(isActive(link.href))}
                onClick={close}
              >
                {link.label}
              </Link>
            ))}

            <a
              href={getLotteryUrl()}
              className={`${
                location.pathname.startsWith("/lottery")
                  ? "bg-german-gold text-black"
                  : "bg-german-gold/20 text-german-gold"
              } block px-3 py-2 rounded-md text-base font-bold`}
              onClick={close}
            >
              Lottery
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
