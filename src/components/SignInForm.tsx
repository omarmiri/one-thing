"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// One field: an email or a phone number. New ones get an account, known ones are signed back in.
// Or Log in with PayPal, which also tells us where the seller's sales should be paid.

export function PayPalLoginButton({ next, label = "Log in with PayPal" }: { next: string; label?: string }) {
  return (
    <a
      href={`/api/account/paypal?next=${encodeURIComponent(next)}`}
      className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white"
      style={{ background: "#0070ba" }}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="currentColor">
        <path d="M7.1 21.5H3.6a.5.5 0 0 1-.5-.6L5.9 3a.6.6 0 0 1 .6-.5h6.9c3.4 0 5.6 1.8 5 5.2-.7 4-3.4 5.7-7 5.7H9.3a.6.6 0 0 0-.6.5l-1 6.6a.6.6 0 0 1-.6.5Z" opacity=".7" />
        <path d="M19.4 8.1c-.8 4.2-3.6 6-7.4 6H10.4l-1.3 8a.4.4 0 0 0 .4.5h3a.5.5 0 0 0 .5-.4l.6-3.6a.5.5 0 0 1 .5-.4h.9c3.1 0 5.4-1.4 6-4.8.4-2.1-.1-3.6-1.6-5.3Z" />
      </svg>
      {label}
    </a>
  );
}

export function SignInForm({ cta = "Continue", paypal, next = "/account" }: { cta?: string; paypal?: boolean; next?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/account/signin", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ identifier: value }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error ?? "Something went wrong.");
      setBusy(false);
      return;
    }
    router.refresh(); // the page re-renders signed in
  }

  return (
    <div className="space-y-5">
      {paypal && (
        <>
          <PayPalLoginButton next={next} />
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
            <span className="h-px flex-1 bg-line" />
            or
            <span className="h-px flex-1 bg-line" />
          </div>
        </>
      )}
      <form onSubmit={submit} className="space-y-3">
        <label className="block space-y-1.5">
          <span className="block text-sm font-medium">Email or phone number</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="username"
            inputMode="email"
            autoFocus
            required
            placeholder="you@example.com or +1 555 123 4567"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-accent"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        <button disabled={busy || !value.trim()} className="w-full rounded-full bg-foreground px-6 py-3 font-semibold text-background disabled:opacity-50">
          {busy ? "One moment…" : cta}
        </button>
        <p className="text-xs text-muted">No password. We use this to keep your shops together.</p>
      </form>
    </div>
  );
}
