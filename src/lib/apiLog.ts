"use client";

import { isTestMode } from "./testMode";

// The Test Panel's API log: every call this page makes to our own /api/*, while test mode is on.
// It wraps window.fetch, so it sees exactly what the site sends: the same REST API as the
// APIMatic docs. Kept in sessionStorage so a call survives the page change it causes (/new →
// /manage). Tokens are masked before anything is stored or shown.

export type ApiCall = {
  id: number;
  at: number;
  method: string;
  path: string;
  status?: number;
  ms?: number;
  req?: string;
  res?: string;
  error?: string;
};

const STORE = "onething-api-log";
const MAX = 40;
// The visit beacon fires on every shop page and isn't part of the public API: noise here.
const SKIP = /\/visit$/;

let calls: ApiCall[] | null = null;
const listeners = new Set<() => void>();

const load = () => {
  if (calls) return calls;
  try {
    calls = JSON.parse(sessionStorage.getItem(STORE) ?? "[]") as ApiCall[];
  } catch {
    calls = [];
  }
  return calls;
};

const save = (next: ApiCall[]) => {
  calls = next.slice(0, MAX);
  try {
    sessionStorage.setItem(STORE, JSON.stringify(calls));
  } catch {}
  listeners.forEach((l) => l());
};

const update = (id: number, patch: Partial<ApiCall>) => save(load().map((c) => (c.id === id ? { ...c, ...patch } : c)));

export const apiCalls = () => load();
export const subscribeApiLog = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
export const clearApiLog = () => save([]);

const SECRET_KEY = /^(token|adminToken|admin_token|.*secret.*|password|apiKey|api_key|key)$/i;
const mask = (v: unknown): unknown => {
  if (typeof v === "string") return v.replace(/([?&#](?:token|key)=)[^&\s"]+/gi, "$1•••");
  if (Array.isArray(v)) return v.map(mask);
  if (v && typeof v === "object")
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, SECRET_KEY.test(k) && x ? "•••" : mask(x)]));
  return v;
};

const LIMIT = 4000;
const preview = (text: string) => {
  try {
    const pretty = JSON.stringify(mask(JSON.parse(text)), null, 2);
    return pretty.length > LIMIT ? `${pretty.slice(0, LIMIT)}\n…` : pretty;
  } catch {
    return text.length > 600 ? `${text.slice(0, 600)}…` : (mask(text) as string);
  }
};

const size = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.ceil(n / 1e3)} KB`);

const describe = (body: BodyInit | null | undefined) => {
  if (body == null) return undefined;
  if (typeof body === "string") return preview(body);
  if (body instanceof FormData) {
    const fields: Record<string, string> = {};
    body.forEach((v, k) => {
      fields[k] = typeof v === "string" ? v : `<file ${v.name || "upload"}, ${size(v.size)}>`;
    });
    return JSON.stringify(mask(fields), null, 2);
  }
  return "<binary body>";
};

let installed = false;

/** Wraps window.fetch once. Calls are only recorded while test mode is on. */
export function installApiLog() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  const original = window.fetch.bind(window);
  let next = Date.now();
  window.fetch = async (input, init) => {
    const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(raw, window.location.href);
    if (!isTestMode() || url.origin !== window.location.origin || !url.pathname.startsWith("/api/") || SKIP.test(url.pathname)) {
      return original(input, init);
    }
    const id = next++;
    const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
    save([{ id, at: Date.now(), method, path: url.pathname + url.search, req: describe(init?.body) }, ...load()]);
    const started = performance.now();
    try {
      const res = await original(input, init);
      update(id, { status: res.status, ms: Math.round(performance.now() - started) });
      res
        .clone()
        .text()
        .then((t) => update(id, { res: preview(t) }))
        .catch(() => {});
      return res;
    } catch (err) {
      update(id, { error: (err as Error).message || "Network error", ms: Math.round(performance.now() - started) });
      throw err;
    }
  };
}

// ---- Matching a call to its operation in the docs ------------------------------------------------

export type Operation = { method: string; re: RegExp; op: string; tag: string };

let ops: Promise<Operation[]> | null = null;

/**
 * The spec's operations, read from /openapi.yaml. A line scan rather than a YAML parser: the spec
 * keeps paths at two spaces, methods at four and tags/operationId at six.
 */
export function operations() {
  ops ??= fetch("/openapi.yaml")
    .then((r) => r.text())
    .then((yaml) => {
      const out: Operation[] = [];
      let path = "";
      let cur: Partial<Operation> | null = null;
      const done = () => cur?.op && cur.tag && out.push(cur as Operation);
      for (const line of yaml.split("\n")) {
        const p = /^ {2}(\/\S*):\s*$/.exec(line);
        const m = /^ {4}(get|post|put|patch|delete):\s*$/.exec(line);
        if (p || m || /^\S/.test(line)) {
          done();
          cur = null;
        }
        if (p) path = p[1];
        if (m && path) cur = { method: m[1].toUpperCase(), re: new RegExp(`^${path.replace(/\{[^}]+\}/g, "[^/]+")}$`) };
        const tag = /^ {6}tags: \[([^\],]+)/.exec(line);
        if (tag && cur) cur.tag = tag[1].trim();
        const op = /^ {6}operationId: (\S+)/.exec(line);
        if (op && cur) cur.op = op[1];
      }
      done();
      return out;
    })
    .catch(() => []);
  return ops;
}

const kebab = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();

/** The operation's page in the APIMatic portal. */
export const docsUrl = (o: Operation) => `https://omarmiri.github.io/one-thing/#/http/api-endpoints/${kebab(o.tag)}/${kebab(o.op)}`;
