"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { apiCalls, clearApiLog, docsUrl, operations, subscribeApiLog, type ApiCall, type Operation } from "@/lib/apiLog";

const none: ApiCall[] = [];

/** The Test Panel's API log: what this page sent to the OneThing API, each call linked to its docs. */
export function ApiLog() {
  const calls = useSyncExternalStore(subscribeApiLog, apiCalls, () => none);
  const [ops, setOps] = useState<Operation[]>([]);
  useEffect(() => {
    void operations().then(setOps);
  }, []);
  const opFor = (c: ApiCall) => ops.find((o) => o.method === c.method && o.re.test(c.path.split("?")[0]));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">API log</h2>
      <p className="text-muted">
        Every call this page makes to the OneThing API, as it happens. The site runs on the same API
        that&apos;s in the{" "}
        <a href="https://omarmiri.github.io/one-thing/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          APIMatic docs
        </a>
        : each call links to its page there. Tokens are hidden.
      </p>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          {calls.length} call{calls.length === 1 ? "" : "s"}, newest first
        </span>
        {calls.length > 0 && (
          <button onClick={clearApiLog} className="hover:text-foreground">
            Clear
          </button>
        )}
      </div>
      {calls.length === 0 && (
        <p className="rounded-xl border border-dashed border-line p-4 text-center text-muted">
          Nothing yet. Make a shop, change one, or buy something, and its calls show up here.
        </p>
      )}
      {calls.map((c) => {
        const o = opFor(c);
        const ok = c.status !== undefined && c.status < 400;
        return (
          <details key={c.id} className="group rounded-xl border border-line bg-white open:border-accent/70">
            <summary className="flex cursor-pointer list-none items-center gap-2 p-3 [&::-webkit-details-marker]:hidden">
              <span className="w-12 shrink-0 font-mono text-[11px] font-bold text-accent">{c.method}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-xs">{c.path}</span>
                {o && <span className="block text-xs text-muted">{o.op}</span>}
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold ${
                  c.error ? "bg-red-100 text-red-700" : c.status === undefined ? "bg-black/5 text-muted" : ok ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {c.error ? "failed" : (c.status ?? "…")}
              </span>
              <span className="w-14 shrink-0 text-right font-mono text-[11px] text-muted">{c.ms !== undefined ? `${c.ms} ms` : ""}</span>
            </summary>
            <div className="space-y-3 border-t border-line p-3">
              {o && (
                <a
                  href={docsUrl(o)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-line px-3 py-1 text-xs font-semibold hover:border-accent/70"
                >
                  {o.op} in the APIMatic docs ↗
                </a>
              )}
              {c.req && <Body label="Request" text={c.req} />}
              {c.error && <p className="text-xs text-red-700">{c.error}</p>}
              {c.res && <Body label="Response" text={c.res} />}
            </div>
          </details>
        );
      })}
    </div>
  );
}

const Body = ({ label, text }: { label: string; text: string }) => (
  <div>
    <p className="text-[11px] uppercase tracking-wider text-muted">{label}</p>
    <pre className="mt-1 max-h-64 overflow-auto rounded-lg bg-black/5 p-2 font-mono text-[11px] leading-relaxed">{text}</pre>
  </div>
);
