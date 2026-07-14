export default function MapPin() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="94" fill="#2A2120" />
      <g stroke="#4a3c39" strokeWidth="1.4">
        <path d="M10 70h180M10 130h180" />
        <path d="M60 10v180M140 10v180" />
      </g>
      <path
        d="M100 45c-24 0-42 18-42 41 0 30 42 69 42 69s42-39 42-69c0-23-18-41-42-41Z"
        fill="url(#pinGrad)"
      />
      <circle cx="100" cy="86" r="15" fill="#2A2120" />
      <defs>
        <linearGradient id="pinGrad" x1="58" y1="45" x2="142" y2="155" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8A0A8" />
          <stop offset="1" stopColor="#C9A063" />
        </linearGradient>
      </defs>
    </svg>
  );
}
