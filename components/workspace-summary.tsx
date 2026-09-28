"use client";

import {
  calculateMonthlyPrice,
  canRent,
  countItems,
  formatUsd,
  workspaceLines,
} from "@/lib/pricing";
import { TERMS } from "@/lib/types";
import type { Term, WorkspaceState } from "@/lib/types";

export function WorkspaceSummary({
  state,
  onSetTerm,
  onRent,
}: {
  state: WorkspaceState;
  onSetTerm: (term: Term) => void;
  onRent: () => void;
}) {
  const { workspace, term } = state;
  const monthly = calculateMonthlyPrice(workspace);
  const items = countItems(workspace);
  const rentable = canRent(workspace);
  const lines = workspaceLines(workspace);

  return (
    <aside
      aria-label="Your workspace summary"
      className="rounded-3xl bg-ink p-5 text-cream shadow-sm"
    >
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-cream/60">
        Your workspace
      </h2>

      {items === 0 ? (
        <p className="mt-4 text-sm text-cream/70">
          Nothing selected yet. Start with a desk and chair.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {lines.map((line) => (
            <li
              key={line.id}
              className="flex items-baseline justify-between gap-4 text-sm"
            >
              <span className="text-cream/85">{line.label}</span>
              <span className="font-medium tabular-nums text-cream">
                {formatUsd(line.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-baseline justify-between border-t border-white/15 pt-4">
        <span className="text-sm text-cream/70">Monthly rental</span>
        <span
          key={monthly}
          className="animate-pop text-2xl font-bold tabular-nums text-white"
        >
          {formatUsd(monthly)}
        </span>
      </div>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold uppercase tracking-wide text-cream/60">
          Rental term
        </legend>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {TERMS.map((option) => {
            const active = option === term;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onSetTerm(option)}
                aria-pressed={active}
                className={`rounded-xl px-2 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
                  active
                    ? "bg-teal text-white"
                    : "bg-white/10 text-cream/80 hover:bg-white/20"
                }`}
              >
                {option}mo
              </button>
            );
          })}
        </div>
        {monthly > 0 && (
          <p className="mt-2 text-xs text-cream/55">
            {formatUsd(monthly * term)} over {term} month
            {term === 1 ? "" : "s"}
          </p>
        )}
      </fieldset>

      <div className="mt-4 flex items-baseline justify-between border-t border-white/15 pt-4">
        <span className="text-sm text-cream/70">Total rentals</span>
        <span
          key={monthly}
          className="animate-pop text-2xl font-bold tabular-nums text-white"
        >
          {formatUsd(monthly * term)}
        </span>
      </div>

      {!rentable && (
        <p
          id="rent-requirement"
          role="status"
          className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-xs text-cream/85"
        >
          Choose a desk and chair to continue.
        </p>
      )}

      <button
        type="button"
        onClick={onRent}
        disabled={!rentable}
        aria-describedby={rentable ? undefined : "rent-requirement"}
        className="mt-4 w-full rounded-2xl bg-gold px-4 py-3 text-sm font-bold text-ink transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-cream/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Rent this workspace →
      </button>
    </aside>
  );
}
