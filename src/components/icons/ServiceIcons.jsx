const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function HairStylingIcon() {
  return (
    <svg {...common}>
      <path d="M6 3c-2 3-2 7 0 10 1.3 1.9 1.3 4-.5 6" />
      <path d="M12 3c-2 3-2 7 0 10 1.3 1.9 1.3 4-.5 6" />
      <path d="M18 3c-2 3-2 7 0 10 1.3 1.9 1.3 4-.5 6" />
    </svg>
  );
}

function ManicureIcon() {
  return (
    <svg {...common}>
      <path d="M9 2h6l-1 5H10L9 2Z" />
      <path d="M9 7h6l1 12a2 2 0 0 1-2 3H10a2 2 0 0 1-2-3l1-12Z" />
      <path d="M9.5 12h5" />
    </svg>
  );
}

function MakeupIcon() {
  return (
    <svg {...common}>
      <circle cx="9" cy="9" r="5.5" />
      <path d="M14 13.5 20 19.5" />
      <path d="M17.5 17 21 20.5" strokeWidth="2.2" />
      <path d="M9 6.5v5M6.5 9h5" />
    </svg>
  );
}

function HairColorIcon() {
  return (
    <svg {...common}>
      <path d="M8 3h8l1 4H7l1-4Z" />
      <path d="M7 7h10l-.8 11a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 7Z" />
      <path d="M9 11c1 1.3 1 2.7 0 4M12 11c1 1.3 1 2.7 0 4M15 11c1 1.3 1 2.7 0 4" />
    </svg>
  );
}

function EyebrowIcon() {
  return (
    <svg {...common}>
      <path d="M3.5 10c2-3.5 6-5.5 9-5.5s6.5 2 8 5" />
      <path d="M13 15.5 20 8" />
      <path d="M17.5 8.5 21 7l-1 3.6" />
    </svg>
  );
}

export const SERVICE_ICONS = {
  'soch-turmagi': <HairStylingIcon />,
  manikyur: <ManicureIcon />,
  pardoz: <MakeupIcon />,
  'soch-boyash': <HairColorIcon />,
  'qosh-korreksiyasi': <EyebrowIcon />,
  default: <MakeupIcon />,
};
