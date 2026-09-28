import { palette } from "@/lib/palette";
import type { Product } from "@/lib/types";

const svgProps = {
  preserveAspectRatio: "xMidYMax meet",
  className: "h-full w-full",
  "aria-hidden": true,
  focusable: false,
} as const;

function MinimalDesk() {
  return (
    <svg viewBox="0 0 300 160" {...svgProps}>
      <ellipse cx="150" cy="150" rx="124" ry="8" fill={palette.shadow} />
      <rect x="18" y="30" width="264" height="16" rx="8" fill={palette.oak} />
      <rect
        x="18"
        y="30"
        width="264"
        height="6"
        rx="3"
        fill={palette.oakLight}
      />
      <rect x="34" y="46" width="9" height="98" rx="4" fill={palette.metal} />
      <rect x="257" y="46" width="9" height="98" rx="4" fill={palette.metal} />
      <rect
        x="34"
        y="108"
        width="232"
        height="7"
        rx="3"
        fill={palette.metalDark}
      />
    </svg>
  );
}

function StandingDesk() {
  return (
    <svg viewBox="0 0 300 170" {...svgProps}>
      <ellipse cx="150" cy="160" rx="122" ry="8" fill={palette.shadow} />
      <rect
        x="16"
        y="28"
        width="268"
        height="15"
        rx="7"
        fill={palette.timber}
      />
      <rect
        x="16"
        y="28"
        width="268"
        height="5"
        rx="3"
        fill={palette.timberLight}
      />
      <rect x="48" y="43" width="22" height="72" rx="5" fill={palette.metal} />
      <rect
        x="54"
        y="112"
        width="10"
        height="34"
        rx="4"
        fill={palette.metalDark}
      />
      <rect x="230" y="43" width="22" height="72" rx="5" fill={palette.metal} />
      <rect
        x="236"
        y="112"
        width="10"
        height="34"
        rx="4"
        fill={palette.metalDark}
      />
      <rect
        x="28"
        y="146"
        width="56"
        height="9"
        rx="4"
        fill={palette.charcoal}
      />
      <rect
        x="216"
        y="146"
        width="56"
        height="9"
        rx="4"
        fill={palette.charcoal}
      />
      <rect
        x="196"
        y="50"
        width="28"
        height="12"
        rx="3"
        fill={palette.charcoal}
      />
      <circle cx="204" cy="56" r="2" fill={palette.gold} />
      <circle cx="212" cy="56" r="2" fill={palette.metal} />
    </svg>
  );
}

function ExecutiveDesk() {
  return (
    <svg viewBox="0 0 300 160" {...svgProps}>
      <ellipse cx="150" cy="150" rx="128" ry="8" fill={palette.shadow} />
      <rect
        x="14"
        y="30"
        width="272"
        height="18"
        rx="7"
        fill={palette.walnut}
      />
      <rect
        x="14"
        y="30"
        width="272"
        height="6"
        rx="3"
        fill={palette.walnutMid}
      />
      <rect
        x="26"
        y="48"
        width="22"
        height="96"
        rx="5"
        fill={palette.walnutDark}
      />
      <rect
        x="252"
        y="48"
        width="22"
        height="96"
        rx="5"
        fill={palette.walnutDark}
      />
      <rect
        x="58"
        y="54"
        width="96"
        height="44"
        rx="5"
        fill={palette.walnutMid}
      />
      <rect x="66" y="64" width="80" height="24" rx="3" fill={palette.drawer} />
      <rect x="70" y="73" width="28" height="5" rx="2" fill={palette.gold} />
    </svg>
  );
}

function MeshChair() {
  return (
    <svg viewBox="0 0 160 240" {...svgProps}>
      <ellipse cx="80" cy="230" rx="58" ry="7" fill={palette.shadow} />
      <rect
        x="36"
        y="14"
        width="88"
        height="106"
        rx="20"
        fill={palette.charcoal}
      />
      <rect x="44" y="22" width="72" height="90" rx="15" fill={palette.slate} />
      <g stroke={palette.mesh} strokeWidth="2" opacity="0.45">
        <line x1="54" y1="32" x2="54" y2="102" />
        <line x1="66" y1="28" x2="66" y2="106" />
        <line x1="78" y1="26" x2="78" y2="108" />
        <line x1="90" y1="28" x2="90" y2="106" />
        <line x1="102" y1="32" x2="102" y2="102" />
      </g>
      <rect x="22" y="104" width="12" height="32" rx="6" fill={palette.slate} />
      <rect
        x="126"
        y="104"
        width="12"
        height="32"
        rx="6"
        fill={palette.slate}
      />
      <rect
        x="24"
        y="122"
        width="112"
        height="22"
        rx="10"
        fill={palette.charcoal}
      />
      <rect x="75" y="144" width="10" height="40" rx="4" fill={palette.metal} />
      <g stroke={palette.metal} strokeWidth="7" strokeLinecap="round">
        <line x1="80" y1="184" x2="42" y2="212" />
        <line x1="80" y1="184" x2="118" y2="212" />
        <line x1="80" y1="184" x2="80" y2="216" />
        <line x1="80" y1="184" x2="56" y2="222" />
        <line x1="80" y1="184" x2="104" y2="222" />
      </g>
      <g fill={palette.charcoal}>
        <circle cx="42" cy="214" r="6" />
        <circle cx="118" cy="214" r="6" />
        <circle cx="80" cy="218" r="6" />
        <circle cx="56" cy="224" r="6" />
        <circle cx="104" cy="224" r="6" />
      </g>
    </svg>
  );
}

