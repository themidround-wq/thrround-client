// Lucide-style line icons for the app (24px grid, round caps), drawn inline so
// there's no icon dependency. Size and colour come from className.
import type { ReactNode, SVGProps } from "react";
import type { CategoryId } from "@/lib/practice/types";

type P = { className?: string; strokeWidth?: number };

function Svg({ className, strokeWidth = 1.8, children, ...rest }: P & { children: ReactNode } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className} {...rest}>
      {children}
    </svg>
  );
}

export const PlusIcon = (p: P) => <Svg {...p}><path d="M5 12h14M12 5v14" /></Svg>;
export const MenuIcon = (p: P) => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>;
export const XIcon = (p: P) => <Svg {...p}><path d="M18 6 6 18M6 6l12 12" /></Svg>;
export const ArrowUpIcon = (p: P) => <Svg {...p}><path d="m5 12 7-7 7 7M12 19V5" /></Svg>;
export const ArrowRightIcon = (p: P) => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const ArrowLeftIcon = (p: P) => <Svg {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>;
export const CheckIcon = (p: P) => <Svg {...p}><path d="M20 6 9 17l-5-5" /></Svg>;
export const ChevronDownIcon = (p: P) => <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>;
export const ShuffleIcon = (p: P) => (
  <Svg {...p}>
    <path d="m18 14 4 4-4 4M18 2l4 4-4 4" />
    <path d="M2 18h2a4 4 0 0 0 3.3-1.7l5.4-7.6A4 4 0 0 1 16 7h6M2 6h2a4 4 0 0 1 3.6 2.2M22 18h-6a4 4 0 0 1-3.3-1.8l-.4-.5" />
  </Svg>
);
export const MicIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
  </Svg>
);
export const PlayIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l11.6-7.2a1 1 0 0 0 0-1.72L8.5 3.94A1 1 0 0 0 7 4.8Z" fill="currentColor" />
  </svg>
);
export const PauseIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <rect x="6" y="4" width="4" height="16" rx="1.2" fill="currentColor" />
    <rect x="14" y="4" width="4" height="16" rx="1.2" fill="currentColor" />
  </svg>
);
export const PencilIcon = (p: P) => (
  <Svg {...p}>
    <path d="M21.17 6.81a1 1 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5zM15 5l4 4" />
  </Svg>
);
export const TrashIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
  </Svg>
);
export const RotateIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5" />
  </Svg>
);
export const SparkleIcon = (p: P) => (
  <Svg {...p}>
    <path d="M10 15.5a2 2 0 0 0-1.4-1.4L3.4 12.6a.5.5 0 0 1 0-1L8.6 10A2 2 0 0 0 10 8.6l1.5-5.2a.5.5 0 0 1 1 0L14 8.6a2 2 0 0 0 1.4 1.4l5.2 1.5a.5.5 0 0 1 0 1L15.4 14a2 2 0 0 0-1.4 1.4l-1.5 5.2a.5.5 0 0 1-1 0z" />
  </Svg>
);
export const TargetIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="2" />
  </Svg>
);
export const GaugeIcon = (p: P) => <Svg {...p}><path d="m12 14 4-4M3.34 19a10 10 0 1 1 17.32 0" /></Svg>;
export const TrophyIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </Svg>
);
export const AudioLinesIcon = (p: P) => <Svg {...p}><path d="M2 10v3M6 6v11M10 3v18M14 8v7M18 5v13M22 10v3" /></Svg>;
export const FlameIcon = (p: P) => (
  <Svg {...p}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </Svg>
);
export const UserIcon = (p: P) => (
  <Svg {...p}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Svg>
);
export const CapIcon = (p: P) => (
  <Svg {...p}>
    <path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0zM22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
  </Svg>
);
export const BookIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M12 4v16M7 9h2M7 13h2M15 9h2M15 13h2" />
  </Svg>
);
export const CalendarIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
  </Svg>
);
export const CompassIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-1.8 5.41a2 2 0 0 1-1.27 1.27L7.76 16.24l1.8-5.41a2 2 0 0 1 1.27-1.27z" />
  </Svg>
);
export const HourglassIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 22h14M5 2h14M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2" />
  </Svg>
);
export const BadgeIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 21v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />
  </Svg>
);
export const CameraIcon = (p: P) => (
  <Svg {...p}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
    <circle cx="12" cy="13" r="3" />
  </Svg>
);
export const SignOutIcon = (p: P) => <Svg {...p}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l-5-5 5-5M5 12h11" /></Svg>;

