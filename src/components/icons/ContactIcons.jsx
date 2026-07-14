const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function PinIcon() {
  return (
    <svg {...common} className="contact-icon">
      <path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg {...common} className="contact-icon">
      <path d="M4 5c0 8.3 6.7 15 15 15l2-3.5-5-2-1.5 1.8A12.4 12.4 0 0 1 8.7 10.8L10.5 9.3l-2-5L5 4.3Z" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg {...common} className="contact-icon">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}
