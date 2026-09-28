# Glossary — Workspace Configurator

Shared vocabulary. All terms below are **decided**.

- **Workspace** — The products a user is composing and renting. Rental data: *what* is rented.
- **Product** — A rentable item: `id`, `name`, `category`, `pricePerMonth`, `image` (inline SVG component), `layout`.
- **Category** — Class of a Product: `desk` | `chair` | `monitor` | `lamp` | `plant`.
- **Selection** — The chosen Product in a single-slot category (desk, chair, lamp, plant).
- **Quantity** — Copies of a Product. Only monitors (0–3).
- **Required product** — Blocks rental if missing: `desk`, `chair`.
- **Accessory** — Optional: monitors, lamp, plant.
- **Monthly rental** — Sum of `pricePerMonth` for every selected product. The headline number.
- **Scene** — Visual composition derived from the Workspace. Adds placement.
- **Anchor** — Named attachment point in the Scene: `floor`, `desk-surface`, `wall`.
- **Slot** — Concrete position under an Anchor, e.g. `desk-surface:monitor[0..2]`.
- **Layer / z-order** — Paint order: background → plant → desk → lamp → monitor → chair.
- **Term** — Rental duration in months: 1, 3, 6, or 12.
- **Coupon** — Code typed in the summary that discounts the term total by a percentage. Sample codes are hardcoded.
- **Rent** — The commit action. Mocked: no payment or backend.
- **Confirmation** — Success state after Rent, with a generated reference.
