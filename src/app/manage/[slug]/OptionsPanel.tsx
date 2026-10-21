"use client";

import { useState } from "react";
import { comboKey, combos, MAX_COMBOS, type OptionStock, type ShopOption, type Suggestions } from "@/lib/options";

// The setup panel's buyer options (sizes, colors with swatches), stock per combination, and the
// questions buyers will ask that the listing doesn't answer yet. Gemini suggests; the seller decides.

export type EditOption = ShopOption & { enabled: boolean; fromSeller?: boolean };

const input = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent";
const KIND_DEFAULTS: Record<ShopOption["kind"], string> = { size: "Size", color: "Color", other: "Option" };

/** The editor's starting state: the shop's own options, then any suggestions not already there. */
export function initialOptions(saved: ShopOption[], suggested: Suggestions | null): EditOption[] {
  const mine = saved.map((o) => ({ ...o, enabled: true, fromSeller: true }));
  const names = new Set(saved.map((o) => o.name.toLowerCase()));
  const more = (suggested?.options ?? [])
    .filter((o) => !names.has(o.name.toLowerCase()))
    .map((o) => ({ ...o, enabled: saved.length === 0 && o.fromSeller }));
  return [...mine, ...more];
}

export const activeOptions = (opts: EditOption[]): ShopOption[] =>
  opts
    .filter((o) => o.enabled && o.name.trim() && o.values.length)
    .map(({ name, kind, values }) => ({ name: name.trim(), kind, values }));

