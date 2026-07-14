export default function HeroIllustration() {
  return (
    <svg className="hero-illustration" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="160" cy="205" rx="120" ry="18" fill="#F5DDE1" opacity="0.6" />

      <circle cx="70" cy="60" r="46" fill="#F5DDE1" opacity="0.7" />
      <circle cx="250" cy="50" r="34" fill="#ECDCB8" opacity="0.6" />

      <g stroke="#B96B7A" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M160 70c-18-22-52-22-64-2-10 17 4 34 22 34 12 0 20-8 22-16" />
        <path d="M160 70c18-22 52-22 64-2 10 17-4 34-22 34-12 0-20-8-22-16" />
        <path d="M160 70v56" />
      </g>
      <circle cx="160" cy="70" r="7" fill="#D98A98" />

      <g stroke="#C9A063" strokeWidth="2" strokeLinecap="round">
        <path d="M96 150c30-14 98-14 128 0" />
        <path d="M110 168c22-8 78-8 100 0" />
      </g>

      <g fill="#D98A98">
        <circle cx="40" cy="130" r="3.5" />
        <circle cx="280" cy="120" r="3" />
        <circle cx="260" cy="170" r="2.6" />
        <circle cx="55" cy="180" r="2.6" />
      </g>
      <g fill="#C9A063">
        <circle cx="230" cy="40" r="2.6" />
        <circle cx="30" cy="70" r="2.6" />
      </g>
    </svg>
  );
}
