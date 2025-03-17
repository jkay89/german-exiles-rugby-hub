
export interface SponsorLogo {
  id: string;
  name: string;
  logo: string;
  website: string | null;
  tier: "platinum" | "gold" | "silver" | "affiliate";
}
