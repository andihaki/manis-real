"use client";

import { MAX_MONITORS, productsByCategory } from "@/lib/products";
import { formatUsd } from "@/lib/pricing";
import type { Product, Workspace } from "@/lib/types";
import { ProductArt } from "./product-art";
import { ProductCard } from "./product-card";

function SectionHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
        {title}
      </h3>
      {hint && <span className="text-xs text-ink/40">{hint}</span>}
    </div>
  );
}

function ToggleCard({
  product,
  active,
  onToggle,
}: {
  product: Product;
  active: boolean;
  onToggle: () => void;
}) {
  const handleClick = () => {
    onToggle();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      productId: product.id,
      productCategory: product.category,
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onDragStart={handleDragStart}
      draggable
      aria-pressed={active}
      data-product-id={product.id}
      data-product-category={product.category}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
        active
          ? "border-teal bg-teal/5 ring-2 ring-teal"
          : "border-black/10 bg-white hover:border-clay hover:shadow-sm"
      }`}
    >
      <span className="flex h-14 w-14 shrink-0 items-end justify-center rounded-xl bg-sand/70 p-1.5">
        <ProductArt product={product} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">
          {product.name}
        </span>
        <span className="block text-xs text-ink/50">
          {formatUsd(product.pricePerMonth)}/mo
        </span>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
            active ? "bg-teal text-white" : "bg-sand text-ink/70"
          }`}
        >
          {active ? "✓ Added" : "+ Add"}
        </span>
      </span>
    </button>
  );
}

function MonitorControl({
  product,
  count,
  onAdd,
  onRemove,
}: {
  product: Product;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      productId: product.id,
      productCategory: product.category,
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      data-product-id={product.id}
      data-product-category={product.category}
      className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
        count > 0
          ? "border-teal bg-teal/5 ring-2 ring-teal"
          : "border-black/10 bg-white"
      }`}
    >
      <span className="flex h-14 w-14 shrink-0 items-end justify-center rounded-xl bg-sand/70 p-1.5">
        <ProductArt product={product} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">
          {product.name}
        </span>
        <span className="block text-xs text-ink/50">
          {formatUsd(product.pricePerMonth)}/mo each
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onRemove}
          disabled={count === 0}
          aria-label="Remove one monitor"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-lg leading-none text-ink transition hover:border-clay disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          −
        </button>
        <span
          aria-live="polite"
          className="w-5 text-center text-sm font-bold text-ink"
        >
          {count}
        </span>
        <button
          type="button"
          onClick={onAdd}
          disabled={count >= MAX_MONITORS}
          aria-label="Add one monitor"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-lg leading-none text-ink transition hover:border-clay disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          +
        </button>
      </span>
    </div>
  );
}

export function ProductSelector({
  workspace,
  onSelectDesk,
  onSelectChair,
  onAddMonitor,
  onRemoveMonitor,
  onToggleLamp,
  onTogglePlant,
  onToggleBeanBag,
  onToggleCoffeeStation,
}: {
  workspace: Workspace;
  onSelectDesk: (product: Product) => void;
  onSelectChair: (product: Product) => void;
  onAddMonitor: () => void;
  onRemoveMonitor: () => void;
  onToggleLamp: () => void;
  onTogglePlant: () => void;
  onToggleBeanBag: () => void;
  onToggleCoffeeStation: () => void;
}) {
  const desks = productsByCategory("desk");
  const chairs = productsByCategory("chair");
  const monitor = productsByCategory("monitor")[0];
  const lamp = productsByCategory("lamp")[0];
  const plant = productsByCategory("plant")[0];
  const beanBag = productsByCategory("bean-bag")[0];
  const coffeeStation = productsByCategory("coffee-station")[0];
  const monitorCount = workspace.monitors.length;

  return (
    <section
      aria-label="Choose your equipment"
      className="rounded-3xl bg-white/70 p-4 ring-1 ring-black/5 sm:p-5"
    >
      <SectionHeading title="Desk" hint="pick one" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {desks.map((desk) => (
          <ProductCard
            key={desk.id}
            product={desk}
            selected={workspace.desk?.id === desk.id}
            onSelect={onSelectDesk}
          />
        ))}
      </div>

      <div className="mt-6">
        <SectionHeading title="Chair" hint="pick one" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {chairs.map((chair) => (
            <ProductCard
              key={chair.id}
              product={chair}
              selected={workspace.chair?.id === chair.id}
              onSelect={onSelectChair}
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <SectionHeading title="Monitors" hint={`up to ${MAX_MONITORS}`} />
        <MonitorControl
          product={monitor}
          count={monitorCount}
          onAdd={onAddMonitor}
          onRemove={onRemoveMonitor}
        />
      </div>

      <div className="mt-6">
        <SectionHeading title="Extras" hint="optional" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ToggleCard
            product={lamp}
            active={workspace.lamp !== null}
            onToggle={onToggleLamp}
          />
          <ToggleCard
            product={plant}
            active={workspace.plant !== null}
            onToggle={onTogglePlant}
          />
          <ToggleCard
            product={beanBag}
            active={workspace.beanBag !== null}
            onToggle={onToggleBeanBag}
          />
          <ToggleCard
            product={coffeeStation}
            active={workspace.coffeeStation !== null}
            onToggle={onToggleCoffeeStation}
          />
        </div>
      </div>
    </section>
  );
}
