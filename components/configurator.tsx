"use client";

import { useWorkspace } from "@/hooks/use-workspace";
import { countItems } from "@/lib/pricing";
import { ProductSelector } from "./product-selector";
import { PriceBar } from "./price-bar";
import { RentDialog } from "./rent-dialog";
import { WorkspaceScene } from "./workspace-scene";
import { WorkspaceSummary } from "./workspace-summary";

export function Configurator() {
  const {
    state,
    selectDesk,
    selectChair,
    addMonitor,
    removeMonitor,
    toggleLamp,
    togglePlant,
    toggleBeanBag,
    toggleCoffeeStation,
    setTerm,
    setCoupon,
    reset,
    beginRent,
    cancelRent,
    confirmRent,
  } = useWorkspace();

  const items = countItems(state.workspace);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-32 sm:px-6 lg:pt-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
            Kerja · Bali
          </p>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">
            Design your workspace
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span
            aria-live="polite"
            className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink ring-1 ring-black/10"
          >
            {items} {items === 1 ? "item" : "items"}
          </span>
          <button
            type="button"
            onClick={reset}
            disabled={items === 0}
            className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold text-ink transition hover:border-clay disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            Reset
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <WorkspaceScene
            workspace={state.workspace}
            onSelectDesk={selectDesk}
            onSelectChair={selectChair}
            onAddMonitor={addMonitor}
            onToggleLamp={toggleLamp}
            onTogglePlant={togglePlant}
            onToggleBeanBag={toggleBeanBag}
            onToggleCoffeeStation={toggleCoffeeStation}
          />
        </div>

        <div className="flex flex-col gap-6">
          <ProductSelector
            workspace={state.workspace}
            onSelectDesk={selectDesk}
            onSelectChair={selectChair}
            onAddMonitor={addMonitor}
            onRemoveMonitor={removeMonitor}
            onToggleLamp={toggleLamp}
            onTogglePlant={togglePlant}
            onToggleBeanBag={toggleBeanBag}
            onToggleCoffeeStation={toggleCoffeeStation}
          />
          <WorkspaceSummary
            state={state}
            onSetTerm={setTerm}
            onSetCoupon={setCoupon}
          />
        </div>
      </div>

      <RentDialog
        state={state}
        onCancel={cancelRent}
        onConfirm={confirmRent}
        onEdit={cancelRent}
      />
      <PriceBar state={state} onRent={beginRent} />
    </div>
  );
}
