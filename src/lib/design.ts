import { z } from "zod";

// The design spec is the contract between Gemini and the shop templates. Gemini fills it in;
// src/components/shop/ShopPage.tsx renders it. Gemini never writes HTML or script, and the
// PayPal button is always placed by our code — a bad generation can't break checkout.

export const LAYOUTS = ["bold-hero", "editorial", "minimal", "playful"] as const;

// Google Fonts families the templates know how to load.
export const HEADING_FONTS = [
  "Fraunces", "Playfair Display", "DM Serif Display", "Space Grotesk",
  "Archivo Black", "Syne", "Bricolage Grotesque", "Caveat Brush",
] as const;
export const BODY_FONTS = ["Inter", "DM Sans", "Work Sans", "Lora", "Nunito", "IBM Plex Sans"] as const;

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const DesignSpec = z.object({
  productType: z.enum(["digital", "physical"]),
  productName: z.string().min(1).max(80),
  layout: z.enum(LAYOUTS),
  palette: z.object({
    background: hex,
    surface: hex,
    text: hex,
    muted: hex,
    accent: hex,
    accentText: hex,
  }),
  fonts: z.object({ heading: z.enum(HEADING_FONTS), body: z.enum(BODY_FONTS) }),
  eyebrow: z.string().max(40),
  headline: z.string().max(70),
  subheadline: z.string().max(160),
  story: z.string().max(480),
  bullets: z.array(z.string().max(100)).min(2).max(4),
  // Physical: materials, size, care. Digital: what's inside, format, length.
  details: z.array(z.object({ label: z.string().max(30), value: z.string().max(100) })).max(8),
  faq: z.array(z.object({ q: z.string().max(120), a: z.string().max(300) })).min(2).max(4),
  ctaLabel: z.string().max(28),
  suggestedPriceUsd: z.number().min(0.5).max(10000),
  suggestedShippingUsd: z.number().min(0).max(500),
  imageAlt: z.string().max(160),
  // Prompt for the image model's hero art. Not shown to buyers.
  heroPrompt: z.string().max(600),
});
export type DesignSpec = z.infer<typeof DesignSpec>;

/** What Gemini returns: the spec plus its guesses for the seller's setup step. */
export const Generated = DesignSpec.extend({
  // A short, memorable shop link: lowercase letters/numbers, 3–20 chars, dashes only if needed.
  suggestedLink: z.string().max(30),
  // For digital products: a downloadable file, or an access code for an app/game/web course.
  digitalDelivery: z.enum(["file", "access_code"]),
});
export type Generated = z.infer<typeof Generated>;

/** JSON Schema for Gemini's responseJsonSchema, derived from the zod schema so they can't drift. */
export function designJsonSchema(schema: z.ZodType = Generated): object {
  const strip = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(strip);
    if (node && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(node)) {
        // Keep the schema to the subset Gemini's structured output accepts reliably.
        if (k === "$schema" || k === "additionalProperties" || k === "pattern") continue;
        out[k] = strip(v);
      }
      return out;
    }
    return node;
  };
  return strip(z.toJSONSchema(schema)) as object;
}

// ---- Palette repair: Gemini's colours sometimes miss the #rrggbb format. ----

const DEFAULT_PALETTE = {
  background: "#fbf7f2", surface: "#ffffff", text: "#1c1917",
  muted: "#57534e", accent: "#c2410c", accentText: "#ffffff",
};

/** A near-miss colour (#fff, no #, #rrggbbaa, rgb(), a hex in other text) as #rrggbb, else null. */
export function toHex(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim().toLowerCase();
  if (s === "white") return "#ffffff";
  if (s === "black") return "#000000";
  let m = /^#?([0-9a-f]{6})(?:[0-9a-f]{2})?$/.exec(s);
  if (m) return `#${m[1]}`;
  m = /^#?([0-9a-f])([0-9a-f])([0-9a-f])[0-9a-f]?$/.exec(s);
  if (m) return `#${m[1]}${m[1]}${m[2]}${m[2]}${m[3]}${m[3]}`;
  m = /^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/.exec(s);
  if (m) return `#${m.slice(1, 4).map((n) => Math.min(255, Number(n)).toString(16).padStart(2, "0")).join("")}`;
  m = /#([0-9a-f]{6})(?![0-9a-f])/.exec(s);
  return m ? `#${m[1]}` : null;
}

