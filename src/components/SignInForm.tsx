"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// One field: an email or a phone number. New ones get an account, known ones are signed back in.

export function SignInForm({ cta = "Continue" }: { cta?: string }) {
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
  );
}
