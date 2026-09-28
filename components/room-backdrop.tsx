/**
 * The room is drawn once, behind every product. Product layers are positioned
 * with percentages that map directly onto this 800x600 viewBox.
 */
export function RoomBackdrop() {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="room-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FCF5EA" />
          <stop offset="1" stopColor="#F0E1CE" />
        </linearGradient>
        <linearGradient id="room-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E6CBA8" />
          <stop offset="1" stopColor="#D2AD83" />
        </linearGradient>
        <linearGradient id="room-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ED3D8" />
          <stop offset="1" stopColor="#FBE3C4" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="345" fill="url(#room-wall)" />
      <rect x="0" y="345" width="800" height="255" fill="url(#room-floor)" />
      <g stroke="#C29A6E" strokeWidth="2" opacity="0.35">
        <line x1="0" y1="410" x2="800" y2="410" />
        <line x1="0" y1="480" x2="800" y2="480" />
        <line x1="0" y1="550" x2="800" y2="550" />
      </g>
      <rect x="0" y="337" width="800" height="10" fill="#C9A778" />

      <ellipse cx="410" cy="470" rx="240" ry="46" fill="#D9684B" opacity="0.16" />

      <g>
        <rect x="486" y="54" width="250" height="220" rx="14" fill="#E7D3B8" />
        <rect x="498" y="66" width="226" height="196" rx="8" fill="url(#room-sky)" />
        <circle cx="662" cy="120" r="26" fill="#FFE9B0" />
        <g fill="#4E8F6B" opacity="0.9">
          <path d="M516 252 C540 208 562 198 596 194 C562 216 548 232 536 252 Z" />
          <path d="M516 252 C542 224 566 222 598 228 C566 238 544 242 534 252 Z" />
        </g>
        <rect x="607" y="66" width="8" height="196" fill="#E7D3B8" />
        <rect x="498" y="160" width="226" height="8" fill="#E7D3B8" />
      </g>

      <ellipse cx="612" cy="300" rx="150" ry="24" fill="#000000" opacity="0.05" />
    </svg>
  );
}
