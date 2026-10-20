import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

// Reads a seller's own product page (their game, their Etsy listing, their portfolio) when
// Channel3 doesn't know it. The URL comes from the user, so the server only ever fetches public
// addresses: no localhost, private ranges or cloud metadata, a few redirects, small bodies.

const MAX_BYTES = 2 * 1024 * 1024;

function privateAddress(ip: string): boolean {
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase();
    if (v.startsWith("::ffff:")) return privateAddress(v.slice(7));
    return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80");
  }
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
}

async function assertPublic(url: URL) {
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only http(s) links work.");
  if (url.port && !["80", "443"].includes(url.port)) throw new Error("That link uses an unusual port.");
  const hosts = isIP(url.hostname) ? [{ address: url.hostname }] : await lookup(url.hostname, { all: true });
  if (!hosts.length || hosts.some((h) => privateAddress(h.address))) throw new Error("That link isn't a public web page.");
}

/** fetch() that re-checks every redirect hop against assertPublic. */
async function safeFetch(raw: string, accept: string): Promise<Response> {
  let url = new URL(raw);
  for (let hop = 0; hop < 4; hop++) {
    await assertPublic(url);
    const res = await fetch(url, {
      redirect: "manual",
      headers: { accept, "user-agent": "OneThingBot/1.0 (+product page import)" },
      signal: AbortSignal.timeout(10_000),
    });
    const next = res.status >= 300 && res.status < 400 ? res.headers.get("location") : null;
    if (!next) return res;
    url = new URL(next, url);
  }
  throw new Error("Too many redirects.");
}

async function readCapped(res: Response): Promise<Uint8Array> {
  const reader = res.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > MAX_BYTES) {
      await reader.cancel();
      break;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export type PageInfo = {
  url: string;
  title: string | null;
  description: string | null;
  text: string;
  image: { data: Uint8Array; mime: string } | null;
};

const meta = (html: string, key: string) => {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag?.match(/content=["']([^"']*)["']/i)?.[1]?.trim() || null;
};
const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

/** Title, description, readable text and the share image of a public page. */
export async function fetchPage(rawUrl: string): Promise<PageInfo> {
  const res = await safeFetch(rawUrl, "text/html,application/xhtml+xml");
  if (!res.ok) throw new Error(`That page answered ${res.status}.`);
  const html = new TextDecoder().decode(await readCapped(res));
  const title = decode(meta(html, "og:title") ?? html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "") || null;
  const description = decode(meta(html, "og:description") ?? meta(html, "description") ?? "") || null;
  const text = decode(
    html
      .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).slice(0, 6000);

  const imgUrl = meta(html, "og:image") ?? meta(html, "twitter:image");
  const image = imgUrl ? await fetchImage(new URL(imgUrl, res.url || rawUrl).toString()) : null;
  return { url: rawUrl, title, description, text, image };
}

/** A public image (product photo, og:image), or null if it can't be had. */
export async function fetchImage(url: string): Promise<{ data: Uint8Array; mime: string } | null> {
  try {
    const res = await safeFetch(url, "image/*");
    const mime = res.headers.get("content-type")?.split(";")[0] ?? "";
    return res.ok && /^image\/(jpeg|png|webp|gif)$/.test(mime) ? { data: await readCapped(res), mime } : null;
  } catch {
    return null;
  }
}
