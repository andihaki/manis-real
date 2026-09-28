# ADR 0001 — Layered 2D SVG scene (no 3D, no canvas)

- **Status:** Accepted · 2026-09-28

## Context

Brief wants a visual, playful "see it come to life" experience. No assets exist in the repo. Timebox: 4–6 hours. The original plan allowed no Three.js/Konva/WebGL and no free-form positioning.

## Decision

- One scene container with a fixed aspect ratio.
- Room (wall + floor) drawn as CSS gradients + simple SVG — no raster background.
- **8 products** authored as inline SVG React components in one flat, consistent palette and pseudo-isometric style.
- Products positioned by category/slot using CSS percentages + `z-index`. No drag, no free positioning.
- Motion via CSS transitions only (no Framer Motion).

## Consequences

- No dependencies, fast to build, accessible, testable via DOM.
- Fidelity is limited by hand-authored art; the whole experience depends on the SVGs sharing one style. This is the highest-risk task, so it is scheduled first.
