"use client";

import {
  calculateMonthlyPrice,
  canRent,
  formatUsd,
  priceSummary,
} from "@/lib/pricing";
import type { WorkspaceState } from "@/lib/types";

export function PriceBar({
  state,
  onRent,
}: {
  state: WorkspaceState;
  onRent: () => void;
}) {
  if (state.status !== "editing") return null;

  const { term } = state;
  const monthly = calculateMonthlyPrice(state.workspace);
  const { coupon: applied, subtotal, discount, total } = priceSummary(
    monthly,
    term,
    state.coupon,
  );
  const rentable = canRent(state.workspace);

  return (
    <div
      role="region"
      aria-label="Running total"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-ink pb-[env(safe-area-inset-bottom)] text-cream shadow-[0_-6px_20px_rgba(0,0,0,0.18)]"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="flex items-baseline gap-2">
            <span className="shrink-0 text-xs text-cream/60">
              Total {term} month{term === 1 ? "" : "s"}
            </span>
            {discount > 0 && (
              <span className="text-xs tabular-nums text-cream/45 line-through">
                {formatUsd(subtotal)}
              </span>
            )}
            <span
              key={total}
              className="animate-pop text-xl font-bold tabular-nums text-white"
            >
              {formatUsd(total)}
            </span>
          </p>
          <p className="truncate text-xs text-cream/55">
            {rentable ? (
              <>
                {formatUsd(monthly)}/mo
                {applied && (
                  <span className="text-teal">
                    {" "}
                    · {applied.code} {applied.label}
                  </span>
                )}
              </>
            ) : (
              <span id="price-bar-requirement">
                Choose a desk and chair to continue.
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onRent}
          disabled={!rentable}
          aria-describedby={rentable ? undefined : "price-bar-requirement"}
          className="shrink-0 rounded-2xl bg-gold px-4 py-2.5 text-sm font-bold text-ink transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-cream/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Rent this workspace →
        </button>
      </div>
    </div>
  );
}
