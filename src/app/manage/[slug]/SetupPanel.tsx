"use client";

import { useEffect, useState } from "react";

// Onboarding, step 2: the AI's guesses, laid out to check and change. The same panel stays as
// the shop's settings after it goes live.

export type Kind = "physical" | "digital" | "referral";
export type SetupInitial = {
  slug: string;
  productType: Kind;
  delivery: "file" | "access_code";
  accessUrl: string | null;
  hasDigitalFile: boolean;
  price: number;
  shipping: number;
  stock: number | null;
  shipCountries: string | null;
  paypalEmail: string | null;
  sellerEmail: string | null;
  zapierHookUrl: string | null;
  inGallery: boolean;
  referral: { offers: { domain: string; price: number; currency: string; commission: number }[] } | null;
};

type Api = (path: string, init?: RequestInit) => Promise<{ slug?: string; filename?: string }>;

const input = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent";
const money = (n: number, c = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(n);

function Segmented<T extends string>(props: { value: T; options: [T, string][]; onChange(v: T): void }) {
  return (
    <div className="flex gap-1 rounded-lg bg-line/50 p-1">
      {props.options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => props.onChange(v)}
          className={`flex-1 rounded-md px-2 py-1.5 text-sm ${props.value === v ? "bg-white font-semibold shadow-sm" : "text-muted"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// A labelled field. Rows holding a single input use a real <label>; rows of buttons use a group.
function Row({ label, hint, group, children }: { label: string; hint?: React.ReactNode; group?: boolean; children: React.ReactNode }) {
  const title = <span className="block text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>;
  return group ? (
    <div role="group" aria-label={label} className="space-y-1.5">
      {title}
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  ) : (
    <div className="space-y-1.5">
      <label className="block space-y-1.5">
        {title}
        {children}
      </label>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function SetupPanel(props: {
  api: Api;
  linkPrefix: string; // "one-thing-ash0.onrender.com"
  initial: SetupInitial;
  draft: boolean;
  paypalReady: boolean;
  onSaved(result: { slug: string; live: boolean }): void;
  onToast(t: string): void;
}) {
  const s = props.initial;
  const [slug, setSlug] = useState(s.slug);
  const [checked, setChecked] = useState<{ slug: string; ok: boolean; msg: string } | null>(null);
  // Only meaningful while the field differs from the saved name and the check is for this text.
  const slugState = slug !== s.slug && checked?.slug === slug ? checked : null;
  const [kind, setKind] = useState<Kind>(s.productType);
  const [delivery, setDelivery] = useState(s.delivery);
  const [hasFile, setHasFile] = useState(s.hasDigitalFile);
  const [busy, setBusy] = useState<false | "save" | "live">(false);

  // Live availability check for the link name.
  useEffect(() => {
    if (slug === s.slug) return;
    const t = setTimeout(async () => {
      const r = await fetch(`/api/slugs/check?name=${encodeURIComponent(slug)}`).then((x) => x.json());
      setChecked(
        r.slug === s.slug
          ? { slug, ok: true, msg: "That's your current link" }
          : { slug, ok: r.available, msg: r.available ? `${props.linkPrefix}/${r.slug} is free` : r.problem },
      );
    }, 350);
    return () => clearTimeout(t);
  }, [slug, s.slug, props.linkPrefix]);

  async function uploadFile(f: File) {
    const body = new FormData();
    body.set("file", f);
    try {
      const r = await props.api("/file", { method: "POST", body });
      setHasFile(true);
      props.onToast(`Uploaded ${r.filename ?? "file"}`);
    } catch (err) {
      props.onToast((err as Error).message);
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const goLive = (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "live";
    const f = new FormData(e.currentTarget);
    const val = (k: string) => {
      const v = f.get(k);
      return typeof v === "string" && v.trim() ? v.trim() : null;
    };
    setBusy(goLive ? "live" : "save");
    try {
      const r = await props.api("", {
        method: "PATCH",
        body: JSON.stringify({
          slug,
          product_type: kind,
          ...(kind !== "referral" && { price: Number(val("price")) }),
          ...(kind === "physical" && {
            shipping: Number(val("shipping") ?? 0),
            stock: val("stock") === null ? null : Number(val("stock")),
            ship_countries: val("ship_countries"),
          }),
          ...(kind === "digital" && { delivery, ...(delivery === "access_code" && { access_url: val("access_url") }) }),
          paypal_email: val("paypal_email"),
          seller_email: val("seller_email"),
          zapier_hook_url: val("zapier_hook_url"),
          in_gallery: f.get("in_gallery") === "on",
          ...(goLive && { status: "live" }),
        }),
      });
      props.onSaved({ slug: r.slug ?? slug, live: goLive });
    } catch (err) {
      props.onToast((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form id="setup" onSubmit={submit} className="space-y-5 rounded-2xl border border-line bg-white p-5">
      <div>
        <h2 className="font-semibold">{props.draft ? "Check what we guessed" : "Shop settings"}</h2>
        {props.draft && <p className="mt-0.5 text-sm text-muted">Change anything that&apos;s off, then go live.</p>}
      </div>

      <Row
        label="Your link"
        hint={slugState ? <span className={slugState.ok ? "text-green-700" : "text-red-700"}>{slugState.msg}</span> : "Old links keep working if you change it."}
      >
        <div className="flex items-center overflow-hidden rounded-lg border border-line focus-within:border-accent">
          <span className="whitespace-nowrap bg-background px-3 py-2 text-sm text-muted">{props.linkPrefix}/</span>
          <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} className="w-full px-2 py-2 text-sm outline-none" />
        </div>
      </Row>

      <Row label="What it is" group>
        <Segmented<Kind>
          value={kind}
          onChange={setKind}
          options={[
            ["physical", "Physical item"],
            ["digital", "Digital"],
            ...(s.referral ? ([["referral", "Recommendation"]] as [Kind, string][]) : []),
          ]}
        />
      </Row>

      {kind === "referral" && s.referral && (
        <Row group label="Where buyers purchase" hint="Buyers check out at the store. Channel3 tracks the sale and you earn the commission.">
          <ul className="divide-y divide-line rounded-lg border border-line text-sm">
            {s.referral.offers.map((o) => (
              <li key={o.domain} className="flex items-center justify-between px-3 py-2">
                <span>{o.domain}</span>
                <span>
                  {money(o.price, o.currency)}
                  {o.commission > 0 && <span className="ml-2 text-xs font-semibold text-green-700">up to {Math.round(o.commission * 100)}%</span>}
                </span>
              </li>
            ))}
          </ul>
        </Row>
      )}

      {kind === "digital" && (
        <Row label="How buyers get it" group>
          <Segmented<"file" | "access_code">
            value={delivery}
            onChange={setDelivery}
            options={[
              ["file", "File download"],
              ["access_code", "Access code"],
            ]}
          />
          {delivery === "file" ? (
            <label className="mt-2 flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-line px-3 py-2.5 text-sm hover:border-accent">
              <span>{hasFile ? "File uploaded. Replace it?" : "Upload the file buyers download"}</span>
              <span className="font-semibold text-accent">Choose…</span>
              <input type="file" className="sr-only" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} />
            </label>
          ) : (
            <div className="mt-2 space-y-1">
              <input name="access_url" type="url" aria-label="Where buyers use their code" defaultValue={s.accessUrl ?? ""} placeholder="https://yourgame.com/play/" className={input} />
              <p className="text-xs text-muted">Where buyers use their code. Each buyer gets a unique one after paying.</p>
            </div>
          )}
        </Row>
      )}

      {kind !== "referral" && (
        <div className="grid grid-cols-2 gap-3">
          <Row label="Price (USD)">
            <input name="price" type="number" step="0.01" min="0.5" required defaultValue={s.price} className={input} />
          </Row>
          {kind === "physical" && (
            <Row label="Shipping (USD)">
              <input name="shipping" type="number" step="0.01" min="0" defaultValue={s.shipping} className={input} />
            </Row>
          )}
          {kind === "physical" && (
            <Row label="In stock">
              <input name="stock" type="number" min="0" step="1" defaultValue={s.stock ?? ""} placeholder="Unlimited" className={input} />
            </Row>
          )}
          {kind === "physical" && (
            <Row label="Ships to">
              <input name="ship_countries" defaultValue={s.shipCountries ?? "US"} placeholder="US,CA" className={input} />
            </Row>
          )}
        </div>
      )}

      {kind !== "referral" && (
        <Row
          label="Payments go to"
          hint={
            !props.paypalReady
              ? "PayPal isn't configured on this server yet."
              : "Your PayPal email. In the sandbox you can leave it blank: payments go to OneThing's sandbox account."
          }
        >
          <input name="paypal_email" type="email" defaultValue={s.paypalEmail ?? ""} placeholder="you@example.com" className={input} />
        </Row>
      )}

      <label className="flex items-start gap-3 text-sm">
        <input name="in_gallery" type="checkbox" defaultChecked={s.inGallery} className="mt-0.5 size-4 accent-current" />
        <span>
          <span className="font-medium">Show in the OneThing gallery</span>
          <span className="block text-muted">Feature this page at /gallery once it&apos;s live. You can turn it off any time.</span>
        </span>
      </label>

      <details className="text-sm">
        <summary className="cursor-pointer text-muted">Notifications and automations</summary>
        <div className="mt-3 space-y-3">
          <Row label="Your email">
            <input name="seller_email" type="email" defaultValue={s.sellerEmail ?? ""} className={input} />
          </Row>
          <Row label="Zapier webhook" hint="Every paid or shipped order is posted here: a sheet, Slack, a label printer…">
            <input name="zapier_hook_url" type="url" defaultValue={s.zapierHookUrl ?? ""} placeholder="https://hooks.zapier.com/…" className={input} />
          </Row>
        </div>
      </details>

      <div className="flex gap-2">
        {props.draft ? (
          <>
            <button name="intent" value="live" disabled={!!busy || slugState?.ok === false} className="flex-1 rounded-full bg-foreground py-3 font-semibold text-background disabled:opacity-50">
              {busy === "live" ? "Going live…" : kind === "referral" ? "Go live" : "Go live with PayPal"}
            </button>
            <button name="intent" value="save" disabled={!!busy} className="rounded-full border border-line px-4 text-sm">
              {busy === "save" ? "Saving…" : "Save"}
            </button>
          </>
        ) : (
          <button name="intent" value="save" disabled={!!busy || slugState?.ok === false} className="w-full rounded-full bg-foreground py-2.5 text-sm font-semibold text-background disabled:opacity-50">
            {busy ? "Saving…" : "Save settings"}
          </button>
        )}
      </div>
    </form>
  );
}
