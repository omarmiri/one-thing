"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrdersGrid, type SellerOrder } from "./OrdersGrid";
import { PhotosPanel, type Photo } from "./PhotosPanel";
import { SetupPanel, type SetupInitial, type ToastAction } from "./SetupPanel";
import type { WebhookEvent } from "@/lib/shops";
import type { Stats } from "@/lib/stats";
import { fmtMoney, StatsView } from "@/components/StatsView";
import { FoldPanel } from "./Fold";
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
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<ShopStats | null>(null);
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

  useEffect(() => {
    let stale = false;
    const load = () => (api(`/stats?days=${days}`) as Promise<unknown>).then((s) => !stale && setStats(s as ShopStats), () => {});
    load();
    // New sales show up without a reload.
    const t =
      status === "live" &&
      setInterval(() => {
        api("/orders").then(setOrders).catch(() => {});
        api("/webhooks").then(setWebhooks).catch(() => {});
        load();
      }, 15000);
    return () => {
      stale = true;
      if (t) clearInterval(t);
    };
  }, [status, api, days]);

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

      <div className="mx-auto max-w-7xl px-4 pt-6">
        <Summary stats={stats} days={days} webhooks={webhooks} />
      </div>

      {/* Wide screens: preview, then stats and webhooks, beside the settings; orders full width below.
          Phones, in page order: preview, settings, orders, stats, webhooks. */}
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-[auto_auto_1fr]">
        <section className="self-start overflow-hidden rounded-2xl border border-line bg-white lg:col-start-1 lg:row-start-1">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2 text-xs text-muted">
            <span className="truncate">{shopPath}</span>
            <a href={`/${slug}?token=${token}`} target="_blank" className="ml-auto underline">Open</a>
          </div>
          <iframe key={frameKey} src={`/${slug}?token=${token}`} title="Shop preview" className="h-[78vh] w-full" />
        </section>

        <aside className="space-y-6 lg:col-start-2 lg:row-span-3 lg:row-start-1">
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
            draft={status === "draft"}
            geminiReady={props.geminiReady}
            aiSource={initial.aiSource}
            heroStatus={heroStatus}
            onChanged={() => setFrameKey((k) => k + 1)}
            onHero={() => setHeroStatus("pending")}
            onToast={setToast}
          />
          {props.ab && <AbPanel api={api} initial={props.ab} onChanged={() => setFrameKey((k) => k + 1)} onToast={setToast} />}
        </aside>

        <section className="min-w-0 lg:col-span-2 lg:row-start-4">
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
            onRefund={async (o) => {
              const total = `${(o.amount_cents / 100).toFixed(2)}`;
              if (!window.confirm(`Refund ${total} to ${o.buyer_name ?? o.buyer_email ?? "the buyer"}? PayPal sends it back in full. Their download link or access code stops working.`)) return;
              const refund = async (record: boolean) => {
                // Not through api(): a 409 here carries refundInPayPal, which the caller needs.
                const res = await fetch(`/api/shops/${slug}/orders/${o.id}/refund`, {
                  method: "POST",
                  headers: { "x-admin-token": token, "content-type": "application/json" },
                  body: JSON.stringify({ record }),
                }).catch(() => null);
                return res ? ((await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; refundInPayPal?: boolean }) : { error: "Couldn't reach OneThing. Try again." };
              };
              let r = await refund(false);
              if (r.refundInPayPal && window.confirm(`${r.error}

  Already refunded it in PayPal? OK marks it refunded here.`)) r = await refund(true);
              else if (r.refundInPayPal) return;
              if (r.ok) {
                setOrders(await api("/orders"));
                setToast(`Refunded ${total}`);
              } else setToast(r.error ?? "The refund didn't go through.");
            }}
          />
        </section>

        <StatsSection stats={stats} days={days} onDays={setDays} live={status === "live"} />

        <section className="min-w-0 self-start lg:col-start-1 lg:row-start-3">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
            <h2 className="text-xl font-semibold">PayPal webhooks</h2>
            <span className="text-sm text-muted">Events PayPal sent about this shop&apos;s orders, newest first</span>
          </div>
          <WebhookLog events={webhooks} />
        </section>
      </div>

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

const WEBHOOKS_SHOWN = 5;

