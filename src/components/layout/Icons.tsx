import React from "react";

/** Propriedades padrão de cada ícone SVG. */
const base: React.SVGProps<SVGSVGElement> = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/** Tipo de props aceitas por cada componente de ícone. */
export interface IconProps {
  className?: string;
}

type MakeIcon = (paths: React.ReactNode) => React.FC<IconProps>;

const make: MakeIcon = (paths) => {
  const Component: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
    <svg {...base} className={className}>
      {paths}
    </svg>
  );
  Component.displayName = "Icon";
  return Component;
};

export const IconHome = make(
  <>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M10 21v-6h4v6" />
  </>
);

export const IconHeart = make(
  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
);

export const IconGift = make(
  <>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
  </>
);

export const IconUsers = make(
  <>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
    <path d="M16 4.7a3.5 3.5 0 0 1 0 6.6" />
    <path d="M18 14.3c2 .7 3.5 2.4 3.5 5.7" />
  </>
);

export const IconStar = make(<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />);

export const IconShare = make(
  <>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" />
  </>
);

export const IconTruck = make(
  <>
    <path d="M2 6h11v10H2z" />
    <path d="M13 9h4l3 3v4h-7" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="16.5" cy="17.5" r="1.8" />
  </>
);

export const IconDoc = make(
  <>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4" />
    <path d="M9 12h6M9 16h6" />
  </>
);

export const IconCheck = make(<path d="M4 12.5 9.5 18 20 6.5" />);

export const IconCheckCircle = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 3 3 5-6" />
  </>
);

export const IconClose = make(<path d="M6 6l12 12M18 6 6 18" />);

export const IconChevronLeft = make(<path d="m15 5-7 7 7 7" />);
export const IconChevronRight = make(<path d="m9 5 7 7-7 7" />);

export const IconSyringe = make(
  <>
    <path d="m18 2 4 4" />
    <path d="m17 7 3-3" />
    <path d="M19 9 8.7 19.3a1 1 0 0 1-1.4 0L4.7 16.7a1 1 0 0 1 0-1.4L15 5" />
    <path d="m9 11 4 4M5 19l-3 3M14 4l6 6" />
  </>
);

export const IconPill = make(
  <>
    <path d="m10.5 20.5-7-7a4.9 4.9 0 0 1 7-7l7 7a4.9 4.9 0 0 1-7 7z" />
    <path d="m8.5 8.5 7 7" />
  </>
);

export const IconScissors = make(
  <>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" />
  </>
);

export const IconChip = make(
  <>
    <rect x="6" y="4" width="12" height="16" rx="2" />
    <path d="M9 9h6M9 12h6M9 15h6" />
  </>
);

export const IconMail = make(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </>
);

export const IconInstagram = make(
  <>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" />
  </>
);

export const IconWhatsApp = make(
  <>
    <path d="M3 21l1.65-4.9A9 9 0 1 1 8 19.4L3 21z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-.8.7a3.5 3.5 0 0 1-1.6-1.6l.7-.8-1-2L9 9.5z" />
  </>
);

export const IconFacebook = make(
  <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
);

export const IconTikTok = make(
  <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.3 2.4 1.9 4 4.5 4.2" />
);

export const IconPin = make(
  <>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </>
);

export const IconClock = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>
);

export const IconChevronDown = make(<path d="m5 9 7 7 7-7" />);

export const IconArrowRight = make(<path d="M4 12h16m-6-6 6 6-6 6" />);

export const IconPaw = make(
  <>
    <circle cx="6" cy="10" r="1.6" />
    <circle cx="10" cy="6" r="1.6" />
    <circle cx="14" cy="6" r="1.6" />
    <circle cx="18" cy="10" r="1.6" />
    <path d="M12 12c-3 0-5 2.5-5 4.5 0 1.7 1.5 2.5 3 2.5 1 0 1.5-.5 2-.5s1 .5 2 .5c1.5 0 3-.8 3-2.5 0-2-2-4.5-5-4.5z" />
  </>
);