/**
 * Fixes the palette of Gemini's raw JSON in place, before it's parsed, so one bad colour can't
 * sink the whole design. Unrepairable colours get a default; ensureReadable fixes contrast after.
 * Returns what changed, for the log.
 */
export function repairPalette(raw: unknown): string[] {
  if (!raw || typeof raw !== "object") return [];
  const r = raw as { palette?: unknown };
  const p = (r.palette && typeof r.palette === "object" ? r.palette : (r.palette = {})) as Record<string, unknown>;
  const fixed: string[] = [];
  for (const [k, fallback] of Object.entries(DEFAULT_PALETTE)) {
    if (typeof p[k] === "string" && /^#[0-9a-fA-F]{6}$/.test(p[k] as string)) continue;
    const next = toHex(p[k]) ?? fallback;
    fixed.push(`${k}: ${JSON.stringify(p[k])} → ${next}`);
    p[k] = next;
  }
  return fixed;
}

// ---- Contrast guard: Gemini picks good palettes, but not always readable ones. ----

function luminance(h: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Light enough that a product photo's white backdrop can melt into it (multiply blending). */
export const isLight = (hex: string) => luminance(hex) > 0.6;

export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const readableOn = (bg: string, want: string, min: number) =>
  contrast(want, bg) >= min ? want : contrast("#111111", bg) >= contrast("#ffffff", bg) ? "#111111" : "#ffffff";

export function ensureReadable(spec: DesignSpec): DesignSpec {
  const p = spec.palette;
  const text = readableOn(p.background, p.text, 7);
  return {
    ...spec,
    palette: {
      ...p,
      text,
      muted: contrast(p.muted, p.background) >= 4.5 ? p.muted : text,
      accentText: readableOn(p.accent, p.accentText, 4.5),
    },
  };
}

/** Used when no GEMINI_API_KEY is set, so the app still runs end to end. */
export function fallbackSpec(description: string, type: "digital" | "physical"): DesignSpec {
  const name = description.split(/[.,\n]/)[0].trim().slice(0, 60) || "My product";
  return {
    productType: type,
    productName: name,
    layout: "bold-hero",
    palette: { ...DEFAULT_PALETTE },
    fonts: { heading: "Fraunces", body: "Inter" },
    eyebrow: type === "digital" ? "Instant download" : "Made with care",
    headline: name,
    subheadline: description.slice(0, 200),
    story: description,
    bullets: ["Set GEMINI_API_KEY to have Gemini write this page", "This is placeholder copy"],
    details: [],
    faq: [
      { q: "How do I pay?", a: "Securely with PayPal — card or PayPal balance." },
      {
        q: type === "digital" ? "When do I get it?" : "When will it ship?",
        a: type === "digital" ? "Right after payment, on the next page." : "Usually within 3 business days.",
      },
    ],
    ctaLabel: "Buy now",
    suggestedPriceUsd: 20,
    suggestedShippingUsd: type === "physical" ? 5 : 0,
    imageAlt: name,
    heroPrompt: "",
  };
}

// Google Fonts rejects the whole request if a family is asked for a weight it doesn't have.
const SINGLE_WEIGHT = new Set(["Archivo Black", "DM Serif Display", "Caveat Brush"]);

export const fontsHref = (s: DesignSpec) =>
  "https://fonts.googleapis.com/css2?" +
  [...new Set([s.fonts.heading, s.fonts.body])]
    .map((f) => `family=${f.replace(/ /g, "+")}${SINGLE_WEIGHT.has(f) ? "" : ":wght@400;600;700"}`)
    .join("&") +
  "&display=swap";