/* ---------- Category icons ---------- */

const AnatomyIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="4.5" r="1.8" />
    <path d="M12 8v6M8 9.5l4 1 4-1M9.5 21l2.5-7 2.5 7" />
  </Svg>
);
const LungsIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 3v8M12 11l-2.5 2M12 11l2.5 2" />
    <path d="M8.5 6.5C6 6.5 3 11 3 16c0 2.5 1.2 4 3.3 4 2 0 3.2-1.2 3.2-3.5V8c0-.9-.4-1.5-1-1.5ZM15.5 6.5C18 6.5 21 11 21 16c0 2.5-1.2 4-3.3 4-2 0-3.2-1.2-3.2-3.5V8c0-.9.4-1.5 1-1.5Z" />
  </Svg>
);
const PillIcon = (p: P) => (
  <Svg {...p}>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7ZM8.5 8.5l7 7" />
  </Svg>
);
const StethoscopeIcon = (p: P) => (
  <Svg {...p}>
    <path d="M11 2v2M5 2v2M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1M8 15a6 6 0 0 0 12 0v-3" />
    <circle cx="20" cy="10" r="2" />
  </Svg>
);
const ScanIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M12 7.5 16.5 16h-9z" />
  </Svg>
);
const TimerIcon = (p: P) => (
  <Svg {...p}>
    <path d="M10 2h4M12 14l3-3" />
    <circle cx="12" cy="14" r="8" />
  </Svg>
);
const HeartIcon = (p: P) => (
  <Svg {...p}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M8 11h2l1.2-2 1.6 4 1.2-2h2" />
  </Svg>
);
const BabyIcon = (p: P) => (
  <Svg {...p}>
    <path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
    <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
  </Svg>
);
const CalendarHeartIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="M12 19.5s-3-1.8-3-3.6a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 1.8-3 3.6-3 3.6Z" />
  </Svg>
);
const MonitorPulseIcon = (p: P) => (
  <Svg {...p}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4M6 10h2.5l1.5-2.5 2 5 1.5-2.5H18" />
  </Svg>
);
const SirenIcon = (p: P) => (
  <Svg {...p}>
    <path d="M7 18v-6a5 5 0 1 1 10 0v6M5 21a1 1 0 0 0 1-1v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1a1 1 0 0 0 1 1zM21 12h1M18.5 4.5 18 5M2 12h1M12 2v1M4.93 4.93l.7.7M12 12v6" />
  </Svg>
);
const BandageIcon = (p: P) => (
  <Svg {...p}>
    <rect x="1.5" y="8" width="21" height="8" rx="4" transform="rotate(-45 12 12)" />
    <path d="M10 10h.01M14 14h.01M10 14h.01M14 10h.01" />
  </Svg>
);
const MindIcon = (p: P) => (
  <Svg {...p}>
    <path d="M15 21v-3h2a2 2 0 0 0 2-2v-2.5l2-.8-2-3.7A7 7 0 1 0 7 15.5V21" />
    <path d="M11 7.5a2 2 0 0 1 3.4 1.4 2 2 0 0 1-1.4 3.6h-2a1.5 1.5 0 0 1 0-3" />
  </Svg>
);

const CATEGORY_ICONS: Record<CategoryId, (p: P) => ReactNode> = {
  anatomy: AnatomyIcon,
  physiology: LungsIcon,
  pharmacology: PillIcon,
  fon: StethoscopeIcon,
  antenatal: ScanIcon,
  labour: TimerIcon,
  postnatal: HeartIcon,
  newborn: BabyIcon,
  "family-planning": CalendarHeartIcon,
  medical: MonitorPulseIcon,
  emergency: SirenIcon,
  surgical: BandageIcon,
  "mental-health": MindIcon,
};

export function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  const Icon = CATEGORY_ICONS[id];
  return <Icon className={className} />;
}
