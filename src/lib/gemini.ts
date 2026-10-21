import "server-only";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { DesignSpec, designJsonSchema, ensureReadable, fallbackSpec, Generated, LAYOUTS } from "./design";
import { Direction } from "./showcase";

// Model ids differ by key and change over time — `npm run gemini:models` lists yours.
const TEXT_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
// Tried once when TEXT_MODEL stays overloaded (503) after its retries.
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL ?? "gemini-3.6-flash";
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";

export const geminiEnabled = () => Boolean(process.env.GEMINI_API_KEY);
const client = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export type Photo = { data: Uint8Array; mime: string };
const inline = (p: Photo) => ({ inlineData: { mimeType: p.mime, data: Buffer.from(p.data).toString("base64") } });

const DESIGNER_BRIEF = `You are the art director and copywriter for a one-product shop page.
You return a JSON design spec that our templates render — never HTML.

TASTE. Quiet confidence over decoration. One idea per page. Restraint reads as premium.

Palette (build it from the product photo):
- background: a calm tinted neutral pulled from the photo, never pure #ffffff and never a loud
  saturated colour. Go dark (deep charcoal, ink, forest) when the product or photo is moody,
  nocturnal, gaming or luxury; light (paper, stone, warm white) otherwise.
- surface: one step lighter or darker than background, for cards.
- text: near-black on light, near-white on dark (contrast at least 7:1). muted: same hue, softer.
- accent: the single most distinctive colour in the photo, adjusted until it reads clearly on the
  background. It is used only for the buy button and tiny details. accentText sits on it.

Type: pair one characterful heading font with a quiet body font.
- Premium, crafted, editorial: Fraunces or Playfair Display or DM Serif Display + Inter or Lora.
- Modern, tech, digital, minimal: Space Grotesk or Bricolage Grotesque + Inter or IBM Plex Sans.
- Bold, games, sport, loud: Archivo Black or Syne + DM Sans or Work Sans.
- Playful, kids, handmade fun: Caveat Brush or Bricolage Grotesque + Nunito.

Layout: ${LAYOUTS.join(", ")}.
bold-hero = big image first, punchy (games, sport, dramatic photos); editorial = magazine,
story-led (crafted, premium); minimal = whitespace, quiet (tech, beauty, design objects);
playful = rounded, colourful (kids, gifts, fun).

COPY. Plain text, sentence case, no markdown, no emoji. Specific beats clever.
- Never use: elevate, unleash, unlock your, game-changer, seamless, ultimate, revolutionary,
  "look no further", "take it to the next level", exclamation marks.
- No invented reviews, awards, statistics or guarantees. Only facts the seller gave, the page
  shows, or the photo makes obvious. Leave a detail out rather than guess a measurement.
- productName: the real name, short. eyebrow: 2–4 words of category or context.
- headline: at most 8 words, about what the buyer gets, not the product's name again.
- subheadline: one sentence, at most 22 words.
- story: two or three short sentences in the seller's voice. Why it exists, who it's for.
- bullets: exactly 3, each at most 12 words, concrete.
- details: physical → materials, size, care; digital → what's included, format, platform.
- faq: 3 questions a real buyer asks (delivery, returns or refunds, use).
- ctaLabel: 2–4 words, e.g. "Get it now", "Play now", "Buy the mug".
- suggestedPriceUsd / suggestedShippingUsd: realistic (shipping 0 for digital).
- heroPrompt: a lifestyle or backdrop scene for this product, in the palette, for an image
  model. Photographic, no text.

SETUP GUESSES (the seller confirms them next):
- suggestedLink: a short memorable link name, lowercase, 3–20 characters, like "raptorrush" or
  "bluemug". Prefer one word; use a dash only if it reads badly without.
- digitalDelivery: "access_code" for games, apps, software, memberships and online courses the
  buyer uses on a website; "file" for downloads (PDFs, presets, templates, music, photos).`;

// Thinking makes designs slower without making them better. Gemini 3 takes thinkingLevel,
// 2.5 takes thinkingBudget, others take neither; try in that order and remember what worked.
const THINKING = [
  { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } },
  { thinkingConfig: { thinkingBudget: 0 } },
  {},
];
let thinkingIndex = 0;