function WebhookLog({ events }: { events: WebhookEvent[] }) {
  const [all, setAll] = useState(false);
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
      {(all ? events : events.slice(0, WEBHOOKS_SHOWN)).map((e) => (
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
      {events.length > WEBHOOKS_SHOWN && (
        <li>
          <button onClick={() => setAll(!all)} className="w-full px-4 py-2.5 text-left text-sm text-muted hover:text-foreground">
            {all ? "Show fewer" : `Show all ${events.length}`}
          </button>
        </li>
      )}
    </ul>
  );
}

type Api = (path: string, init?: RequestInit) => Promise<{ synced?: boolean; hero_status?: Initial["heroStatus"] }>;

const panel = "rounded-2xl border border-line bg-white p-5";
const input = "w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent";

function DesignPanel(props: {
  api: Api;
  draft: boolean;
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
    <FoldPanel title="Design with Gemini" open={props.draft}>
      {!props.geminiReady ? (
        <p className="text-sm text-muted">Add GEMINI_API_KEY to .env.local to redesign by chatting.</p>
      ) : (
        <>
          <p className="text-sm text-muted">
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
    </FoldPanel>
  );
}

// ---- Visitors and sales ----------------------------------------------------------------------

type ShopStats = Stats & { currency: string };

function StatsSection(props: { stats: ShopStats | null; days: number; onDays(d: number): void; live: boolean }) {
  return (
    <section className="min-w-0 self-start lg:col-start-1 lg:row-start-2">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-xl font-semibold">Visitors and sales</h2>
        <span className="text-sm text-muted">{props.live ? "No cookies: each visitor is counted once a day" : "Counting starts when you go live"}</span>
        <div className="ml-auto flex gap-1 text-sm">
          {[7, 30, 90].map((d) => (
            <button key={d} onClick={() => props.onDays(d)} className={`rounded-full px-3 py-1 ${d === props.days ? "bg-foreground text-background" : "border border-line"}`}>
              {d} days
            </button>
          ))}
        </div>
      </div>
      <div className={panel}>{props.stats ? <StatsView stats={props.stats} currency={props.stats.currency} /> : <p className="text-sm text-muted">Loading…</p>}</div>
    </section>
  );
}

// ---- Summary strip: the shop at a glance, above everything -------------------------------------

const ago = (iso: string) => {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  return min < 1 ? "just now" : min < 60 ? `${min} min ago` : min < 1440 ? `${Math.round(min / 60)} h ago` : `${Math.round(min / 1440)} d ago`;
};

function Summary({ stats, days, webhooks }: { stats: ShopStats | null; days: number; webhooks: WebhookEvent[] }) {
  const paid = stats ? stats.web.paid + stats.agent.paid : 0;
  const last = webhooks[0];
  const tiles: [string, React.ReactNode][] = [
    ["Visitors", stats ? stats.web.visitors + stats.agent.visitors : "–"],
    ["Paid orders", stats ? paid : "–"],
    ["Revenue", stats ? fmtMoney(stats.web.revenueCents + stats.agent.revenueCents, stats.currency) : "–"],
    ["Bought by agents", stats && paid ? `${Math.round((stats.agent.paid / paid) * 100)}%` : "–"],
    [
      "Last webhook",
      last ? (
        <span className="flex items-center gap-2">
          <span className={`size-2 shrink-0 rounded-full ${last.verified ? "bg-green-600" : "bg-red-600"}`} />
          <span className="sr-only">{last.verified ? "Signature verified, " : "Not verified, "}</span>
          {/* Relative to this browser's clock: the server's render would differ by a moment. */}
          <span suppressHydrationWarning>{ago(last.received_at)}</span>
        </span>
      ) : (
        "None yet"
      ),
    ],
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {tiles.map(([label, value], i) => (
        <div key={label} className={`rounded-xl border border-line bg-white px-4 py-3 ${i === tiles.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}>
          <dt className="truncate text-xs text-muted">
            {label}
            {i < 4 && ` · ${days}d`}
          </dt>
          <dd className="mt-0.5 text-xl font-semibold tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
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
    <FoldPanel title="A/B test" open={false} dashed>
      <p className="text-sm text-muted">
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
    </FoldPanel>
  );
}
