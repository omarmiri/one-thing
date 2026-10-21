import { z } from "zod";

// A showcase is an interactive section our own components render from data, the same way the
// design spec works: Gemini chooses and writes, it never supplies code. The first kind is an
// "arcade": the buyer flies the game's hero over its backdrop and practises the attack on its
// enemies, drawn from the seller's own sprite sheets (src/lib/assets.ts measures them).

export const EFFECTS = ["fire", "ice", "lightning", "poison", "magic"] as const;

const Sprite = z.object({
  blob: z.string(),
  cols: z.number().int().min(1).max(32),
  rows: z.number().int().min(1).max(32),
  frames: z.number().int().min(1).max(256),
  ms: z.number().int().min(40).max(2000).optional(), // per frame; the page's own timing when it says
  faces: z.enum(["left", "right"]),
  name: z.string().max(40),
});
export type Sprite = z.infer<typeof Sprite>;

export const Showcase = z.object({
  kind: z.literal("arcade"),
  title: z.string().max(60),
  instructions: z.string().max(120),
  verb: z.string().max(16), // "Flame": the click
  pastVerb: z.string().max(16), // "flamed": the score line
  effect: z.enum(EFFECTS),
  goal: z.number().int().min(3).max(30),
  winTitle: z.string().max(50),
  winText: z.string().max(160),
  player: Sprite,
  targets: z.array(Sprite).min(1).max(6),
  backdrop: z.string().nullable(),
});
export type Showcase = z.infer<typeof Showcase>;

/** What Gemini returns when it directs a showcase: choices by asset number, plus the copy. */
export const Direction = z.object({
  isGame: z.boolean(),
  title: z.string().max(60),
  instructions: z.string().max(120),
  verb: z.string().max(16),
  pastVerb: z.string().max(16),
  effect: z.enum(EFFECTS),
  goal: z.number().int().min(3).max(30),
  winTitle: z.string().max(50),
  winText: z.string().max(160),
  player: z.object({ asset: z.number().int(), name: z.string().max(40), faces: z.enum(["left", "right"]) }),
  targets: z.array(z.object({ asset: z.number().int(), name: z.string().max(40), faces: z.enum(["left", "right"]) })).max(6),
  backdrop: z.number().int(), // -1 for none
});
export type Direction = z.infer<typeof Direction>;

/** What the page gets: the same showcase with each stored image as a URL. */
export type SpriteView = Sprite & { src: string };
export type ShowcaseView = Omit<Showcase, "player" | "targets" | "backdrop"> & {
  player: SpriteView;
  targets: SpriteView[];
  backdrop: string | null;
};

export function showcaseView(s: Showcase, url: (blob: string) => string): ShowcaseView {
  const sprite = (x: Sprite): SpriteView => ({ ...x, src: url(x.blob) });
  return { ...s, player: sprite(s.player), targets: s.targets.map(sprite), backdrop: s.backdrop ? url(s.backdrop) : null };
}
