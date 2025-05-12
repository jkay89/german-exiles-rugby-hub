
import { useLanguage } from "@/contexts/LanguageContext";

export const useNavigationLinks = () => {
  const { t } = useLanguage();

  const mainLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/fixtures", label: t("fixtures") },
    { href: "/news", label: t("news") },
    { href: "/media", label: t("media") },
    { href: "/nrld", label: t("nrld") },
    { href: "/sponsors", label: t("sponsors") },
    { href: "/contact", label: t("contact") },
    { href: "https://www.youtube.com/c/DavidGrayTV", label: t("live_stream"), external: true },
  ];

  const teamLinks = [
    { href: "/heritage-team", label: t("heritage_team") },
    { href: "/community-team", label: t("community_team") },
    { href: "/exiles-9s", label: "Exiles 9s" },
    { href: "/staff", label: t("staff") },
  ];

  const CLUB_SHOP_URL = "https://prontoteamwear.co.uk/product-category/club-shops/rugby-club-shops/german-exiles/";

  return {
    mainLinks,
    teamLinks,
    CLUB_SHOP_URL
  };
};
