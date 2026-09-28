"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Workspace } from "@/lib/types";
import { Workspace2D } from "./workspace-2d";

/**
 * Three.js needs the browser, so the scene is loaded client-side only, and only
 * once the visitor actually asks for 3D. Until then the container shows the
 * room's wall gradient, which keeps the layout from shifting.
 */
const Workspace3D = dynamic(
  () => import("./workspace-3d").then((mod) => mod.Workspace3D),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center">
        <p className="rounded-full bg-white/75 px-3 py-1.5 text-xs font-medium text-ink/60 backdrop-blur">
          Loading 3D…
        </p>
      </div>
    ),
  },
);

type ViewMode = "2d" | "3d";

const VIEWS: ReadonlyArray<{ value: ViewMode; label: string }> = [
  { value: "2d", label: "2D" },
  { value: "3d", label: "3D" },
];

export function WorkspaceScene({ workspace }: { workspace: Workspace }) {
  const [view, setView] = useState<ViewMode>("2d");

  const isEmpty =
    !workspace.desk &&
    !workspace.chair &&
    workspace.monitors.length === 0 &&
    !workspace.lamp &&
    !workspace.plant &&
    !workspace.beanBag &&
    !workspace.coffeeStation;

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-linear-to-b from-[#FCF5EA] to-[#F0E1CE] ring-1 ring-black/5 shadow-sm">
      {view === "2d" ? (
        <Workspace2D workspace={workspace} />
      ) : (
        <Workspace3D workspace={workspace} />
      )}

      <div
        role="group"
        aria-label="Scene view"
        className="absolute top-3 right-3 flex gap-0.5 rounded-full bg-white/85 p-0.5 ring-1 ring-black/10 backdrop-blur"
      >
        {VIEWS.map((option) => {
          const active = view === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => setView(option.value)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
                active ? "bg-ink text-white" : "text-ink/55 hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {view === "3d" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <p className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-ink/60 backdrop-blur">
            Drag to rotate · scroll to zoom
          </p>
        </div>
      )}

      {isEmpty && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[16%] flex justify-center">
          <p className="rounded-full bg-white/75 px-4 py-2 text-sm font-medium text-ink/70 backdrop-blur">
            Pick a desk to start designing
          </p>
        </div>
      )}
    </div>
  );
}
