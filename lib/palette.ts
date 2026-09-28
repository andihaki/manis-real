/**
 * One shared flat palette keeps the eight products looking like one set.
 * Both the 2D SVG art and the 3D geometry import it, so the two views cannot
 * drift apart on colour.
 */
export const palette = {
  oak: "#D9A46B",
  oakLight: "#E7BC8C",
  timber: "#A9713F",
  timberLight: "#C08A55",
  walnut: "#7C4A2D",
  walnutMid: "#8A5533",
  walnutDark: "#5E3620",
  drawer: "#6E4026",
  metal: "#7A828C",
  metalDark: "#5A6169",
  mesh: "#8FA0AC",
  charcoal: "#2E3A42",
  slate: "#46545E",
  teal: "#2A9D8F",
  tealDark: "#1F7A70",
  tealLight: "#3FB3A3",
  moss: "#5B8C51",
  mossDark: "#3F6B39",
  terracotta: "#D9684B",
  terracottaLight: "#E27F63",
  gold: "#F2B544",
  screen: "#12314A",
  screenGlare: "#1E4E73",
  glow: "#FFE7A8",
  shadow: "rgba(35, 48, 58, 0.10)",
} as const;
