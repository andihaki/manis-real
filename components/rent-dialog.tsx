"use client";

import { useEffect, useRef } from "react";
import {
  calculateMonthlyPrice,
  formatUsd,
  workspaceLines,
} from "@/lib/pricing";
import type { WorkspaceState } from "@/lib/types";

export function RentDialog({
  state,
  onCancel,
  onConfirm,
  onEdit,
}: {
  state: WorkspaceState;
  onCancel: () => void;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  const open = state.status !== "editing";
  const primaryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    primaryRef.current?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  const monthly = calculateMonthlyPrice(state.workspace);
  const lines = workspaceLines(state.workspace);
  const rented = state.status === "rented";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rent-title"
        className="animate-pop w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
      >
        {rented ? (
          <div>
            <p className="text-3xl" aria-hidden="true">
              🎉
            </p>
            <h2 id="rent-title" className="mt-2 text-xl font-bold text-ink">
              Your workspace is on its way
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Reference{" "}
              <span className="font-mono font-semibold text-ink">
                {state.reference}
              </span>
            </p>

            <ul className="mt-4 space-y-1.5 rounded-2xl bg-sand/60 p-4 text-sm">
              {lines.map((line) => (
                <li key={line.id} className="flex justify-between gap-4">
                  <span className="text-ink/80">{line.label}</span>
                  <span className="tabular-nums text-ink/60">
                    {formatUsd(line.amount)}
                  </span>
                </li>
              ))}
              <li className="flex justify-between border-t border-black/10 pt-2 font-semibold">
                <span>Monthly</span>
                <span className="tabular-nums">{formatUsd(monthly)}</span>
              </li>
            </ul>

            <p className="mt-4 text-sm text-ink/70">
              We will email you within one working day to schedule delivery in
              Bali.
            </p>

            <button
              ref={primaryRef}
              type="button"
              onClick={onEdit}
              className="mt-5 w-full rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-cream transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            >
              Keep editing
            </button>
          </div>
        ) : (
          <div>
            <h2 id="rent-title" className="text-xl font-bold text-ink">
              Ready to rent?
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Here is everything in your {state.term}-month workspace.
            </p>

            <ul className="mt-4 space-y-1.5 rounded-2xl bg-sand/60 p-4 text-sm">
              {lines.map((line) => (
                <li key={line.id} className="flex justify-between gap-4">
                  <span className="text-ink/80">{line.label}</span>
                  <span className="tabular-nums text-ink/60">
                    {formatUsd(line.amount)}
                  </span>
                </li>
              ))}
              <li className="flex justify-between border-t border-black/10 pt-2 font-semibold">
                <span>Monthly rental</span>
                <span className="tabular-nums">{formatUsd(monthly)}</span>
              </li>
              <li className="flex justify-between font-semibold">
                <span>Total {state.term} months rental</span>
                <span className="tabular-nums">
                  {formatUsd(monthly * state.term)}
                </span>
              </li>
            </ul>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
              <button
                ref={primaryRef}
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-2xl bg-gold px-4 py-3 text-sm font-bold text-ink transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                Confirm rental
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-clay focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                Continue editing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
