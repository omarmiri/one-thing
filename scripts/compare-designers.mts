// Gemini vs Qwen on the same shops: speed, whether the spec came back valid, and how well each
// follows the designer brief's rules. Inputs are the newest shops in the local PGlite database
// (the seller's words and photo), plus a few text-only briefs.
//   Run: npm run compare:designers [-- <shops> <rounds>]   (stop `npm run dev` first: PGlite is single-process)
// Writes compare-designers.json and compare-designers.html (side by side) to the current folder.
import { writeFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { contrast, type Generated } from "../src/lib/design";
import { designShop, type DesignInput } from "../src/lib/gemini";

if (!process.env.DASHSCOPE_API_KEY || !process.env.GEMINI_API_KEY) {
  console.error("Set both GEMINI_API_KEY and DASHSCOPE_API_KEY (in .env.local) to compare.");
  process.exit(1);
}
const [shopCount = 4, rounds = 1] = process.argv.slice(2).map(Number);
const BANNED = /\b(elevate|unleash|unlock your|game-changer|seamless|ultimate|revolutionary|look no further|next level)\b/i;

const cases: { name: string; input: DesignInput }[] = [
  { name: "Ceramic mug (text)", input: { type: "auto", description: "Hand-thrown stoneware mug, speckled oatmeal glaze, holds 350ml. I make them in my garage studio in Leeds." } },
  { name: "Lightroom presets (text)", input: { type: "auto", description: "12 moody film-look Lightroom presets for night street photography. Desktop and mobile." } },
  { name: "Indie game (text)", input: { type: "auto", description: "Raptor Rush: a pixel-art endless runner where you play a velociraptor dodging meteors. Plays in the browser." } },
];

const db = new PGlite(process.env.PGLITE_DIR ?? "./node_modules/.cache/one-thing-pglite");
const shops = await db.query<{ slug: string; description: string; mime: string; data: Uint8Array }>(
  `SELECT s.slug, s.description, b.mime, b.data FROM shops s JOIN blobs b ON b.id = s.photo_blob
   WHERE s.description <> '' ORDER BY s.created_at DESC LIMIT $1`,
  [shopCount],
);
await db.close();
for (const s of shops.rows) {
  cases.push({ name: `${s.slug} (photo)`, input: { type: "auto", description: s.description, photo: { data: s.data, mime: s.mime } } });
}

function score(spec: Generated) {
  const copy = [spec.headline, spec.subheadline, spec.story, ...spec.bullets, spec.ctaLabel, ...spec.faq.flatMap((f) => [f.q, f.a])].join(" \n ");
  const issues: string[] = [];
  if (BANNED.test(copy)) issues.push(`banned word: ${BANNED.exec(copy)![0]}`);
  if (copy.includes("!")) issues.push("exclamation mark");
  if (spec.headline.split(/\s+/).length > 8) issues.push(`headline ${spec.headline.split(/\s+/).length} words`);
  if (spec.subheadline.split(/\s+/).length > 22) issues.push("subheadline > 22 words");
  if (spec.bullets.length !== 3) issues.push(`${spec.bullets.length} bullets`);
  if (spec.bullets.some((b) => b.split(/\s+/).length > 12)) issues.push("bullet > 12 words");
  if (spec.faq.length !== 3) issues.push(`${spec.faq.length} FAQs`);
  if (!/^[a-z0-9-]{3,20}$/.test(spec.suggestedLink)) issues.push(`link "${spec.suggestedLink}"`);
  const textContrast = contrast(spec.palette.text, spec.palette.background);
  if (textContrast < 7) issues.push(`text contrast ${textContrast.toFixed(1)}`);
  return { issues, textContrast: Number(textContrast.toFixed(1)) };
}

type Run = { provider: string; case: string; ok: boolean; seconds: number; error?: string; spec?: Generated; issues?: string[] };
const runs: Run[] = [];
const geminiKey = process.env.GEMINI_API_KEY;

for (let r = 0; r < rounds; r++) {
  for (const c of cases) {
    for (const provider of ["gemini", "qwen"] as const) {
      // Qwen runs alone (no Gemini to fall back to), so a Qwen failure counts as one.
      process.env.DESIGN_PROVIDER = provider;
      if (provider === "qwen") delete process.env.GEMINI_API_KEY;
      else process.env.GEMINI_API_KEY = geminiKey;
      const t0 = Date.now();
      try {
        const { spec } = await designShop(c.input);
        const { issues } = score(spec);
        runs.push({ provider, case: c.name, ok: true, seconds: (Date.now() - t0) / 1000, spec, issues });
      } catch (err) {
        runs.push({ provider, case: c.name, ok: false, seconds: (Date.now() - t0) / 1000, error: String((err as Error).message).slice(0, 300) });
      }
      const last = runs.at(-1)!;
      console.log(`${provider.padEnd(6)} ${c.name.padEnd(32)} ${last.ok ? "ok " : "ERR"} ${last.seconds.toFixed(1)}s ${last.issues?.join(", ") ?? last.error ?? ""}`);
    }
  }
}

for (const provider of ["gemini", "qwen"]) {
  const mine = runs.filter((r) => r.provider === provider);
  const ok = mine.filter((r) => r.ok);
  const secs = ok.map((r) => r.seconds).sort((a, b) => a - b);
  console.log(
    `${provider}: ${ok.length}/${mine.length} valid, median ${secs[Math.floor(secs.length / 2)]?.toFixed(1) ?? "-"}s, ` +
      `${ok.reduce((n, r) => n + r.issues!.length, 0)} rule issues`,
  );
}

writeFileSync("compare-designers.json", JSON.stringify(runs, null, 2));
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (ch) => `&#${ch.charCodeAt(0)};`);
const cell = (r?: Run) => {
  if (!r) return "<td></td>";
  if (!r.ok) return `<td><b>failed</b> after ${r.seconds.toFixed(1)}s<br><small>${esc(r.error)}</small></td>`;
  const s = r.spec!;
  const swatches = Object.entries(s.palette).map(([k, v]) => `<span title="${k} ${v}" style="background:${v}"></span>`).join("");
  return `<td><div class="card" style="background:${s.palette.background};color:${s.palette.text}">
    <small style="color:${s.palette.muted}">${esc(s.eyebrow)} · ${esc(s.layout)} · ${esc(s.fonts.heading)}/${esc(s.fonts.body)}</small>
    <h2>${esc(s.headline)}</h2><p>${esc(s.subheadline)}</p><p style="color:${s.palette.muted}">${esc(s.story)}</p>
    <ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
    <button style="background:${s.palette.accent};color:${s.palette.accentText}">${esc(s.ctaLabel)}</button>
    <span style="margin-left:8px">$${s.suggestedPriceUsd} · /${esc(s.suggestedLink)} · ${esc(s.productType)}</span></div>
    <div class="sw">${swatches}</div><small>${r.seconds.toFixed(1)}s · ${r.issues!.length ? esc(r.issues!.join("; ")) : "no rule issues"}</small></td>`;
};
const rows = cases
  .map((c) => {
    const both = (p: string) => runs.filter((r) => r.case === c.name && r.provider === p);
    return both("gemini").map((g, i) => `<tr><th>${esc(c.name)}</th>${cell(g)}${cell(both("qwen")[i])}</tr>`).join("");
  })
  .join("");
writeFileSync(
  "compare-designers.html",
  `<!doctype html><meta charset="utf-8"><title>Gemini vs Qwen designs</title><style>
  body{font:14px system-ui;margin:16px;background:#f4f4f2}table{border-collapse:collapse;width:100%}td,th{vertical-align:top;padding:8px;text-align:left}
  th{width:140px}.card{padding:16px;border-radius:8px}.card h2{margin:6px 0}.card button{border:0;padding:8px 14px;border-radius:6px}
  .sw span{display:inline-block;width:18px;height:18px;margin:4px 2px 0 0;border:1px solid #0002}</style>
  <table><tr><th></th><th>Gemini</th><th>Qwen</th></tr>${rows}</table>`,
);
console.log("Wrote compare-designers.json and compare-designers.html");
