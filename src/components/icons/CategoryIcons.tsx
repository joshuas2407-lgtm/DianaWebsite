export function HouseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M8 28 L32 10 L56 28 V54 H8 Z" />
      <rect x="24" y="36" width="16" height="18" />
    </svg>
  );
}

export function PaletteBrushIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Palette */}
      <path d="M10 38 C10 22 26 14 38 18 C50 22 52 36 42 46 C32 54 16 50 10 38 Z" />
      <circle cx="20" cy="34" r="3.5" />
      <circle cx="34" cy="26" r="2" />
      <circle cx="42" cy="32" r="2" />
      <circle cx="38" cy="40" r="2" />
      {/* Paintbrush */}
      <path d="M44 18 L58 8" strokeWidth="2.5" />
      <path d="M58 8 L62 12" />
      <path d="M58 8 L54 13" />
      <path d="M58 8 L61 6" />
    </svg>
  );
}

export function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="8" y="20" width="48" height="32" rx="4" />
      <circle cx="32" cy="36" r="10" />
      <path d="M22 20 L26 12 H38 L42 20" />
    </svg>
  );
}

export function BagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M16 24 C16 14 22 10 32 10 C42 10 48 14 48 24" />
      <rect x="12" y="24" width="40" height="30" rx="4" />
      <path d="M24 24 V18 C24 14 27 12 32 12 C37 12 40 14 40 18 V24" />
      <line x1="12" y1="34" x2="52" y2="34" />
    </svg>
  );
}
