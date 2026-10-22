"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PayPalLoginButton } from "@/components/SignInForm";

// Platform API keys: for a marketplace's server to make and manage shops for its sellers.
// Making or revoking one needs a PayPal-verified sign-in; the key itself is shown once.

type Key = { id: string; name: string; prefix: string; return_origins: string[]; created_at: string; last_used_at: string | null; revoked_at: string | null };

const day = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export function ApiKeys({ keys, verified }: { keys: Key[]; verified: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [origins, setOrigins] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fresh, setFresh] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/account/keys", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, returnOrigins: origins.split(/[\s,]+/).filter(Boolean) }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(json.error ?? "Something went wrong.");
    setFresh(json.key);
    setName("");
    setOrigins("");
    router.refresh();
  }

  async function revoke(k: Key) {
    if (!confirm(`Revoke "${k.name}"? Anything using it stops working right away.`)) return;
    const res = await fetch(`/api/account/keys/${k.id}`, { method: "DELETE" });
    if (!res.ok) setError((await res.json().catch(() => ({}))).error ?? "Couldn't revoke it.");
    router.refresh();
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold tracking-tight">Developer API keys</h2>
      <p className="mt-1 text-sm text-muted">
        For a platform that makes shops for its own sellers, such as a game marketplace. A key manages the shops it creates
        through the API. Keep it on your server. See the{" "}
        <a href="https://omarmiri.github.io/one-thing/" className="underline">API docs</a>.
      </p>

      {!verified ? (
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4">
          <p className="flex-1 text-sm">Keys need a verified sign-in. Log in with PayPal to make or revoke them.</p>
          <div className="w-full sm:w-64">
            <PayPalLoginButton next="/account" />
          </div>
        </div>
      ) : (
        <form onSubmit={create} className="mt-4 grid gap-3 rounded-2xl border border-line bg-white p-4 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
          <label className="text-sm font-medium">
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required placeholder="miriogames"
              className="mt-1 w-full rounded-xl border border-line px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-medium">
            Return addresses <span className="font-normal text-muted">(where Connect PayPal may send sellers back)</span>
            <input value={origins} onChange={(e) => setOrigins(e.target.value)} placeholder="https://www.example.com"
              className="mt-1 w-full rounded-xl border border-line px-3 py-2 font-normal" />
          </label>
          <button disabled={busy} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-60">
            {busy ? "Making…" : "Make a key"}
          </button>
        </form>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}

      {fresh && (
        <div className="mt-4 rounded-2xl border border-green-300 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-900">Copy your key now. It won&apos;t be shown again.</p>
          <div className="mt-2 flex gap-2">
            <code className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-white px-3 py-2 text-sm">{fresh}</code>
            <button type="button" className="rounded-full border border-line bg-white px-4 text-sm font-medium"
              onClick={async () => { await navigator.clipboard.writeText(fresh); setCopied(true); }}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {keys.length > 0 && (
        <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
          {keys.map((k) => (
            <li key={k.id} className={`flex flex-wrap items-center gap-x-4 gap-y-1 p-4 ${k.revoked_at ? "opacity-50" : ""}`}>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{k.name} <code className="ml-1 text-xs font-normal text-muted">{k.prefix}…</code></p>
                <p className="text-xs text-muted">
                  Made {day(k.created_at)} · {k.last_used_at ? `last used ${day(k.last_used_at)}` : "never used"}
                  {k.return_origins.length > 0 && ` · returns to ${k.return_origins.join(", ")}`}
                </p>
              </div>
              {k.revoked_at ? (
                <span className="text-xs font-semibold">Revoked</span>
              ) : (
                verified && (
                  <button type="button" onClick={() => revoke(k)} className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-red-700 hover:text-red-700">
                    Revoke
                  </button>
                )
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
