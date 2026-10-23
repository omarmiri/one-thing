"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrdersGrid, type SellerOrder } from "./OrdersGrid";
import { PhotosPanel, type Photo } from "./PhotosPanel";
import { SetupPanel, type SetupInitial, type ToastAction } from "./SetupPanel";
import type { WebhookEvent } from "@/lib/shops";
import type { Stats } from "@/lib/stats";
import { StatsView } from "@/components/StatsView";
import { Unreachable } from "@/lib/uploadFallback";

type Initial = {
  status: "draft" | "live";
  name: string;
  heroStatus: "none" | "pending" | "ready" | "failed";
  aiSource: "gemini" | "fallback";
  photos: Photo[] | null; // null for recommendations, which use the retailer's photos
  setup: SetupInitial;
};

const SUGGESTIONS = ["Make it feel more premium", "Warmer colours", "Shorter, punchier copy", "Make it playful"];

export function ManageApp(props: {
  token: string;
  initial: Initial;
  orders: SellerOrder[];
  webhooks: WebhookEvent[];
  geminiReady: boolean;
  paypalReady: boolean;
  linkPrefix: string;
  ab: AbInitial | null;
}) {
  const { token, initial } = props;
  const router = useRouter();
  const slug = initial.setup.slug;
  const [status, setStatus] = useState(initial.status);
  const [heroStatus, setHeroStatus] = useState(initial.heroStatus);
  const [orders, setOrders] = useState(props.orders);
  const [webhooks, setWebhooks] = useState(props.webhooks);
  const [frameKey, setFrameKey] = useState(0);
  // Shared with the setup panel, where each colour can point at one of these photos.
  const [photos, setPhotos] = useState(initial.photos ?? []);
  const [toast, setToastState] = useState<{ text: string; action?: ToastAction } | null>(null);
  const setToast = useCallback((text: string | null, action?: ToastAction) => setToastState(text ? { text, action } : null), []);
  const shopPath = `/${slug}`;

  useEffect(() => {
    if (!toast) return;
    // Longer when there's something to click, like Undo.
    const t = setTimeout(() => setToast(null), toast.action ? 7000 : 3500);
    return () => clearTimeout(t);
  }, [toast, setToast]);

  const api = useCallback(
    async (path: string, init: RequestInit = {}): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any -- each caller knows its shape
      const res = await fetch(`/api/shops/${slug}${path}`, {
        ...init,
        headers: { "x-admin-token": token, ...(init.body instanceof FormData ? {} : { "content-type": "application/json" }), ...init.headers },
        signal: init.signal ?? AbortSignal.timeout(90_000),
      }).catch(() => {
        throw new Unreachable();
      });
      // Every shop route answers in JSON, so anything else came from a proxy, not from us.
      const json = await res.json().catch(() => {
        throw new Unreachable();
      });
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
    const t = setInterval(() => {
      api("/orders").then(setOrders).catch(() => {});
      api("/webhooks").then(setWebhooks).catch(() => {});
    }, 15000);
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
          <Link href="/account" className="font-semibold tracking-tight">Your shops</Link>
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
              <button form="setup" name="intent" value="live" className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background">
                Go live
              </button>
            )}
          </div>
        </div>
      </header>

      {status === "draft" && (
        <div className="mx-auto max-w-7xl px-4 pt-6">
          <p className="rounded-2xl bg-accent/10 px-5 py-4 text-sm">
            <strong>Your shop is drafted.</strong> The AI guessed what you&apos;re selling and designed the page. Check the
            details on the right, ask for any design change, then go live.
          </p>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_400px]">
        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2 text-xs text-muted">
            <span className="truncate">{shopPath}</span>
            <a href={`/${slug}?token=${token}`} target="_blank" className="ml-auto underline">Open</a>
          </div>
          <iframe key={frameKey} src={`/${slug}?token=${token}`} title="Shop preview" className="h-[78vh] w-full" />
        </section>

        <aside className="space-y-6">

          <SetupPanel
            api={api}
            initial={initial.setup}
            photos={photos}
            draft={status === "draft"}
            paypalReady={props.paypalReady}
            linkPrefix={props.linkPrefix}
            onToast={setToast}
            onSaved={({ slug: next, live }) => {
              if (live) setStatus("live");
              setToast(live ? "You're live. Share your link!" : "Saved");
              // A new link name moves the manage page too (old names keep working).
              if (next !== slug) router.replace(`/manage/${next}?token=${token}`);
              else {
                router.refresh();
                setFrameKey((k) => k + 1);
              }
            }}
          />
          {initial.photos && (
            <PhotosPanel
              api={api}
              initial={initial.photos}
              onChanged={(next) => {
                setPhotos(next);
                setFrameKey((k) => k + 1);
              }}
              onToast={setToast}
            />
          )}
          <DesignPanel
            api={api}
            geminiReady={props.geminiReady}
            aiSource={initial.aiSource}
            heroStatus={heroStatus}
            onChanged={() => setFrameKey((k) => k + 1)}
            onHero={() => setHeroStatus("pending")}
            onToast={setToast}
          />
          {props.ab && <AbPanel api={api} initial={props.ab} onChanged={() => setFrameKey((k) => k + 1)} onToast={setToast} />}
        </aside>
      </div>

      <StatsSection api={api} live={status === "live"} />

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-3 text-xl font-semibold">Orders</h2>
        <OrdersGrid
          orders={orders}
          physical={initial.setup.productType === "physical"}
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

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-3 flex items-baseline gap-3">
          <h2 className="text-xl font-semibold">PayPal webhooks</h2>
          <span className="text-sm text-muted">Events PayPal sent about this shop&apos;s orders, newest first</span>
        </div>
        <WebhookLog events={webhooks} />
      </section>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4 rounded-full bg-foreground px-5 py-3 text-sm text-background shadow-lg">
          {toast.text}
          {toast.action && (
            <button
              className="font-semibold underline"
              onClick={() => {
                toast.action!.run();
                setToast(null);
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function WebhookLog({ events }: { events: WebhookEvent[] }) {
  if (!events.length) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-white p-6 text-sm text-muted">
        Nothing yet. After a sale, PayPal sends PAYMENT.CAPTURE.COMPLETED here within a few seconds; each delivery is
        checked against PayPal&apos;s signature before it can change an order.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {events.map((e) => (
        <li key={e.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
          <code className="font-semibold">{e.event_type}</code>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${e.verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {e.verified ? "Signature verified" : "Not verified"}
          </span>
          {e.summary && <span>{e.summary}</span>}
          <span className="text-muted">{e.outcome}</span>
          <span className="ml-auto text-xs text-muted">
            {new Date(e.received_at).toLocaleString([], { dateStyle: "medium", timeStyle: "medium" })}
            {e.paypal_order_id && ` · order ${e.paypal_order_id}`}
          </span>
        </li>
      ))}
    </ul>
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

// ---- Visitors and sales ----------------------------------------------------------------------

function StatsSection({ api, live }: { api: Api; live: boolean }) {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<(Stats & { currency: string }) | null>(null);
  useEffect(() => {
    let stale = false;
    (api(`/stats?days=${days}`) as Promise<unknown>).then(
      (s) => !stale && setStats(s as Stats & { currency: string }),
      () => {},
    );
    return () => {
      stale = true;
    };
  }, [api, days]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <div className="mb-3 flex flex-wrap items-baseline gap-3">
        <h2 className="text-xl font-semibold">Visitors and sales</h2>
        <span className="text-sm text-muted">{live ? "No cookies: each visitor is counted once a day" : "Counting starts when you go live"}</span>
        <div className="ml-auto flex gap-1 text-sm">
          {[7, 30, 90].map((d) => (
            <button key={d} onClick={() => setDays(d)} className={`rounded-full px-3 py-1 ${d === days ? "bg-foreground text-background" : "border border-line"}`}>
              {d} days
            </button>
          ))}
        </div>
      </div>
      <div className={panel}>{stats ? <StatsView stats={stats} currency={stats.currency} /> : <p className="text-sm text-muted">Loading…</p>}</div>
    </section>
  );
}

// ---- Design A/B test: for signed-in sellers, on shops in their account --------------------------

type AbVersion = { model: string | null; seconds: number | null };
type AbInitial = { model: string | null; b: AbVersion | null; ready: Record<"gemini" | "qwen", boolean> };

const modelLabel = (m: string | null) => (!m ? "an earlier model (not recorded)" : /qwen/i.test(m) ? `Qwen (${m})` : `Gemini (${m})`);

function AbPanel(props: { api: Api; initial: AbInitial; onChanged(): void; onToast(t: string): void }) {
  const [model, setModel] = useState(props.initial.model);
  const [b, setB] = useState(props.initial.b);
  const [busy, setBusy] = useState<string | null>(null);
  // Make B with the model that didn't make the current design (unknown: assume Gemini did).
  const other = model && /qwen/i.test(model) ? "gemini" : "qwen";

  async function call(body: object, label: string) {
    setBusy(label);
    try {
      return (await props.api("/ab", { method: "POST", body: JSON.stringify(body) })) as {
        model?: string | null;
        b: AbVersion;
      };
    } catch (e) {
      props.onToast((e as Error).message);
      return null;
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className={`${panel} border-dashed`}>
      <h2 className="font-semibold">A/B test</h2>
      <p className="mt-1 text-sm text-muted">
        Have another AI model design your page from the same words and photo, then compare. Your page only changes when you
        press Show version B, and you can swap back any time. The hero art stays.
      </p>
      <dl className="mt-3 space-y-1 text-sm">
        <div><dt className="inline text-muted">Showing: </dt><dd className="inline">{modelLabel(model)}</dd></div>
        <div>
          <dt className="inline text-muted">Version B: </dt>
          <dd className="inline">{b ? `${modelLabel(b.model)}${b.seconds ? `, ${b.seconds}s` : ""}` : "none yet"}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        {(["gemini", "qwen"] as const).map((d) => (
          <button
            key={d}
            disabled={Boolean(busy) || !props.initial.ready[d]}
            title={props.initial.ready[d] ? undefined : `${d} isn't configured on this server`}
            onClick={async () => {
              const r = await call({ action: "make", designer: d }, d);
              if (r) {
                setB(r.b);
                props.onToast("Version B is ready");
              }
            }}
            className={`rounded-full border px-3 py-1 text-xs disabled:opacity-50 ${d === other ? "border-foreground" : "border-line"}`}
          >
            {busy === d ? "Designing…" : `Make B with ${d === "qwen" ? "Qwen" : "Gemini"}`}
          </button>
        ))}
        <button
          disabled={Boolean(busy) || !b}
          onClick={async () => {
            const r = await call({ action: "swap" }, "swap");
            if (r) {
              setB(r.b);
              setModel(r.model ?? null);
              props.onChanged();
            }
          }}
          className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background disabled:opacity-50"
        >
          {busy === "swap" ? "…" : "Show version B"}
        </button>
      </div>
    </div>
  );
}