async function generate(parts: object[], extra: object) {
  // "High demand" 503s come and go within seconds; two short retries ride most of them out.
  let retries = 0;
  // The free tier's per-minute cap (429) says how long to wait; wait once, never for a daily cap.
  let waitedForMinute = false;
  let model = TEXT_MODEL;
  for (;;) {
    try {
      return await client().models.generateContent({
        model,
        contents: [{ role: "user", parts }],
        config: { ...THINKING[thinkingIndex], ...extra },
      });
    } catch (err) {
      const msg = String((err as Error).message ?? err);
      if (thinkingIndex < THINKING.length - 1 && /thinking/i.test(msg)) {
        thinkingIndex++;
        continue;
      }
      const status = (err as { status?: number }).status;
      if ((status === 503 || status === 500) && retries < 2) {
        await new Promise((r) => setTimeout(r, ++retries * 2000));
        continue;
      }
      if ((status === 503 || status === 500) && model !== FALLBACK_MODEL) {
        console.warn(`gemini: ${model} still overloaded, trying ${FALLBACK_MODEL}`);
        model = FALLBACK_MODEL;
        continue;
      }
      if (status === 429 && !waitedForMinute && /PerMinute/.test(msg)) {
        const delay = Number(/"retryDelay":"(\d+(?:\.\d+)?)s"/.exec(msg)?.[1] ?? /retry in (\d+(?:\.\d+)?)s/.exec(msg)?.[1] ?? 15);
        waitedForMinute = true;
        await new Promise((r) => setTimeout(r, (Math.min(delay, 30) + 1) * 1000));
        continue;
      }
      throw err;
    }
  }
}