function ErgonomicChair() {
  return (
    <svg viewBox="0 0 170 250" {...svgProps}>
      <ellipse cx="85" cy="240" rx="60" ry="7" fill={palette.shadow} />
      <rect
        x="58"
        y="8"
        width="54"
        height="24"
        rx="11"
        fill={palette.charcoal}
      />
      <rect
        x="34"
        y="34"
        width="102"
        height="106"
        rx="22"
        fill={palette.charcoal}
      />
      <rect x="42" y="42" width="86" height="90" rx="17" fill={palette.slate} />
      <rect x="52" y="106" width="66" height="16" rx="8" fill={palette.teal} />
      <rect x="22" y="118" width="14" height="36" rx="7" fill={palette.slate} />
      <rect
        x="134"
        y="118"
        width="14"
        height="36"
        rx="7"
        fill={palette.slate}
      />
      <rect
        x="22"
        y="146"
        width="126"
        height="24"
        rx="11"
        fill={palette.charcoal}
      />
      <rect x="80" y="170" width="10" height="42" rx="4" fill={palette.metal} />
      <g stroke={palette.metal} strokeWidth="7" strokeLinecap="round">
        <line x1="85" y1="212" x2="45" y2="238" />
        <line x1="85" y1="212" x2="125" y2="238" />
        <line x1="85" y1="212" x2="85" y2="244" />
        <line x1="85" y1="212" x2="60" y2="248" />
        <line x1="85" y1="212" x2="110" y2="248" />
      </g>
      <g fill={palette.charcoal}>
        <circle cx="45" cy="240" r="6" />
        <circle cx="125" cy="240" r="6" />
        <circle cx="85" cy="246" r="6" />
        <circle cx="60" cy="250" r="6" />
        <circle cx="110" cy="250" r="6" />
      </g>
    </svg>
  );
}

function Monitor() {
  return (
    <svg viewBox="0 0 210 180" {...svgProps}>
      <rect
        x="12"
        y="8"
        width="186"
        height="118"
        rx="10"
        fill={palette.charcoal}
      />
      <rect
        x="20"
        y="16"
        width="170"
        height="102"
        rx="6"
        fill={palette.screen}
      />
      <path
        d="M20 96 L120 16 L162 16 L20 78 Z"
        fill={palette.screenGlare}
        opacity="0.55"
      />
      <rect x="96" y="126" width="18" height="26" fill={palette.metalDark} />
      <rect x="58" y="152" width="94" height="12" rx="6" fill={palette.metal} />
    </svg>
  );
}

function StandingLamp() {
  return (
    <svg viewBox="0 0 110 460" {...svgProps}>
      <ellipse cx="55" cy="452" rx="42" ry="7" fill={palette.shadow} />
      <ellipse cx="55" cy="442" rx="32" ry="9" fill={palette.charcoal} />
      <ellipse cx="55" cy="438" rx="22" ry="6" fill={palette.slate} />
      <rect
        x="52"
        y="78"
        width="6"
        height="362"
        rx="3"
        fill={palette.charcoal}
      />
      <rect x="48" y="300" width="14" height="5" rx="2" fill={palette.slate} />
      <circle cx="55" cy="330" r="5" fill={palette.gold} />
      <path d="M28 24 L82 24 L94 78 L16 78 Z" fill={palette.terracotta} />
      <rect
        x="30"
        y="16"
        width="50"
        height="9"
        rx="4"
        fill={palette.terracottaLight}
      />
      <ellipse cx="55" cy="74" rx="32" ry="10" fill={palette.glow} />
    </svg>
  );
}

function PottedPlant() {
  return (
    <svg viewBox="0 0 140 210" {...svgProps}>
      <ellipse cx="70" cy="198" rx="40" ry="7" fill={palette.shadow} />
      <g fill={palette.moss}>
        <path d="M70 150 C70 110 52 92 40 70 C62 76 72 100 70 150 Z" />
        <path d="M70 150 C70 108 90 92 102 68 C80 74 70 100 70 150 Z" />
      </g>
      <g fill={palette.mossDark}>
        <path d="M70 152 C70 120 88 112 108 104 C96 128 84 136 70 152 Z" />
        <path d="M70 152 C70 120 52 112 32 104 C44 128 56 136 70 152 Z" />
      </g>
      <path
        d="M70 152 C70 118 70 96 70 74"
        stroke={palette.mossDark}
        strokeWidth="3"
        fill="none"
      />
      <path d="M38 148 L102 148 L92 196 L48 196 Z" fill={palette.terracotta} />
      <rect
        x="33"
        y="138"
        width="74"
        height="16"
        rx="6"
        fill={palette.terracottaLight}
      />
    </svg>
  );
}

