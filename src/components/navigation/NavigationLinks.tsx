
import { useLanguage } from "@/contexts/LanguageContext";

export const useNavigationLinks = () => {
  const { t } = useLanguage();

  // Memoize the links to prevent recreation on every render
  const mainLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/fixtures", label: t("fixtures") },
    { href: "/news", label: t("news") },
    { href: "/media", label: t("media") },
    { href: "/documents", label: t("documents") },
    { href: "/nrld", label: t("nrld") },
    { href: "/sponsors", label: t("sponsors") },
    { href: "/contact", label: t("contact") },
    { href: "/faqs", label: t("faqs") },
    { href: "https://www.youtube.com/c/DavidGrayTV", label: t("live_stream"), external: true },
  ];

  const teamLinks = [
    { href: "/heritage-team", label: t("heritage_team") },
    { href: "/community-team", label: t("community_team") },
    { href: "/exiles-9s", label: "Exiles 9s" },
    { href: "/committee-members", label: t("committee_members") },
    { href: "/coaching-team", label: t("coaching_team") },
  ];

  const CLUB_SHOP_URL = "https://prontoteamwear.co.uk/product-category/club-shops/rugby-club-shops/german-exiles/";

  return {
    mainLinks,
    teamLinks,
    CLUB_SHOP_URL
  };
};
