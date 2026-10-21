"use client";

import { comboKey, combos, stockOf, type Choice, type OptionStock, type ShopOption } from "@/lib/options";
import { setChoice, useChoice } from "./choice";

// Size buttons and colour swatches, in the shop's own palette (CSS variables from ShopPage).
// A value is disabled when every combination it could make is sold out.

export function OptionPicker({ slug, options, stock }: { slug: string; options: ShopOption[]; stock: OptionStock }) {
  const choice = useChoice(slug);

  // Could the buyer still get something if they picked this value, given their other picks?
  const available = (name: string, value: string) =>
    combos(options).some(
      (c) =>
        c[name] === value &&
        options.every((o) => o.name === name || !choice[o.name] || c[o.name] === choice[o.name]) &&
        stockOf(stock, comboKey(options, c)) !== 0,
    );
  const complete = options.every((o) => choice[o.name]);
  const left = complete ? stockOf(stock, comboKey(options, choice as Choice)) : null;

  return (
    <div data-options={slug} className="w-full max-w-sm space-y-4 text-left scroll-mt-24">
      {options.map((o) => (
        <div key={o.name} role="radiogroup" aria-label={o.name} className="space-y-2">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {o.name}
            {choice[o.name] && (
              <>
                : <strong style={{ color: "var(--text)" }}>{choice[o.name]}</strong>
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {o.values.map((v) => {
              const on = choice[o.name] === v.label;
              const ok = available(o.name, v.label);
              return o.kind === "color" ? (
                <button
                  key={v.label}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={`${v.label}${ok ? "" : " (sold out)"}`}
                  title={v.label}
                  disabled={!ok}
                  onClick={() => setChoice(slug, o.name, v.label)}
                  className="relative size-9 rounded-full transition disabled:cursor-not-allowed disabled:opacity-35"
                  style={{
                    background: v.hex ?? "var(--surface)",
                    boxShadow: on
                      ? "0 0 0 2px var(--bg), 0 0 0 4px var(--accent)"
                      : "inset 0 0 0 1px color-mix(in srgb, var(--text) 25%, transparent)",
                  }}
                >
                  {!ok && <span aria-hidden className="absolute inset-0 m-auto h-px w-9 rotate-45" style={{ background: "var(--text)" }} />}
                </button>
              ) : (
                <button
                  key={v.label}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  disabled={!ok}
                  onClick={() => setChoice(slug, o.name, v.label)}
                  className="min-w-11 rounded-lg px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:line-through disabled:opacity-35"
                  style={
                    on
                      ? { background: "var(--accent)", color: "var(--accent-text)", fontWeight: 700 }
                      : { boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--text) 30%, transparent)", color: "var(--text)" }
                  }
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {left !== null && left > 0 && left <= 5 && (
        <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
          Only {left} left in {comboKey(options, choice as Choice)}
        </p>
      )}
    </div>
  );
}
