# ADR 0002 — Rental state drives a derived scene layout

- **Status:** Accepted · 2026-09-28

## Context

A flat `Workspace` record says *what* is rented but not *where*. Rendering `monitors.map(img)` stacks monitors at one point.

## Decision

- **Rental model:** `{ desk, chair, monitors[], lamp, plant, beanBag, coffeeStation }` + quantities. Drives price and validation.
- **Scene layout:** derived from the rental model. Each category maps to a fixed anchor; monitors fill up to 3 fixed monitor slots. Layout coordinates live in the catalog data, not components.
- Fixed catalog: 3 desks, 2 chairs, 1 monitor (qty 0–3), 1 lamp, 1 plant, 1 bean bag, 1 coffee station. Every product is compatible with every other.

## Consequences

- Monitors never overlap; no per-product bespoke components.
- Adding a category later is a data change, not a rewrite.

## Amendment — 2026-09-28

Bean Bag and Coffee Station were added as two more single-slot accessory categories. The change held to the consequence above: new catalog entries, two new `Workspace` slots and toggle actions, two new SVG components, and one extra row of Extras toggles. No existing component's structure changed, and the layer order became `background → plant → coffee station → desk → lamp → monitor → bean bag → chair`.
