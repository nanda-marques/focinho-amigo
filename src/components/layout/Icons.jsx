// Ícones SVG compartilhados entre as páginas.
// Todos herdam a cor do elemento pai via currentColor.

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const make = (paths) =>
  function Icon({ className = "h-5 w-5" }) {
    return (
      <svg {...base} className={className}>
        {paths}
      </svg>
    );
  };

// Ícones gerais
export const IconHome = make(
  <>
    <path d="m3 10 9-7 9 7" />
    <path d="M5 9v12h14V9" />
    <path d="M9 21v-8h6v8" />
  </>
);

export const IconHeart = make(
  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
);

export const IconGift = make(
  <>
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M12 8v13M3 12h18M12 8H7.5a2.5 2.5 0 1 1 2.5-2.5V8Zm0 0h4.5A2.5 2.5 0 1 0 14 5.5V8Z" />
  </>
);

export const IconUsers = make(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="10" cy="7" r="4" />
    <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </>
);

export const IconStar = make(
  <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
);

export const IconShare = make(
  <>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.4" />
  </>
);

export const IconTruck = make(
  <>
    <path d="M3 6h11v12H3zM14 10h4l3 4v4h-7z" />
    <circle cx="7.5" cy="19" r="1.5" />
    <circle cx="17.5" cy="19" r="1.5" />
  </>
);

// Ícones de formulário e ações
export const IconDoc = make(
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6M8 13h8M8 17h8" />
  </>
);

export const IconCheck = make(
  <path d="m5 12 4 4L19 6" />
);

export const IconCheckCircle = make(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m8 12 3 3 5-6" />
  </>
);

export const IconClose = make(
  <path d="m18 6-12 12M6 6l12 12" />
);

export const IconChevronLeft = make(
  <path d="m15 18-6-6 6-6" />
);

export const IconChevronRight = make(
  <path d="m9 18 6-6-6-6" />
);

// Ícones relacionados à saúde e aos animais
export const IconSyringe = make(
  <>
    <path d="m18 2 4 4M17 7l-8 8M14 4l6 6M8 16l-4 4M3 21l4-4M5 13l6 6" />
    <path d="m3 21 2-2" />
  </>
);

export const IconPill = make(
  <>
    <path d="M10.5 20.5a7.5 7.5 0 0 1-7-7L13.5 3.5a7.5 7.5 0 0 1 7 7L10.5 20.5Z" />
    <path d="m7 7 10 10" />
  </>
);

export const IconScissors = make(
  <>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="m8.1 8.1 12 12M14.8 9.2 20 4M8.1 15.9 12 12" />
  </>
);

export const IconChip = make(
  <>
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <path d="M9 9h6v6H9zM9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
  </>
);

export const IconPaw = make(
  <>
    <ellipse cx="12" cy="15" rx="5" ry="4" />
    <ellipse cx="5" cy="9" rx="2" ry="3" />
    <ellipse cx="10" cy="5" rx="2" ry="3" />
    <ellipse cx="16" cy="5" rx="2" ry="3" />
    <ellipse cx="20" cy="9" rx="2" ry="3" />
  </>
);