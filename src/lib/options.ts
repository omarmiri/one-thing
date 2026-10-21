import { z } from "zod";

// Buyer options: a shop still sells one thing, but the buyer may pick a size, a color or another
// variant. Used on the server and in the browser, so nothing here is server-only.

export const OptionValue = z.object({
  label: z.string().trim().min(1).max(30),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), // colors: the swatch
  photo: z.string().max(40).optional(), // colors: the shop photo (blob id) showing this one
});
export const ShopOption = z.object({
  name: z.string().trim().min(1).max(20),
  kind: z.enum(["size", "color", "other"]),
  values: z.array(OptionValue).min(1).max(12),
});
export type OptionValue = z.infer<typeof OptionValue>;
export type ShopOption = z.infer<typeof ShopOption>;

/** Option name → the value the buyer picked, e.g. { Size: "M", Color: "Black" }. */
export type Choice = Record<string, string>;
/** Stock per combination, keyed by comboKey. Missing or null means unlimited. */
export type OptionStock = Record<string, number | null>;

export const MAX_COMBOS = 60;

/** "M / Black": the combination's name, in the shop's option order. */
export const comboKey = (options: ShopOption[], choice: Choice) => options.map((o) => choice[o.name]).join(" / ");

/** Every combination of the options' values. */
export function combos(options: ShopOption[]): Choice[] {
  return options.reduce<Choice[]>(
    (acc, o) => acc.flatMap((c) => o.values.map((v) => ({ ...c, [o.name]: v.label }))),
    [{}],
  );
}

/** A choice that names exactly one known value for every option. */
export function isCompleteChoice(options: ShopOption[], choice: unknown): choice is Choice {
  if (!choice || typeof choice !== "object") return false;
  const c = choice as Record<string, unknown>;
  return options.every((o) => o.values.some((v) => v.label === c[o.name]));
}

export const stockOf = (stock: OptionStock, key: string): number | null =>
  typeof stock[key] === "number" ? (stock[key] as number) : null;

export const allSoldOut = (options: ShopOption[], stock: OptionStock) =>
  options.length > 0 && combos(options).every((c) => stockOf(stock, comboKey(options, c)) === 0);

/** What Gemini suggests while drafting; the seller confirms in the setup panel. */
export type Suggestions = {
  oneOfAKind: boolean;
  options: (ShopOption & { fromSeller: boolean })[];
  missingFacts: { label: string; question: string; placeholder: string }[];
};
