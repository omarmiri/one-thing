import "server-only";
import { GoogleGenAI } from "@google/genai";
import { DesignSpec, designJsonSchema, ensureReadable, fallbackSpec, LAYOUTS } from "./design";

// Model ids differ by key and change over time — `npm run gemini:models` lists yours.
const TEXT_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";

export const geminiEnabled = () => Boolean(process.env.GEMINI_API_KEY);
const client = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export type Photo = { data: Uint8Array; mime: string };

const DESIGNER_BRIEF = `You are the designer and copywriter for a one-product online shop.
You return a JSON design spec that our templates render — never HTML.

Design:
- Choose the layout that suits the product: ${LAYOUTS.join(", ")}.
  bold-hero = big product photo, punchy; editorial = magazine, story-led, premium;
  minimal = lots of whitespace, quiet luxury or tech; playful = rounded, colourful, fun.
- Build the palette from the product photo's own colours. Background and text must be highly
  readable (contrast 7:1); accent is the buy button colour, accentText sits on it.
- Pick a heading/body font pair that matches the mood.

Copy (plain text, no markdown, no emoji, no invented reviews or awards, no false claims):
- eyebrow: 2–4 words above the headline. headline: under 10 words, specific to THIS product.
- story: 2 short paragraphs separated by a blank line, in the seller's voice.
- bullets: 3–5 concrete benefits. details: physical → materials, size, care;
  digital → what's inside, format, length. Only state facts the seller gave or the photo shows;
  leave a detail out rather than guess a measurement.
- faq: 3–4 questions a buyer would really ask (shipping or delivery, returns, use).
- suggestedPriceUsd / suggestedShippingUsd: realistic for this product (shipping 0 if digital).
- heroPrompt: describe a lifestyle or backdrop scene for this product, in the palette, for an
  image model. No text in the image.`;

async function generateJson(parts: object[]): Promise<DesignSpec> {
  const res = await client().models.generateContent({
    model: TEXT_MODEL,
    contents: [{ role: "user", parts }],
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: designJsonSchema(),
      temperature: 0.9,
    },
  });
  const spec = DesignSpec.parse(JSON.parse(res.text ?? ""));
  return ensureReadable(spec);
}

/** Photo + the seller's sentence → a full design spec. */
export async function designShop(input: {
  description: string;
  type: "digital" | "physical" | "auto";
  photo?: Photo;
}): Promise<{ spec: DesignSpec; source: "gemini" | "fallback" }> {
  if (!geminiEnabled()) {
    return { spec: fallbackSpec(input.description, input.type === "digital" ? "digital" : "physical"), source: "fallback" };
  }
  const parts: object[] = [{ text: DESIGNER_BRIEF }];
  if (input.photo) {
    parts.push({ inlineData: { mimeType: input.photo.mime, data: Buffer.from(input.photo.data).toString("base64") } });
  }
  parts.push({
    text:
      `Seller's description: """${input.description}"""\n` +
      (input.type === "auto"
        ? "Decide productType from the photo and description."
        : `productType must be "${input.type}".`),
  });
  return { spec: await generateJson(parts), source: "gemini" };
}

/** "Make it warmer" → the same spec with that change applied. */
export async function refineShop(spec: DesignSpec, instruction: string): Promise<DesignSpec> {
  if (!geminiEnabled()) throw new Error("Set GEMINI_API_KEY to edit the design with AI.");
  const refined = await generateJson([
    { text: DESIGNER_BRIEF },
    { text: `Current spec:\n${JSON.stringify(spec)}` },
    {
      text:
        `The seller asks: """${instruction}"""\n` +
        "Return the full spec with that change applied. Keep everything they didn't ask to change, " +
        "including productType and productName.",
    },
  ]);
  return { ...refined, productType: spec.productType };
}

/** Hero art from the seller's photo. Returns null if the model returned no image. */
export async function heroImage(spec: DesignSpec, photo?: Photo): Promise<Photo | null> {
  if (!geminiEnabled() || !spec.heroPrompt) return null;
  const parts: object[] = [];
  if (photo) {
    parts.push({ inlineData: { mimeType: photo.mime, data: Buffer.from(photo.data).toString("base64") } });
  }
  parts.push({
    text:
      `${spec.heroPrompt}\n\nWide 16:9 hero image for a product landing page.` +
      (photo ? " Feature this exact product, unchanged, as the subject." : "") +
      " Photographic, soft natural light, no text, no logos, no watermark.",
  });
  const res = await client().models.generateContent({
    model: IMAGE_MODEL,
    contents: [{ role: "user", parts }],
    config: { responseModalities: ["IMAGE", "TEXT"] },
  });
  for (const part of res.candidates?.[0]?.content?.parts ?? []) {
    if (part.inlineData?.data) {
      return { data: Buffer.from(part.inlineData.data, "base64"), mime: part.inlineData.mimeType ?? "image/png" };
    }
  }
  return null;
}
