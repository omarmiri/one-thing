"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Start = "photo" | "link" | "find";
type Found = {
  id: string;
  title: string;
  brand: string | null;
  image: string;
  price: number;
  currency: string;
  retailer: string;
  retailers: number;
  commission: number;
};

const STAGES: Record<Start, string[]> = {
  photo: ["Looking at your photo", "Working out what it is", "Choosing colours and type", "Writing the page", "Setting up checkout"],
  link: ["Reading the page", "Working out what it is", "Choosing colours and type", "Writing the page", "Setting up checkout"],
  find: ["Getting the product", "Checking prices at each store", "Choosing colours and type", "Writing your recommendation"],
};

const money = (n: number, c: string) => new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(n);

export function NewShopForm({ geminiReady, channel3Ready }: { geminiReady: boolean; channel3Ready: boolean }) {
  const router = useRouter();
  const [start, setStart] = useState<Start>("photo");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Found[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState<Found | null>(null);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!busy) return;
    const t = setInterval(() => setStage((s) => Math.min(s + 1, STAGES[start].length - 1)), 3200);
    return () => clearInterval(t);
  }, [busy, start]);

  function choosePhoto(f: File | undefined) {
    if (!f || !f.type.startsWith("image/")) return;
    setPhoto(f);
    setPreview(URL.createObjectURL(f));
  }

  async function search(e?: React.FormEvent) {
    e?.preventDefault();
    if (q.trim().length < 2) return;
    setSearching(true);
    setError(null);
    setPicked(null);
    const res = await fetch(`/api/channel3/search?q=${encodeURIComponent(q.trim())}`);
    const json = await res.json().catch(() => ({ error: "Search failed." }));
    setSearching(false);
    if (!res.ok) setError(json.error);
    else setResults(json.products);
  }

  const ready =
    start === "photo"
      ? Boolean(photo) || note.trim().length >= 10
      : start === "link"
        ? /^https?:\/\/\S+\.\S+/.test(url.trim())
        : Boolean(picked);

  async function build() {
    if (!ready || busy) return;
    const body = new FormData();
    if (start === "photo") {
      body.set("source", "photo");
      if (photo) body.set("photo", photo);
      if (note.trim()) body.set("description", note.trim());
    } else if (start === "link") {
      body.set("source", "link");
      body.set("url", url.trim());
    } else {
      body.set("source", "channel3");
      body.set("productId", picked!.id);
    }
    setError(null);
    setStage(0);
    setBusy(true);
    const res = await fetch("/api/shops", { method: "POST", body });
    const json = await res.json().catch(() => ({ error: "Something went wrong. Please try again." }));
    if (!res.ok) {
      setBusy(false);
      setError(json.error);
      return;
    }
    try {
      localStorage.setItem(`one-thing:${json.slug}`, json.token);
    } catch {}
    router.push(json.manageUrl);
  }

  const tab = (s: Start, label: string, hint: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={start === s}
      onClick={() => {
        setStart(s);
        setError(null);
      }}
      className={`flex-1 rounded-xl px-4 py-3 text-left transition ${start === s ? "bg-white shadow-sm ring-1 ring-line" : "hover:bg-white/60"}`}
    >
      <span className="block font-semibold">{label}</span>
      <span className="block text-xs text-muted">{hint}</span>
    </button>
  );

  if (busy) {
    return (
      <div className="rounded-3xl border border-line bg-white p-10 text-center" role="status" aria-live="polite">
        <div className="mx-auto mb-6 size-12 animate-spin rounded-full border-4 border-line border-t-accent" />
        <p className="text-xl font-semibold">{STAGES[start][stage]}…</p>
        <ol className="mx-auto mt-6 max-w-xs space-y-1.5 text-left text-sm">
          {STAGES[start].map((s, i) => (
            <li key={s} className={`flex items-center gap-2 ${i < stage ? "" : i === stage ? "font-medium text-accent" : "text-muted/60"}`}>
              <span aria-hidden className={`size-1.5 rounded-full ${i <= stage ? "bg-accent" : "bg-line"}`} />
              {s}
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-muted">Usually 15–30 seconds. You&apos;ll check everything before it goes live.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!geminiReady && (
        <p className="rounded-lg bg-amber-100 px-4 py-3 text-sm text-amber-900">
          GEMINI_API_KEY isn&apos;t set, so you&apos;ll get a placeholder design.
        </p>
      )}

      <div role="tablist" className="flex flex-col gap-1 rounded-2xl bg-line/50 p-1.5 sm:flex-row">
        {tab("photo", "Upload a photo", "Your own product")}
        {tab("link", "Paste a link", "A product page, your app or game")}
        {channel3Ready && tab("find", "Find a product", "Recommend it, earn per sale")}
      </div>

      {start === "photo" && (
        <div className="space-y-3">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              choosePhoto(e.dataTransfer.files[0]);
            }}
            className={`flex aspect-[16/9] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-white transition ${dragging ? "border-accent bg-accent/5" : "border-line hover:border-accent"}`}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- local object URL
              <img src={preview} alt="Your product" className="h-full w-full object-contain" />
            ) : (
              <span className="text-center text-muted">
                <span className="block text-lg font-medium text-foreground">Drop a photo, or tap to choose</span>
                A phone snap is fine
              </span>
            )}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => choosePhoto(e.target.files?.[0])} />
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything we should know? (optional) e.g. hand-thrown, 12 oz, dishwasher safe"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-accent"
          />
        </div>
      )}

      {start === "link" && (
        <div className="space-y-2">
          <input
            autoFocus
            type="url"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && build()}
            placeholder="https://"
            className="w-full rounded-xl border border-line bg-white px-4 py-4 text-lg outline-none focus:border-accent"
          />
          <p className="text-sm text-muted">
            Your own page (a game, an app, an Etsy listing) becomes a shop that takes PayPal. A store&apos;s product page
            becomes a recommendation that earns you a commission.
          </p>
        </div>
      )}

      {start === "find" && (
        <div className="space-y-4">
          <form onSubmit={search} className="flex gap-2">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. gifts for trail runners under $60"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-accent"
            />
            <button
              disabled={searching || q.trim().length < 2}
              className="rounded-xl bg-foreground px-5 font-semibold text-background disabled:opacity-50"
            >
              {searching ? "…" : "Search"}
            </button>
          </form>
          {results && results.length === 0 && <p className="text-sm text-muted">Nothing found. Try different words.</p>}
          {results && results.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setPicked(p)}
                    aria-pressed={picked?.id === p.id}
                    className={`block w-full overflow-hidden rounded-xl border bg-white text-left transition ${picked?.id === p.id ? "border-accent ring-2 ring-accent" : "border-line hover:border-accent"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- Channel3 CDN */}
                    <img src={p.image} alt="" className="aspect-square w-full bg-white object-contain p-2" />
                    <span className="block space-y-0.5 p-3">
                      <span className="line-clamp-2 text-sm font-medium">{p.title}</span>
                      <span className="block text-sm">
                        {money(p.price, p.currency)} <span className="text-muted">at {p.retailer}</span>
                      </span>
                      {p.commission > 0 && (
                        <span className="block text-xs font-semibold text-green-700">
                          Earn up to {Math.round(p.commission * 100)}%
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        onClick={build}
        disabled={!ready}
        className="w-full rounded-full bg-foreground px-6 py-4 text-lg font-semibold text-background transition disabled:opacity-40"
      >
        Build my shop →
      </button>
      <p className="text-center text-sm text-muted">AI drafts everything. You check it, then go live with PayPal.</p>
    </div>
  );
}
