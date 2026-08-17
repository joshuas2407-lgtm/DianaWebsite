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

export function PaintbrushIcon({ className }: { className?: string }) {
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
      <rect x="28" y="8" width="8" height="18" />
      <rect x="18" y="26" width="28" height="8" rx="2" />
      <path d="M18 37 V54 H46 V37 Q46 34 43 34 H21 Q18 34 18 37 Z" />
      <line x1="24" y1="44" x2="24" y2="54" />
      <line x1="32" y1="44" x2="32" y2="54" />
      <line x1="40" y1="44" x2="40" y2="54" />
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
