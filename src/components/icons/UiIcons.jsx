const line = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function CalendarIcon(props) {
  return (
    <svg {...line} {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

export function PeopleIcon(props) {
  return (
    <svg {...line} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6" />
      <circle cx="17" cy="8.5" r="2.4" />
      <path d="M15.8 14.2c2.4.4 4.2 2.6 4.2 5.3" />
    </svg>
  );
}

export function ScissorsIcon(props) {
  return (
    <svg {...line} {...props}>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="6" cy="18" r="2.4" />
      <path d="M8 7.5 20 19M8 16.5 20 5" />
    </svg>
  );
}

export function CheckCircleIcon(props) {
  return (
    <svg {...line} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.6 2.6L16 9.5" />
    </svg>
  );
}

export function SendIcon(props) {
  return (
    <svg {...line} {...props}>
      <path d="M21 3 3 10.2l7.5 3L14 20.5 21 3Z" />
      <path d="M10.5 13.2 21 3" />
    </svg>
  );
}

export function StarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M12 3.5l2.4 5.1 5.6.6-4.2 3.8 1.2 5.5L12 15.7l-4.9 2.8 1.1-5.5-4.1-3.8 5.6-.6L12 3.5Z" />
    </svg>
  );
}
