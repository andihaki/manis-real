"use client";

import { findCoupon } from "@/lib/pricing";

export function CouponInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const unmatched = value.trim() !== "" && findCoupon(value) === null;

  return (
    <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/15 pt-4">
      <label htmlFor="coupon-code" className="text-sm text-cream/70">
        Coupon
      </label>
      <input
        id="coupon-code"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Insert Coupon"
        autoComplete="off"
        spellCheck={false}
        aria-invalid={unmatched}
        className={`w-36 rounded-xl bg-white/10 px-3 py-2 text-right text-sm font-medium uppercase tracking-wide transition placeholder:normal-case placeholder:tracking-normal placeholder:text-cream/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
          unmatched ? "text-terracotta-light" : "text-cream"
        }`}
      />
    </div>
  );
}
