/**
 * SAAF Institutional Globe & Grid Motif
 */
function HeroMotif({ className, tone = "dark" }: { className?: string; tone?: "light" | "dark" }) {
  const line = tone === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(11, 77, 162, 0.15)";
  const ring = tone === "dark" ? "rgba(147, 197, 253, 0.35)" : "rgba(11, 77, 162, 0.4)";
  const gold = "#F59E0B";

  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="motifBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Concentric Globe Ellipses */}
      <ellipse cx="250" cy="250" rx="220" ry="140" stroke={ring} strokeWidth="1.5" fill="url(#motifBlueGrad)" />
      <ellipse cx="250" cy="250" rx="180" ry="140" stroke={ring} strokeWidth="1.2" />
      <ellipse cx="250" cy="250" rx="120" ry="140" stroke={ring} strokeWidth="1.2" />
      <ellipse cx="250" cy="250" rx="50" ry="140" stroke={ring} strokeWidth="1.2" />

      {/* Horizontal Latitude Lines */}
      <line x1="30" y1="250" x2="470" y2="250" stroke={ring} strokeWidth="2" />
      <path d="M 60 190 Q 250 150 440 190" stroke={line} strokeWidth="1.5" fill="none" />
      <path d="M 100 130 Q 250 100 400 130" stroke={line} strokeWidth="1.5" fill="none" />
      <path d="M 60 310 Q 250 350 440 310" stroke={line} strokeWidth="1.5" fill="none" />
      <path d="M 100 370 Q 250 400 400 370" stroke={line} strokeWidth="1.5" fill="none" />

      {/* Vertical Axis */}
      <line x1="250" y1="110" x2="250" y2="390" stroke={ring} strokeWidth="2" />

      {/* Golden Trust Markers */}
      <circle cx="250" cy="250" r="6" fill={gold} />
      <circle cx="250" cy="110" r="4" fill={gold} />
      <circle cx="250" cy="390" r="4" fill={gold} />
      <circle cx="70" cy="250" r="4" fill={gold} />
      <circle cx="430" cy="250" r="4" fill={gold} />
    </svg>
  );
}

export { HeroMotif };
