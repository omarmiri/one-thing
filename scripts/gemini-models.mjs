// Lists the Gemini models your GEMINI_API_KEY can call, so you can set GEMINI_MODEL /
// GEMINI_IMAGE_MODEL in .env.local.   Run: npm run gemini:models
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set (put it in .env.local).");
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const pager = await ai.models.list();
for await (const m of pager) {
  if (!m.supportedActions?.includes("generateContent")) continue;
  const tag = /image/.test(m.name) ? "  [image]" : "";
  console.log(`${m.name.replace(/^models\//, "")}${tag}`);
}
