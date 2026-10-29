export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="vignette-mark" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D9663A" />
          <stop offset="0.55" stopColor="#C8502B" />
          <stop offset="1" stopColor="#8E3A22" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="37" height="37" rx="12" fill="url(#vignette-mark)" />
      <circle cx="20" cy="20" r="8.4" stroke="#FFF8F0" strokeWidth="1.6" opacity="0.85" />
      <circle cx="20" cy="20" r="3.2" fill="#FFF8F0" />
      <path d="M20 5.4v6.2M20 28.4v6.2M5.4 20h6.2M28.4 20h6.2" stroke="#FFF8F0" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark size={size + 2} />
      <span
        className="font-display leading-none tracking-[-0.02em]"
        style={{ fontSize: size }}
      >
        Vignette
      </span>
    </span>
  );
}
