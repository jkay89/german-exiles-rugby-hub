
import { useLanguage } from "@/contexts/LanguageContext";

export const useNavigationLinks = () => {
  const { t } = useLanguage();

  const mainLinks = [
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

  const CLUB_SHOP_URL = "https://prontoteamwear.co.uk/product-category/club-shops/rugby-club-shops/german-exiles/";

  return {
    mainLinks,
    teamLinks,
    CLUB_SHOP_URL
  };
};
