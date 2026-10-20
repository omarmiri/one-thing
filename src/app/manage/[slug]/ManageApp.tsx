"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { OrdersGrid, type SellerOrder } from "./OrdersGrid";

type Settings = {
  price: number;
  shipping: number;
  stock: number | null;
  ship_countries: string | null;
  paypal_email: string | null;
  seller_email: string | null;
  zapier_hook_url: string | null;
};

type Initial = {
  slug: string;
  status: "draft" | "live";
  productType: "digital" | "physical";
  name: string;
  heroStatus: "none" | "pending" | "ready" | "failed";
  hasDigitalFile: boolean;
  delivery: "file" | "access_code";
  accessUrl: string | null;
  aiSource: "gemini" | "fallback";
  settings: Settings;
};

const SUGGESTIONS = ["Make it feel more premium", "Warmer colours", "Shorter, punchier copy", "Make it playful"];

export function ManageApp(props: {
  token: string;
  initial: Initial;
  orders: SellerOrder[];
  geminiReady: boolean;
  paypalReady: boolean;
}) {
  const { token, initial } = props;
  const slug = initial.slug;
  const [status, setStatus] = useState(initial.status);
  const [heroStatus, setHeroStatus] = useState(initial.heroStatus);
  const [hasFile, setHasFile] = useState(initial.hasDigitalFile);
  const [orders, setOrders] = useState(props.orders);
  const [frameKey, setFrameKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const shopPath = `/s/${slug}`;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const api = useCallback(
    async (path: string, init: RequestInit = {}): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any -- each caller knows its shape
      const res = await fetch(`/api/shops/${slug}${path}`, {
        ...init,
        headers: { "x-admin-token": token, ...(init.body instanceof FormData ? {} : { "content-type": "application/json" }), ...init.headers },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      return json;
    },
    [slug, token],
  );

  // Hero art is generated in the background after creation; refresh the preview when it lands.
  useEffect(() => {
    if (heroStatus !== "pending") return;
    const t = setInterval(async () => {
      const shop = await api("").catch(() => null);
      if (shop && shop.hero_status !== "pending") {
        setHeroStatus(shop.hero_status);
        setFrameKey((k) => k + 1);
      }
    }, 3000);
    return () => clearInterval(t);
  }, [heroStatus, api]);

  // New sales show up without a reload.
  useEffect(() => {
    if (status !== "live") return;
    const t = setInterval(() => api("/orders").then(setOrders).catch(() => {}), 15000);
    return () => clearInterval(t);
  }, [status, api]);

  async function publish(next: "live" | "draft") {
    try {
      await api("", { method: "PATCH", body: JSON.stringify({ status: next }) });
      setStatus(next);
      setFrameKey((k) => k + 1);
      setToast(next === "live" ? "Your shop is live!" : "Unpublished");
    } catch (e) {
      setToast((e as Error).message);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight">OneThing</Link>
          <span className="text-muted">/</span>
          <span className="truncate font-medium">{initial.name}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status === "live" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-900"}`}>
            {status === "live" ? "Live" : "Draft"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            {status === "live" ? (
              <>
                <button
                  className="rounded-full border border-line px-4 py-2 text-sm"
                  onClick={() => navigator.clipboard.writeText(window.location.origin + shopPath).then(() => setToast("Link copied"))}
                >
                  Copy shop link
                </button>
                <button className="px-3 py-2 text-sm text-muted" onClick={() => publish("draft")}>Unpublish</button>
              </>
            ) : (
              <button className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background" onClick={() => publish("live")}>
                Publish
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_380px]">
        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2 text-xs text-muted">
            <span className="truncate">{shopPath}</span>
            <a href={`/s/${slug}?token=${token}`} target="_blank" className="ml-auto underline">Open</a>
          </div>
          <iframe key={frameKey} src={`/s/${slug}?token=${token}`} title="Shop preview" className="h-[78vh] w-full" />
        </section>

        <aside className="space-y-6">
          <DesignPanel
            api={api}
            geminiReady={props.geminiReady}
            aiSource={initial.aiSource}
            heroStatus={heroStatus}
            onChanged={() => setFrameKey((k) => k + 1)}
            onHero={() => setHeroStatus("pending")}
            onToast={setToast}
          />
          {initial.productType === "digital" && initial.delivery === "file" && (
            <FilePanel api={api} hasFile={hasFile} onUploaded={() => setHasFile(true)} onToast={setToast} />
          )}
          {initial.productType === "digital" && initial.delivery === "access_code" && (
            <AccessPanel api={api} slug={slug} initialUrl={initial.accessUrl} onToast={setToast} />
          )}
          <SettingsPanel
            api={api}
            physical={initial.productType === "physical"}
            initial={initial.settings}
            paypalReady={props.paypalReady}
            onSaved={() => {
              setFrameKey((k) => k + 1);
              setToast("Saved");
            }}
            onToast={setToast}
          />
        </aside>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-3 text-xl font-semibold">Orders</h2>
        <OrdersGrid
          orders={orders}
          physical={initial.productType === "physical"}
          onShip={async (orderId, carrier, trackingNumber, carrierName) => {
            try {
              const r = await api(`/orders/${orderId}/ship`, { method: "POST", body: JSON.stringify({ carrier, trackingNumber, carrierName }) });
              setOrders(await api("/orders"));
              setToast(r.synced ? "Shipped — tracking sent to the buyer's PayPal" : "Marked shipped");
              return null;
            } catch (e) {
              return (e as Error).message;
            }
          }}
        />
      </section>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full bg-foreground px-5 py-3 text-sm text-background shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

type Api = (path: string, init?: RequestInit) => Promise<{ synced?: boolean; hero_status?: Initial["heroStatus"] }>;

const panel = "rounded-2xl border border-line bg-white p-5";
const input = "w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent";

function DesignPanel(props: {
  api: Api;
  geminiReady: boolean;
  aiSource: "gemini" | "fallback";
  heroStatus: Initial["heroStatus"];
  onChanged(): void;
  onHero(): void;
  onToast(t: string): void;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  async function refine(instruction: string) {
    setBusy(true);
    try {
      await props.api("/refine", { method: "POST", body: JSON.stringify({ instruction }) });
      setHistory((h) => [...h, instruction]);
      setText("");
      props.onChanged();
    } catch (e) {
      props.onToast((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={panel}>
      <h2 className="font-semibold">Design with Gemini</h2>
      {!props.geminiReady ? (
        <p className="mt-2 text-sm text-muted">Add GEMINI_API_KEY to .env.local to redesign by chatting.</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">
            {props.aiSource === "fallback" ? "This shop has placeholder copy — ask for anything." : "Ask for any change and the page updates."}
          </p>
          {history.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {history.map((h, i) => (
                <li key={i} className="rounded-lg bg-background px-3 py-1.5">&ldquo;{h}&rdquo;</li>
              ))}
            </ul>
          )}
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) refine(text.trim());
            }}
          >
            <input value={text} onChange={(e) => setText(e.target.value)} disabled={busy} placeholder="e.g. darker, more luxurious" className={input} />
            <button disabled={busy || !text.trim()} className="rounded-lg bg-foreground px-4 text-sm font-semibold text-background disabled:opacity-50">
              {busy ? "…" : "Go"}
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} disabled={busy} onClick={() => refine(s)} className="rounded-full border border-line px-3 py-1 text-xs hover:border-accent">
                {s}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
            <span className="text-muted">
              Hero art:{" "}
              {props.heroStatus === "pending" ? "generating…" : props.heroStatus === "ready" ? "ready" : props.heroStatus === "failed" ? "failed" : "none"}
            </span>
            <button
              disabled={props.heroStatus === "pending"}
              className="underline disabled:opacity-50"
              onClick={() =>
                props.api("/hero", { method: "POST" }).then(props.onHero, (e: Error) => props.onToast(e.message))
              }
            >
              {props.heroStatus === "ready" ? "Regenerate" : "Generate"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function FilePanel(props: { api: Api; hasFile: boolean; onUploaded(): void; onToast(t: string): void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className={panel}>
      <h2 className="font-semibold">The file buyers get</h2>
      <p className="mt-1 text-sm text-muted">{props.hasFile ? "Uploaded. Buyers get a private download link after paying." : "Upload it before you publish."}</p>
      <input
        type="file"
        disabled={busy}
        className="mt-3 block w-full text-sm"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          const body = new FormData();
          body.set("file", f);
          try {
            await props.api("/file", { method: "POST", body });
            props.onUploaded();
            props.onToast("File uploaded");
          } catch (err) {
            props.onToast((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}

function AccessPanel(props: { api: Api; slug: string; initialUrl: string | null; onToast(t: string): void }) {
  const [url, setUrl] = useState(props.initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [origin, setOrigin] = useState("");
  return (
    <div className={panel}>
      <h2 className="font-semibold">Access codes</h2>
      <p className="mt-1 text-sm text-muted">
        Each buyer gets a unique code. After paying, they&apos;re sent to this link with <code>?code=</code> attached.
      </p>
      <form
        className="mt-3 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await props.api("", { method: "PATCH", body: JSON.stringify({ access_url: url.trim() || null }) });
            props.onToast("Saved");
          } catch (err) {
            props.onToast((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <input value={url} onChange={(e) => setUrl(e.target.value)} type="url" placeholder="https://yourgame.com/play/" className={input} />
        <button disabled={busy} className="rounded-lg bg-foreground px-4 text-sm font-semibold text-background">Save</button>
      </form>
      <details className="mt-3 text-sm" onToggle={() => setOrigin(window.location.origin)}>
        <summary className="cursor-pointer text-muted">How your app checks a code</summary>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-background p-3 text-xs">{`POST ${origin}/api/access/verify
{ "shop": "${props.slug}", "code": "K7QF-M2XP-9HTD" }
→ { "valid": true, "product": "..." }`}</pre>
      </details>
    </div>
  );
}

function SettingsPanel(props: {
  api: Api;
  physical: boolean;
  initial: Settings;
  paypalReady: boolean;
  onSaved(): void;
  onToast(t: string): void;
}) {
  const s = props.initial;
  const [busy, setBusy] = useState(false);
  const blank = (v: FormDataEntryValue | null) => (typeof v === "string" && v.trim() ? v.trim() : null);

  return (
    <form
      className={`${panel} space-y-3`}
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setBusy(true);
        try {
          await props.api("", {
            method: "PATCH",
            body: JSON.stringify({
              price: Number(f.get("price")),
              ...(props.physical && {
                shipping: Number(f.get("shipping") || 0),
                stock: blank(f.get("stock")) === null ? null : Number(f.get("stock")),
                ship_countries: blank(f.get("ship_countries")),
              }),
              paypal_email: blank(f.get("paypal_email")),
              seller_email: blank(f.get("seller_email")),
              zapier_hook_url: blank(f.get("zapier_hook_url")),
            }),
          });
          props.onSaved();
        } catch (err) {
          props.onToast((err as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="font-semibold">Settings</h2>
      {!props.paypalReady && (
        <p className="rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-900">
          PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET aren&apos;t set — checkout is disabled.
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (USD)"><input name="price" type="number" step="0.01" min="0.5" required defaultValue={s.price} className={input} /></Field>
        {props.physical && (
          <Field label="Shipping (USD)"><input name="shipping" type="number" step="0.01" min="0" defaultValue={s.shipping} className={input} /></Field>
        )}
        {props.physical && (
          <Field label="In stock"><input name="stock" type="number" min="0" step="1" defaultValue={s.stock ?? ""} placeholder="Unlimited" className={input} /></Field>
        )}
        {props.physical && (
          <Field label="Ships to"><input name="ship_countries" defaultValue={s.ship_countries ?? ""} placeholder="US,CA" className={input} /></Field>
        )}
      </div>
      <Field label="PayPal email (payments go here)">
        <input name="paypal_email" type="email" defaultValue={s.paypal_email ?? ""} className={input} />
      </Field>
      <Field label="Your email">
        <input name="seller_email" type="email" defaultValue={s.seller_email ?? ""} className={input} />
      </Field>
      <Field label="Zapier webhook (optional)">
        <input name="zapier_hook_url" type="url" defaultValue={s.zapier_hook_url ?? ""} placeholder="https://hooks.zapier.com/…" className={input} />
      </Field>
      <p className="text-xs text-muted">Every paid order is sent to this Zapier hook — add it to a sheet, Slack, or a shipping label app.</p>
      <button disabled={busy} className="w-full rounded-full bg-foreground py-2.5 text-sm font-semibold text-background">
        {busy ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted">{label}</span>
      {children}
    </label>
  );
}
