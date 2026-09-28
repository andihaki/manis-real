# Workspace Configurator — 5-Hour Plan

## Goal

A single Next.js page where a Bali-based nomad picks a desk, chair, monitors, lamp, and plant, watches the scene update instantly, sees a monthly price, and hits Rent. It must feel like _designing a workspace_, not browsing a catalog.

## Locked decisions

See `docs/adr/` (0001 scene, 0002 state/layout, 0003 rental flow) and `docs/glossary.md`.
Stack: existing Next.js 16 App Router app, Tailwind v4, TypeScript. **No new runtime dependencies.**

## Catalog — 8 products

| #   | Product         | Category | $/mo | Qty |
| --- | --------------- | -------- | ---- | --- |
| 1   | Minimal Desk    | desk     | 80   | 1   |
| 2   | Standing Desk   | desk     | 120  | 1   |
| 3   | Executive Desk  | desk     | 160  | 1   |
| 4   | Mesh Chair      | chair    | 60   | 1   |
| 5   | Ergonomic Chair | chair    | 80   | 1   |
| 6   | 27" Monitor     | monitor  | 30   | 0–3 |
| 7   | Desk Lamp       | lamp     | 15   | 1   |
| 8   | Potted Plant    | plant    | 10   | 1   |

Scene layout (percentages of a 4:3 container), z-order `background → plant → desk → lamp → monitor → chair`:

- desk: centered, `bottom ~34%`, `width ~62%`
- monitor slots: `x = 34% / 50% / 66%`, `top ~30%`
- lamp: desk right, `x ~78%`, `top ~36%`
- chair: centered, `bottom ~10%`, `width ~26%`
- plant: floor right or left, `bottom ~12%`, `width ~14%`

Layout coordinates live in the catalog data, so components stay generic.

## Scope

**In:** catalog + selection, live scene, monitor quantity, lamp/plant toggle, price, required-item validation, term selector, confirm → success, reset, mobile stack, keyboard/a11y, CSS transitions.

**Out (cut list):** Framer Motion, drag reorder, free positioning, start/delivery date, product variants, dark mode, persistence, preset bundles, multiple accessories, real payment/backend, 3D/canvas.

## Tasks (P0 ≈ 4h45 + buffer)

### Phase 1 — Foundation (~40 min)

- **T1 (20)** `types/product.ts` + `data/products.ts`: 8 products with `layout`, plus monitor slot config.
- **T2 (20)** `utils/pricing.ts` (`calculateMonthlyPrice`, `countItems`) + `hooks/useWorkspace.ts` reducer: `SELECT_DESK`, `SELECT_CHAIR`, `ADD_MONITOR`, `REMOVE_MONITOR`, `TOGGLE_LAMP`, `TOGGLE_PLANT`, `SET_TERM`, `RESET`, `CONFIRM`, `DISMISS`.

### Phase 2 — Scene (riskiest, do early) (~85 min)

- **T3 (15)** `WorkspaceScene` shell: 4:3 container, wall/floor background in CSS+SVG, empty-state nudge.
- **T4 (60)** Author 8 inline SVG product components in one flat palette/style.
- **T5 (10)** Layer products by anchor/slot + z-index; render 0–3 monitors from `monitors[]`.

### Phase 3 — Controls (~55 min)

- **T6 (35)** `ProductSelector` / `ProductCard`: category sections, selected state, qty stepper for monitors, toggle for lamp/plant.
- **T7 (20)** `WorkspaceSummary`: itemized lines, animated monthly total, "Choose a desk and chair to continue." validation.

### Phase 4 — Rent flow (~45 min)

- **T8 (10)** Term selector (1/3/6/12).
- **T9 (35)** Confirm dialog + success state with generated reference and itemized summary.

### Phase 5 — Polish + a11y (~40 min)

- **T10 (15)** CSS transitions: fade/scale-in on add, price feedback, selected-card state.
- **T11 (15)** Responsive: two columns desktop, preview-above-controls on mobile.
- **T12 (10)** A11y: real `<button>`s, `aria-pressed`, visible focus, non-color selected state, `alt` text.

### Phase 6 — Verify (~20 min)

- **T13 (20)** `pnpm lint` + `pnpm build` clean; manual demo pass on desktop and a narrow viewport.

### Stretch (only if ahead)

- Pricing + reducer unit tests (Vitest + RTL).
- Shareable URL state.
- Preset bundles ("Freelancer Starter").

## Minimum lovable demo (if time collapses, ~2h15)

T1, T2, T3, T4 with **6** SVGs, T5, T6, T7, T9 (no term selector), T12. Everything else drops.

## Done criteria

1. Selecting any product updates the scene immediately with a subtle transition.
2. 0–3 monitors appear in distinct slots; lamp/plant toggle on and off; price updates.
3. Rent is gated on desk + chair, with a plain-language reason when blocked.
4. Rent → confirm → success with reference; reset returns to an empty scene.
5. Keyboard-operable and readable at mobile widths.
6. `pnpm lint` and `pnpm build` pass.