/** Slumped floor cushion: wide base, dip in the middle where you sink in. */
function BeanBag() {
  return (
    <svg viewBox="0 0 150 130" {...svgProps}>
      <ellipse cx="75" cy="120" rx="58" ry="8" fill={palette.shadow} />
      <path
        d="M16 114 C6 104 4 78 16 58 C26 38 42 24 55 26 C66 28 72 36 75 42 C78 36 84 28 95 26 C108 24 124 38 134 58 C146 78 144 104 134 114 C112 120 38 120 16 114 Z"
        fill={palette.teal}
      />
      <path
        d="M40 60 C44 42 54 32 62 33 C69 34 73 38 75 42 C77 38 81 34 88 33 C96 32 106 42 110 60 C104 50 92 44 75 44 C58 44 46 50 40 60 Z"
        fill={palette.tealLight}
      />
      <path
        d="M18 106 C44 112 106 112 132 106"
        stroke={palette.tealDark}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M30 92 C48 98 102 98 120 92"
        stroke={palette.tealDark}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

/** Two-tier cart: brewer on top, grinder and mugs below. */
function CoffeeStation() {
  return (
    <svg viewBox="0 0 130 240" {...svgProps}>
      <ellipse cx="65" cy="232" rx="48" ry="7" fill={palette.shadow} />
      <rect
        x="8"
        y="32"
        width="8"
        height="178"
        rx="4"
        fill={palette.charcoal}
      />
      <rect
        x="114"
        y="32"
        width="8"
        height="178"
        rx="4"
        fill={palette.charcoal}
      />
      <circle cx="20" cy="222" r="7" fill={palette.charcoal} />
      <circle cx="110" cy="222" r="7" fill={palette.charcoal} />
      <rect x="4" y="206" width="124" height="8" rx="4" fill={palette.metal} />
      <rect x="4" y="128" width="124" height="8" rx="4" fill={palette.metal} />
      <rect x="28" y="190" width="20" height="16" rx="3" fill={palette.glow} />
      <path
        d="M48 195 q7 0 7 5 t-7 5"
        stroke={palette.glow}
        strokeWidth="3"
        fill="none"
      />
      <rect
        x="58"
        y="190"
        width="20"
        height="16"
        rx="3"
        fill={palette.terracotta}
      />
      <path
        d="M78 195 q7 0 7 5 t-7 5"
        stroke={palette.terracotta}
        strokeWidth="3"
        fill="none"
      />
      <rect x="4" y="34" width="124" height="12" rx="6" fill={palette.walnut} />
      <rect
        x="4"
        y="34"
        width="124"
        height="4"
        rx="2"
        fill={palette.walnutMid}
      />
      <rect x="30" y="6" width="44" height="28" rx="6" fill={palette.slate} />
      <rect x="36" y="14" width="32" height="7" rx="3" fill={palette.metal} />
      <rect
        x="54"
        y="21"
        width="4"
        height="8"
        rx="2"
        fill={palette.metalDark}
      />
      <rect x="44" y="26" width="24" height="8" rx="2" fill={palette.screen} />
      <circle cx="34" cy="27" r="3" fill={palette.gold} />
      <rect x="84" y="20" width="14" height="14" rx="3" fill={palette.glow} />
      <path
        d="M98 24 q6 0 6 4 t-6 4"
        stroke={palette.glow}
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M91 16 C87 10 95 8 91 2"
        stroke={palette.glow}
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      <path d="M46 88 L74 88 L68 114 L52 114 Z" fill={palette.metal} />
      <rect x="44" y="82" width="32" height="6" rx="3" fill={palette.slate} />
      <circle cx="60" cy="81" r="3" fill={palette.gold} />
      <rect
        x="50"
        y="112"
        width="20"
        height="16"
        rx="3"
        fill={palette.charcoal}
      />
    </svg>
  );
}

export function ProductArt({ product }: { product: Product }) {
  switch (product.id) {
    case "minimal-desk":
      return <MinimalDesk />;
    case "standing-desk":
      return <StandingDesk />;
    case "executive-desk":
      return <ExecutiveDesk />;
    case "mesh-chair":
      return <MeshChair />;
    case "ergonomic-chair":
      return <ErgonomicChair />;
    case "monitor":
      return <Monitor />;
    case "standing-lamp":
      return <StandingLamp />;
    case "potted-plant":
      return <PottedPlant />;
    case "bean-bag":
      return <BeanBag />;
    case "coffee-station":
      return <CoffeeStation />;
    default:
      return null;
  }
}
