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

export function EaselIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M20 54 L32 14 L44 54" />
      <path d="M14 54 H50" />
      <rect x="22" y="22" width="20" height="16" rx="1" />
      <path d="M48 30 L58 26 L54 38" />
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
