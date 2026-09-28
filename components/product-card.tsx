"use client";

import { formatUsd } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { ProductArt } from "./product-art";

export function ProductCard({
  product,
  selected,
  onSelect,
}: {
  product: Product;
  selected: boolean;
  onSelect: (product: Product) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      aria-pressed={selected}
      className={`group flex flex-col rounded-2xl border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
        selected
          ? "border-teal bg-teal/5 ring-2 ring-teal"
          : "border-black/10 bg-white hover:-translate-y-0.5 hover:border-clay hover:shadow-sm"
      }`}
    >
      <span className="flex h-24 items-end justify-center rounded-xl bg-sand/70 p-2">
        <ProductArt product={product} />
      </span>
      <span className="mt-3 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-ink">{product.name}</span>
        {selected && (
          <span className="rounded-full bg-teal px-1 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white whitespace-nowrap z-10">
            ✓ Selected
          </span>
        )}
      </span>
      <span className="mt-1 text-xs leading-snug text-ink/60">
        {product.blurb}
      </span>
      <span className="mt-2 text-sm font-semibold text-clay">
        {formatUsd(product.pricePerMonth)}
        <span className="text-xs font-normal text-ink/50">/mo</span>
      </span>
    </button>
  );
}
