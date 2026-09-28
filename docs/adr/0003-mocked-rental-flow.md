# ADR 0003 — Mocked rental flow with term and success state

- **Status:** Accepted · 2026-09-28

## Context

The brief ends at "hit Rent." No backend, payment, auth, or fulfillment is required.

## Decision

- Optional **term** selector (1 / 3 / 6 / 12 months); price stays monthly, term shows the commitment.
- `Rent` opens a confirm dialog listing the itemized workspace.
- `Confirm` shows a success state with a generated reference and a "what happens next" line.
- The Workspace *is* the cart — no separate cart. No persistence, no start-date picker, no payment.
- Rent is enabled only when desk **and** chair are selected; otherwise show "Choose a desk and chair to continue."

## Consequences

- The payoff feels finished without real infrastructure.
- Refresh loses state — acceptable for the timebox.