export function OptionsEditor(props: {
  options: EditOption[];
  onOptions(o: EditOption[]): void;
  stock: OptionStock;
  onStock(s: OptionStock): void;
  photos: { id: string; url: string }[];
  onMatch(): Promise<void>;
  /** A colour's photo picked by hand: saved at once, like matching. */
  onPhotoPicked(label: string, photo: string | null, before: string | null): void;
}) {
  const { options } = props;
  const [picking, setPicking] = useState<string | null>(null); // "option:value" whose photo is being chosen
  const [matching, setMatching] = useState(false);
  const photoUrl = (id?: string) => props.photos.find((p) => p.id === id)?.url;
  const set = (i: number, patch: Partial<EditOption>) => props.onOptions(options.map((o, j) => (j === i ? { ...o, ...patch } : o)));
  const active = activeOptions(options);
  const all = combos(active);

  return (
    <div className="space-y-3">
      {options.map((o, i) => (
        <div key={i} className={`space-y-2 rounded-lg border p-3 ${o.enabled ? "border-line" : "border-dashed border-line opacity-70"}`}>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={o.enabled} onChange={(e) => set(i, { enabled: e.target.checked })} aria-label={`Offer ${o.name}`} className="size-4" />
            <input value={o.name} onChange={(e) => set(i, { name: e.target.value })} aria-label="Option name" className="w-28 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-semibold hover:border-line focus:border-accent focus:outline-none" />
            {o.fromSeller === false && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-900">AI guess: confirm</span>}
            {o.kind === "color" && o.enabled && props.photos.length > 1 && (
              <button
                type="button"
                disabled={matching}
                onClick={async () => {
                  setMatching(true);
                  await props.onMatch();
                  setMatching(false);
                }}
                className="ml-auto rounded-full border border-line px-2 py-0.5 text-[11px] font-semibold disabled:opacity-50"
              >
                {matching ? "Matching…" : "Match photos to colours"}
              </button>
            )}
            <button
              type="button"
              onClick={() => props.onOptions(options.filter((_, j) => j !== i))}
              className={`${o.kind === "color" && o.enabled && props.photos.length > 1 ? "" : "ml-auto "}text-xs text-muted hover:text-foreground`}
              aria-label={`Remove ${o.name}`}
            >
              Remove
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {o.values.map((v, k) => (
              <span key={k} className="inline-flex items-center gap-1.5 rounded-full border border-line py-0.5 pl-1.5 pr-1 text-sm">
                {o.kind === "color" && (
                  <input
                    type="color"
                    value={v.hex ?? "#cccccc"}
                    onChange={(e) => set(i, { values: o.values.map((x, m) => (m === k ? { ...x, hex: e.target.value } : x)) })}
                    aria-label={`${v.label} swatch colour`}
                    className="size-5 cursor-pointer rounded-full border-0 bg-transparent p-0"
                  />
                )}
                <span className={o.kind === "color" ? "" : "pl-1"}>{v.label}</span>
                {o.kind === "color" && props.photos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setPicking(picking === `${i}:${k}` ? null : `${i}:${k}`)}
                    aria-label={`Photo for ${v.label}`}
                    title="The photo buyers see when they pick this colour"
                    className={`size-5 overflow-hidden rounded ${photoUrl(v.photo) ? "" : "border border-dashed border-line text-[10px] leading-4 text-muted"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- the seller's own photo */}
                    {photoUrl(v.photo) ? <img src={photoUrl(v.photo)} alt="" className="size-full object-cover" /> : "+"}
                  </button>
                )}
                <button type="button" onClick={() => set(i, { values: o.values.filter((_, m) => m !== k) })} aria-label={`Remove ${v.label}`} className="px-1 text-muted hover:text-foreground">
                  ×
                </button>
              </span>
            ))}
            {picking?.startsWith(`${i}:`) && (
              <div className="flex w-full flex-wrap items-center gap-1.5 rounded-lg bg-background p-1.5">
                <span className="text-xs text-muted">Photo for {o.values[Number(picking.split(":")[1])]?.label}:</span>
                {props.photos.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      const v = o.values[Number(picking.split(":")[1])];
                      props.onPhotoPicked(v.label, p.id, v.photo ?? null);
                      setPicking(null);
                    }}
                    className="size-10 overflow-hidden rounded-md ring-accent hover:ring-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- the seller's own photo */}
                    <img src={p.url} alt="" className="size-full object-cover" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const v = o.values[Number(picking.split(":")[1])];
                    props.onPhotoPicked(v.label, null, v.photo ?? null);
                    setPicking(null);
                  }}
                  className="text-xs text-muted underline"
                >
                  None
                </button>
              </div>
            )}
            <AddValue onAdd={(label) => !o.values.some((v) => v.label.toLowerCase() === label.toLowerCase()) && set(i, { values: [...o.values, { label, ...(o.kind === "color" && { hex: "#cccccc" }) }] })} />
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2 text-xs">
        {(["size", "color", "other"] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            disabled={options.length >= 3}
            onClick={() => props.onOptions([...options, { name: KIND_DEFAULTS[kind], kind, values: [], enabled: true, fromSeller: true }])}
            className="rounded-full border border-line px-3 py-1 disabled:opacity-40"
          >
            + {KIND_DEFAULTS[kind]}
          </button>
        ))}
      </div>

      {all.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Stock per combination</p>
          {all.length > MAX_COMBOS ? (
            <p className="text-xs text-red-700">More than {MAX_COMBOS} combinations: trim some values.</p>
          ) : (
            <div className="max-h-56 divide-y divide-line overflow-auto rounded-lg border border-line">
              {all.map((c) => {
                const key = comboKey(active, c);
                const n = props.stock[key];
                return (
                  <label key={key} className="flex items-center justify-between gap-3 px-3 py-1.5 text-sm">
                    <span>{key}</span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={typeof n === "number" ? n : ""}
                      placeholder="Unlimited"
                      onChange={(e) => props.onStock({ ...props.stock, [key]: e.target.value === "" ? null : Math.max(0, Math.floor(Number(e.target.value))) })}
                      className="w-24 rounded-md border border-line px-2 py-1 text-right text-sm"
                    />
                  </label>
                );
              })}
            </div>
          )}
          <p className="text-xs text-muted">Leave blank for unlimited. Sold-out combinations stay visible but can&apos;t be picked.</p>
        </div>
      )}
    </div>
  );
}

function AddValue({ onAdd }: { onAdd(label: string): void }) {
  const [v, setV] = useState("");
  const add = () => {
    const label = v.trim().slice(0, 30);
    if (label) onAdd(label);
    setV("");
  };
  return (
    <input
      value={v}
      onChange={(e) => setV(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          add();
        }
      }}
      onBlur={add}
      placeholder="+ add"
      aria-label="Add a value"
      className="w-20 rounded-full border border-dashed border-line px-2.5 py-0.5 text-sm outline-none focus:border-accent"
    />
  );
}

/** "Buyers will ask": facts the listing doesn't state yet. Answers become product details. */
export function BuyerQuestions(props: {
  suggestions: Suggestions | null;
  answers: Record<string, string>;
  onAnswer(label: string, value: string): void;
  onCheck(): Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const facts = props.suggestions?.missingFacts ?? [];
  return (
    <div className="space-y-2">
      {props.suggestions?.oneOfAKind && <p className="text-xs text-muted">Looks one of a kind, so buyers don&apos;t pick options.</p>}
      {facts.map((f) => (
        <label key={f.label} className="block space-y-1 text-sm">
          <span>{f.question}</span>
          <input value={props.answers[f.label] ?? ""} onChange={(e) => props.onAnswer(f.label, e.target.value)} placeholder={f.placeholder} maxLength={100} className={input} />
        </label>
      ))}
      {props.suggestions && facts.length === 0 && <p className="text-xs text-muted">Nothing missing that buyers usually ask about.</p>}
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await props.onCheck();
          setBusy(false);
        }}
        className="rounded-full border border-line px-3 py-1 text-xs font-semibold disabled:opacity-50"
      >
        {busy ? "Checking…" : props.suggestions ? "Check again" : "Check for missing details"}
      </button>
    </div>
  );
}
