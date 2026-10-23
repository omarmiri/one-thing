"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Email and password for the usage dashboard's Supabase account; the password goes only to Supabase. */
export function AdminSignIn({ url, anonKey }: { url: string; anonKey: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(form: FormData) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`${url}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { apikey: anonKey, "content-type": "application/json" },
        body: JSON.stringify({ email: String(form.get("email")).trim(), password: form.get("password") }),
      });
      const session = (await r.json()) as { access_token?: string; error_description?: string; msg?: string };
      if (!session.access_token) throw new Error(session.error_description ?? session.msg ?? "Sign-in failed.");
      const s = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ accessToken: session.access_token }),
      });
      if (!s.ok) throw new Error(((await s.json()) as { error?: string }).error ?? "Sign-in failed.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <form action={signIn} className="mt-8 max-w-sm space-y-3 rounded-xl border border-line bg-white p-5">
      <p className="text-sm text-muted">Sign in with your usage dashboard account.</p>
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" autoComplete="username" required className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input name="password" type="password" autoComplete="current-password" required className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
      </label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="w-full rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-50">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export function AdminSignOut() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-sm underline"
      onClick={async () => {
        await fetch("/api/admin/session", { method: "DELETE" });
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
