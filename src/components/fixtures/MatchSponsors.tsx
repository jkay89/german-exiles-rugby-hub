interface SponsorEntry {
  name?: string | null;
  logo_url?: string | null;
  url?: string | null;
  label: string;
}

interface MatchSponsorsProps {
  sponsors: SponsorEntry[];
  align?: "left" | "center";
}

/**
 * Displays match-related sponsors (Match, MOTM, Ball) with optional clickable logos.
 */
const MatchSponsors = ({ sponsors, align = "left" }: MatchSponsorsProps) => {
  const visible = sponsors.filter((s) => s.name || s.logo_url);
  if (visible.length === 0) return null;

  return (
    <div
      className={`mt-3 pt-3 border-t border-gray-700 flex flex-wrap gap-3 ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      {visible.map((s) => {
        const content = (
          <div className="flex items-center gap-2">
            {s.logo_url ? (
              <img
                src={s.logo_url}
                alt={`${s.label}: ${s.name ?? ""}`}
                className="h-8 w-auto object-contain bg-white/90 rounded p-0.5"
                loading="lazy"
              />
            ) : null}
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-wide text-german-gold">
                {s.label}
              </span>
              {s.name ? (
                <span className="text-xs text-gray-200">{s.name}</span>
              ) : null}
            </div>
          </div>
        );

        return s.url ? (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="hover:opacity-80 transition-opacity"
          >
            {content}
          </a>
        ) : (
          <div key={s.label}>{content}</div>
        );
      })}
    </div>
  );
};

export default MatchSponsors;
