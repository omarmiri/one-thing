"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Kind = "auto" | "physical" | "digital";

const STAGES = ["Looking at your photo…", "Choosing colours and fonts…", "Writing your page…", "Almost done…"];

export function NewShopForm({ geminiReady }: { geminiReady: boolean }) {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>("auto");
  const [delivery, setDelivery] = useState<"file" | "access_code">("file");
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!busy) return;
    const t = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 3500);
    return () => clearInterval(t);
  }, [busy]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    setStage(0);
    const res = await fetch("/api/shops", { method: "POST", body: new FormData(e.currentTarget) });
    const json = await res.json().catch(() => ({ error: "Something went wrong." }));
    if (!res.ok) {
      setBusy(false);
      setError(json.error);
      return;
    }
    // The manage link is the seller's key to this shop — keep a copy on this device.
    try {
      localStorage.setItem(`one-thing:${json.slug}`, json.token);
    } catch {}
    router.push(json.manageUrl);
  }

  const input = "w-full rounded-lg border border-line bg-white px-3 py-2.5 outline-none focus:border-accent";
  const label = "block text-sm font-medium mb-1.5";

  return (
    <form onSubmit={submit} className="space-y-7">
      {!geminiReady && (
        <p className="rounded-lg bg-amber-100 px-4 py-3 text-sm text-amber-900">
          GEMINI_API_KEY isn&apos;t set, so you&apos;ll get a placeholder design. Add it to .env.local for the AI designer.
        </p>
      )}

      <div>
        <span className={label}>Product photo</span>
        <label className="flex aspect-[16/9] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line bg-white hover:border-accent">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local object URL
            <img src={preview} alt="Your product" className="h-full w-full object-contain" />
          ) : (
            <span className="text-center text-muted">
              <span className="block text-lg font-medium text-foreground">Add a photo</span>
              A phone snap is fine — the AI designs around it
            </span>
          )}
          <input
            name="photo"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
          />
        </label>
      </div>

      <div>
        <label htmlFor="description" className={label}>What are you selling?</label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          rows={4}
          className={input}
          placeholder="Hand-thrown stoneware mug, 12 oz, glazed in ocean blue. Dishwasher safe. I make each one in my garage studio in Portland."
        />
        <p className="mt-1.5 text-sm text-muted">A few sentences. Mention anything a buyer should know — size, materials, what&apos;s included.</p>
      </div>

      <fieldset>
        <legend className={label}>Kind of product</legend>
        <div className="grid grid-cols-3 gap-2">
          {(["auto", "physical", "digital"] as const).map((k) => (
            <label
              key={k}
              className={`cursor-pointer rounded-lg border px-3 py-2.5 text-center text-sm ${kind === k ? "border-accent bg-accent/5 font-semibold" : "border-line bg-white"}`}
            >
              <input type="radio" name="type" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
              {k === "auto" ? "Let AI decide" : k === "physical" ? "Physical item" : "Digital file"}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className={label}>Price (USD)</label>
          <input id="price" name="price" type="number" min="0.5" step="0.01" className={input} placeholder="Leave blank for an AI suggestion" />
        </div>
        {kind !== "digital" && (
          <div>
            <label htmlFor="shipping" className={label}>Shipping (USD)</label>
            <input id="shipping" name="shipping" type="number" min="0" step="0.01" className={input} placeholder="0 for free shipping" />
          </div>
        )}
        {kind !== "digital" && (
          <div>
            <label htmlFor="stock" className={label}>How many do you have?</label>
            <input id="stock" name="stock" type="number" min="0" step="1" className={input} placeholder="Blank = unlimited" />
          </div>
        )}
        {kind !== "digital" && (
          <div>
            <label htmlFor="ship_countries" className={label}>Ships to</label>
            <input id="ship_countries" name="ship_countries" className={input} defaultValue="US" placeholder="US,CA" />
          </div>
        )}
      </div>

      {kind !== "physical" && (
        <fieldset className="space-y-3">
          <legend className={label}>How buyers get it {kind === "auto" && "(if it's digital)"}</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["file", "access_code"] as const).map((d) => (
              <label
                key={d}
                className={`cursor-pointer rounded-lg border px-3 py-2.5 text-center text-sm ${delivery === d ? "border-accent bg-accent/5 font-semibold" : "border-line bg-white"}`}
              >
                <input type="radio" name="delivery" value={d} checked={delivery === d} onChange={() => setDelivery(d)} className="sr-only" />
                {d === "file" ? "A file to download" : "An access code for my app or game"}
              </label>
            ))}
          </div>
          {delivery === "file" ? (
            <div>
              <input id="digital_file" name="digital_file" type="file" aria-label="File buyers download" className={input} />
              <p className="mt-1.5 text-sm text-muted">Up to 25 MB. You can add or replace it later.</p>
            </div>
          ) : (
            <div>
              <input name="access_url" type="url" aria-label="Where buyers use the code" placeholder="https://yourgame.com/play/" className={input} />
              <p className="mt-1.5 text-sm text-muted">
                Each buyer gets a unique code and a link here with the code attached. Your app checks codes with
                OneThing&apos;s verify API.
              </p>
            </div>
          )}
        </fieldset>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="paypal_email" className={label}>Your PayPal email</label>
          <input id="paypal_email" name="paypal_email" type="email" className={input} placeholder="Where buyers' payments go" />
          <p className="mt-1.5 text-sm text-muted">Sandbox: use a sandbox business account email.</p>
        </div>
        <div>
          <label htmlFor="seller_email" className={label}>Your email</label>
          <input id="seller_email" name="seller_email" type="email" className={input} placeholder="For order notifications" />
        </div>
      </div>

      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <button
        disabled={busy}
        className="w-full rounded-full bg-foreground px-6 py-4 text-lg font-semibold text-background disabled:opacity-70"
      >
        {busy ? STAGES[stage] : "Design my shop"}
      </button>
    </form>
  );
}