async function generateDesign(parts: object[]): Promise<Generated> {
  const t0 = Date.now();
  const res = await generate(parts, {
    responseMimeType: "application/json",
    responseJsonSchema: designJsonSchema(),
    temperature: 0.8,
  });
  const out = Generated.parse(JSON.parse(res.text ?? ""));
  console.info(`gemini design: ${TEXT_MODEL} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  return { ...out, ...ensureReadable(out) };
}

export type DesignInput = {
  type: "digital" | "physical" | "auto";
  description?: string | null;
  photo?: Photo;
  // Text gathered from a pasted link (the seller's own page) or a Channel3 product.
  context?: string | null;
  /** Recommending someone else's product (Channel3 referral) rather than selling your own. */
  referral?: boolean;
};

/** Everything the seller gave us → a full design spec plus setup guesses. */
export async function designShop(input: DesignInput): Promise<{ spec: Generated; source: "gemini" | "fallback" }> {
  if (!geminiEnabled()) {
    const type = input.type === "digital" ? "digital" : "physical";
    // Without Gemini: name it from the seller's words, or the page/product title we found.
    const titled = input.context?.match(/^(?:Title|Product): (.+)$/m)?.[1];
    const base = fallbackSpec(input.description || titled || "My product", type);
    return { spec: { ...base, suggestedLink: "", digitalDelivery: "file" }, source: "fallback" };
  }
  const parts: object[] = [{ text: DESIGNER_BRIEF }];
  if (input.photo) parts.push(inline(input.photo));
  parts.push({
    text: [
      input.description ? `The seller says: """${input.description}"""` : "The seller gave no description: work from the photo and context.",
      input.context ? `What we know about the product:\n"""${input.context}"""` : "",
      input.referral
        ? "This is a recommendation page: the seller curates someone else's product and buyers purchase it at the " +
          "retailer. Write as a trusted recommendation (why it's worth buying), not as the maker. FAQ about where it ships from and returns: answer that the retailer handles them."
        : "",
      input.type === "auto" ? "Decide productType from everything above." : `productType must be "${input.type}".`,
    ]
      .filter(Boolean)
      .join("\n\n"),
  });
  try {
    return { spec: await generateDesign(parts), source: "gemini" };
  } catch (err) {
    // A photo Gemini can't read (odd encoding, huge, animated) shouldn't sink the whole shop:
    // design from the words alone instead.
    if (!input.photo || !/image/i.test(String((err as Error).message))) throw err;
    console.warn("gemini rejected the photo; designing without it:", (err as Error).message);
    return { spec: await generateDesign(parts.filter((p) => !("inlineData" in p))), source: "gemini" };
  }
}

/** "Make it warmer" → the same spec with that change applied. */
export async function refineShop(spec: DesignSpec, instruction: string): Promise<DesignSpec> {
  if (!geminiEnabled()) throw new Error("Set GEMINI_API_KEY to edit the design with AI.");
  const refined = await generateDesign([
    { text: DESIGNER_BRIEF },
    { text: `Current spec:\n${JSON.stringify(spec)}` },
    {
      text:
        `The seller asks: """${instruction}"""\n` +
        "Return the full spec with that change applied. Keep everything they didn't ask to change, " +
        "including productType and productName. Keep suggestedLink and digitalDelivery as they were if present.",
    },
  ]);
  const { suggestedLink: _l, digitalDelivery: _d, ...rest } = refined;
  return { ...rest, productType: spec.productType };
}

// ---- Showcase ---------------------------------------------------------------------------------

const DIRECTOR_BRIEF = `You are the game director for a shop page that sells a video game.
Below the page text are numbered assets from the game's own website, each shown as its first
animation frame, with what we measured about it. Design a 30-second playable teaser: the buyer
controls the game's hero with the mouse (or a finger), clicks to attack, and hits the game's
enemies as they drift across the game's own backdrop.

Decide:
- isGame: true only if this page sells or shows a playable game with character art. If not,
  set false and fill the rest with any valid values.
- player: the hero the buyer plays as. faces: the way the character in the frame looks.
- targets: 2 to 5 enemies that read well small: flying or floating ones suit best. Prefer
  variety. Use each asset once.
- backdrop: a wide scenic background from the game, or -1 if none suits.
- Only pick a sprite whose frame shows exactly one whole character. Skip frames that are cut
  off, show several characters, or are logos, badges, icons, UI or screenshots.
- effect: what the hero's attack looks like (a fire dragon breathes fire, an ice mage casts ice).
- verb: the attack, one word, as a button would say it ("Flame", "Zap", "Freeze").
  pastVerb: as in "8 flamed" ("flamed", "zapped", "frozen").
- goal: hits to win, 8 to 15.
- title: at most 6 words, an invitation to play. instructions: one short sentence on the
  controls ("Move to fly, click to breathe fire.").
- winTitle and winText: a short reward line, then one sentence pointing to the full game.
Plain text, sentence case, no emoji, no exclamation marks, nothing the page doesn't support.`;

export type ShowcaseAsset = { label: string; thumb: Uint8Array };

/** Gemini picks the hero, enemies and backdrop from a game page's measured art and writes the copy. */
export async function directShowcase(context: string, assets: ShowcaseAsset[]): Promise<Direction | null> {
  if (!geminiEnabled() || assets.length < 2) return null;
  const parts: object[] = [{ text: DIRECTOR_BRIEF }, { text: `The page:\n"""${context.slice(0, 3000)}"""` }];
  assets.forEach((a, i) => {
    parts.push({ text: `Asset ${i}: ${a.label}` });
    parts.push(inline({ data: a.thumb, mime: "image/png" }));
  });
  const t0 = Date.now();
  const res = await generate(parts, {
    responseMimeType: "application/json",
    responseJsonSchema: designJsonSchema(Direction),
    temperature: 0.6,
  });
  const out = Direction.parse(JSON.parse(res.text ?? ""));
  console.info(`gemini showcase: ${TEXT_MODEL} in ${((Date.now() - t0) / 1000).toFixed(1)}s, game=${out.isGame}`);
  return out;
}

// ---- Hero art ---------------------------------------------------------------------------------

// The configured image model may not exist for this key. On a "not found" we look one up from
// the key's own model list and remember it for the life of the process.
let imageModel: string | null = null;

async function findImageModel(): Promise<string | null> {
  const names: string[] = [];
  for await (const m of await client().models.list()) {
    if (m.name && /image/i.test(m.name) && m.supportedActions?.includes("generateContent")) names.push(m.name.replace(/^models\//, ""));
  }
  // Prefer fast "flash" image models, then anything else that makes images.
  names.sort((a, b) => Number(/flash/.test(b)) - Number(/flash/.test(a)));
  console.info(`gemini image models available: ${names.join(", ") || "none"}`);
  return names[0] ?? null;
}

async function imageCall(model: string, parts: object[]) {
  return client().models.generateContent({
    model,
    contents: [{ role: "user", parts }],
    config: { responseModalities: ["IMAGE", "TEXT"] },
  });
}

/** Hero art from the seller's photo. Returns null if no image model can make one. */
export async function heroImage(spec: DesignSpec, photo?: Photo): Promise<Photo | null> {
  if (!geminiEnabled() || !spec.heroPrompt) return null;
  const parts: object[] = [];
  if (photo) parts.push(inline(photo));
  parts.push({
    text:
      `${spec.heroPrompt}\n\nWide 16:9 hero image for a product landing page, colours ${spec.palette.background} and ${spec.palette.accent}.` +
      (photo ? " Feature this exact product, unchanged, as the subject." : "") +
      " Photographic, soft natural light, generous negative space, no text, no logos, no watermark.",
  });
  let res;
  try {
    res = await imageCall(imageModel ?? IMAGE_MODEL, parts);
  } catch (err) {
    const msg = String((err as Error).message ?? err);
    if (imageModel || !/not found|404|not supported|unsupported/i.test(msg)) throw err;
    imageModel = await findImageModel();
    if (!imageModel) return null;
    res = await imageCall(imageModel, parts);
  }
  for (const part of res.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData?.data) {
      return { data: Buffer.from(part.inlineData.data, "base64"), mime: part.inlineData.mimeType ?? "image/png" };
    }
  }
  return null;
}
