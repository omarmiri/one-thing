"use client";

import { useEffect, useRef, useState } from "react";
import type { PayPalStatus } from "@/lib/paypal";
import type { OptionStock, ShopOption, Suggestions } from "@/lib/options";
import { activeOptions, BuyerQuestions, initialOptions, OptionsEditor } from "./OptionsPanel";

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
  // Present when Connect PayPal is set up on the server. returned: ?paypal= after PayPal's return.
  paypal: { merchantId: string | null; status: PayPalStatus | null; returned: string | null } | null;
  sellerEmail: string | null;
  zapierHookUrl: string | null;
  inGallery: boolean;
  options: ShopOption[];
  optionStock: OptionStock;
  suggestions: Suggestions | null;
  referral: { offers: { domain: string; price: number; currency: string; commission: number }[] } | null;
};

export type ToastAction = { label: string; run(): void };

type Api = (path: string, init?: RequestInit) => Promise<{ slug?: string; filename?: string; url?: string; merchantId?: string | null; status?: PayPalStatus | null } & Partial<Suggestions>>;

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

const RETURNED: Record<string, string> = {
  connected: "PayPal connected. You're ready to get paid.",
  incomplete: "PayPal connected. One step is left at PayPal: see the checklist.",
  cancelled: "The PayPal connection wasn't finished.",
  failed: "We couldn't check with PayPal. Try Check again.",
};

// Where the money goes: the seller's own PayPal account, connected through PayPal's onboarding,
// with a checklist of what PayPal says is left. A typed PayPal email stays as the fallback.
function PayPalConnect(props: {
  api: Api;
  initial: NonNullable<SetupInitial["paypal"]>;
  email: string | null;
  onToast(t: string): void;
}) {
  const [merchantId, setMerchantId] = useState(props.initial.merchantId);
  const [status, setStatus] = useState(props.initial.status);
  const [busy, setBusy] = useState<false | "connect" | "check" | "disconnect">(false);
  const ready = Boolean(merchantId && status?.receivable && status.emailConfirmed);
  const { returned } = props.initial;
  const { onToast } = props;

  // Back from PayPal: say how it went once, and drop ?paypal= so a reload doesn't repeat it.
  useEffect(() => {
    if (!returned) return;
    if (RETURNED[returned]) onToast(RETURNED[returned]);
    const url = new URL(window.location.href);
    url.searchParams.delete("paypal");
    window.history.replaceState(null, "", url);
  }, [returned, onToast]);

  async function run(kind: "connect" | "check" | "disconnect") {
    setBusy(kind);
    try {
      if (kind === "connect") {
        const r = await props.api("/paypal", { method: "POST" });
        if (r.url) window.location.href = r.url;
        return; // leaving for PayPal: keep the button busy
      }
      if (kind === "check") {
        const r = await props.api("/paypal");
        setMerchantId(r.merchantId ?? null);
        setStatus(r.status ?? null);
        props.onToast(!r.merchantId ? "PayPal hasn't finished connecting yet." : r.status?.receivable && r.status.emailConfirmed ? "All set at PayPal." : "Checked with PayPal.");
      } else {
        await props.api("/paypal", { method: "DELETE" });
        setMerchantId(null);
        setStatus(null);
        props.onToast("PayPal disconnected.");
      }
    } catch (err) {
      props.onToast((err as Error).message);
    }
    setBusy(false);
  }

  const item = (ok: boolean, label: string, todo: string) => (
    <li className="flex gap-2">
      <span aria-hidden className={ok ? "text-green-700" : "text-amber-700"}>{ok ? "✓" : "○"}</span>
      <span>
        {label}
        {!ok && <span className="block text-xs text-muted">{todo}</span>}
      </span>
    </li>
  );

  return (
    <Row label="Payments go to" group>
      {merchantId ? (
        <div className="space-y-3 rounded-lg border border-line p-3 text-sm">
          <ul className="space-y-1.5">
            {item(true, `Your PayPal account is connected (…${merchantId.slice(-4)})`, "")}
            {item(Boolean(status?.emailConfirmed), "Email confirmed", "Confirm your email in PayPal: Account Overview → Confirm email address.")}
            {item(Boolean(status?.receivable), "Can receive payments", "PayPal still needs something from you. Sign in to PayPal and follow its prompts.")}
          </ul>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => run("check")} disabled={!!busy} className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold disabled:opacity-50">
              {busy === "check" ? "Checking…" : "Check again"}
            </button>
            {status?.checkedAt && <span className="text-xs text-muted">Checked {new Date(status.checkedAt).toLocaleString()}</span>}
            <button type="button" onClick={() => run("disconnect")} disabled={!!busy} className="ml-auto text-xs text-muted underline disabled:opacity-50">
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => run("connect")}
            disabled={!!busy}
            className="w-full rounded-full px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: "#0070ba" }}
          >
            {busy === "connect" ? "Opening PayPal…" : "Connect PayPal"}
          </button>
          <p className="text-xs text-muted">Already use PayPal? Sign in. New to it? Create a free account in the same step.</p>
        </div>
      )}
      <details open={!merchantId && Boolean(props.email)} className="text-sm">
        <summary className="cursor-pointer text-xs text-muted">
          {merchantId ? "Backup: a PayPal email" : "Or send payments to a PayPal email"}
        </summary>
        <div className="mt-2 space-y-1">
          <input name="paypal_email" type="email" aria-label="PayPal email" defaultValue={props.email ?? ""} placeholder="you@example.com" className={input} />
          <p className="text-xs text-muted">
            {ready ? "Only used if your connected account can't be paid." : "PayPal can't confirm this one for you, so double-check it."}
          </p>
        </div>
      </details>
    </Row>
  );
}

export function SetupPanel(props: {
  api: Api;
  linkPrefix: string; // "one-thing-ash0.onrender.com"
  initial: SetupInitial;
  draft: boolean;
  paypalReady: boolean;
  photos: { id: string; url: string }[];
  onSaved(result: { slug: string; live: boolean }): void;
  onToast(t: string, action?: ToastAction): void;
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
  const [suggestions, setSuggestions] = useState(s.suggestions);
  const [opts, setOpts] = useState(() => initialOptions(s.options, s.suggestions));
  const [optStock, setOptStock] = useState<OptionStock>(s.optionStock);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const hasOptions = kind === "physical" && activeOptions(opts).length > 0;

  // Which photo shows each colour: Gemini proposes, the seller can change it, Save keeps it.
  async function matchPhotos(quiet = false) {
    const colour = opts.find((o) => o.enabled && o.kind === "color" && o.values.length);
    if (!colour) return;
    try {
      const r = (await props.api("/match-photos", {
        method: "POST",
        body: JSON.stringify({ colors: colour.values.map(({ label, hex }) => ({ label, hex })) }),
      })) as unknown as { matches: Record<string, string> };
      const n = Object.keys(r.matches).length;
      if (!n) return props.onToast("No photo clearly shows one colour.");
      const before = Object.fromEntries(colour.values.filter((v) => v.label in r.matches).map((v) => [v.label, v.photo ?? null]));
      await setColourPhotos(r.matches, `Matched ${n} photo${n === 1 ? "" : "s"} to colours`, before);
    } catch (err) {
      if (!quiet) props.onToast((err as Error).message);
    }
  }
  // Colour photos save on their own, straight away: the rest of the panel still waits for Save.
  // before: what to put back on Undo.
  async function setColourPhotos(photos: Record<string, string | null>, done: string, before?: Record<string, string | null>) {
    setOpts((cur) =>
      cur.map((o) =>
        o.kind !== "color"
          ? o
          : {
              ...o,
              values: o.values.map((v) => {
                if (!(v.label in photos)) return v;
                const { photo: _old, ...rest } = v;
                return photos[v.label] ? { ...rest, photo: photos[v.label]! } : rest;
              }),
            },
      ),
    );
    try {
      const r = (await props.api("/color-photos", { method: "PUT", body: JSON.stringify({ photos }) })) as unknown as { saved: string[] };
      if (!r.saved.length) return props.onToast(`${done}. Save to keep.`); // the colours themselves aren't saved yet
      // Undo itself has nothing to undo, and says so plainly.
      props.onToast(before ? `${done} and saved` : done, before && { label: "Undo", run: () => void setColourPhotos(before, "Photos put back") });
    } catch (err) {
      props.onToast((err as Error).message);
    }
  }

  // New photos arrived (Photos panel): match them to colours without being asked.
  const photoCount = useRef(props.photos.length);
  useEffect(() => {
    const grew = props.photos.length > photoCount.current;
    photoCount.current = props.photos.length;
    if (grew && props.photos.length >= 2 && opts.some((o) => o.enabled && o.kind === "color")) void matchPhotos(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the photos change
  }, [props.photos.length]);

  async function checkDetails() {
    try {
      const r = (await props.api("/suggest", { method: "POST" })) as Suggestions;
      setSuggestions(r);
      // Fresh option ideas show up unticked next to what's already set.
      setOpts((cur) => [...cur, ...initialOptions([], r).filter((o) => !cur.some((c) => c.name.toLowerCase() === o.name.toLowerCase())).map((o) => ({ ...o, enabled: false }))]);
    } catch (err) {
      props.onToast((err as Error).message);
    }
  }

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
            ...(!hasOptions && { stock: val("stock") === null ? null : Number(val("stock")) }),
            ship_countries: val("ship_countries"),
          }),
          ...(kind === "digital" && { delivery, ...(delivery === "access_code" && { access_url: val("access_url") }) }),
          paypal_email: val("paypal_email"),
          seller_email: val("seller_email"),
          zapier_hook_url: val("zapier_hook_url"),
          in_gallery: f.get("in_gallery") === "on",
          options: kind === "physical" ? activeOptions(opts) : [],
          option_stock: optStock,
          facts: Object.entries(answers)
            .map(([label, value]) => ({ label, value: value.trim() }))
            .filter((a) => a.value),
          ...(goLive && { status: "live" }),
        }),
      });
      // Answered questions are now product details.
      if (suggestions) setSuggestions({ ...suggestions, missingFacts: suggestions.missingFacts.filter((m) => !answers[m.label]?.trim()) });
      setAnswers({});
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
          {kind === "physical" && !hasOptions && (
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

      {kind === "physical" && (
        <Row label="Buyer options" group hint={opts.length ? undefined : "Sizes, colours or other choices buyers pick. Add one if your product comes in variants."}>
          <OptionsEditor
            options={opts}
            onOptions={setOpts}
            stock={optStock}
            onStock={setOptStock}
            photos={props.photos}
            onMatch={() => matchPhotos()}
            onPhotoPicked={(label, photo, before) => void setColourPhotos({ [label]: photo }, photo ? `Photo set for ${label}` : `Photo removed from ${label}`, { [label]: before })}
          />
        </Row>
      )}

      {kind !== "referral" && (
        <Row label="Buyers will ask" group>
          <BuyerQuestions suggestions={suggestions} answers={answers} onAnswer={(l, v) => setAnswers((a) => ({ ...a, [l]: v }))} onCheck={checkDetails} />
        </Row>
      )}

      {kind !== "referral" && s.paypal && (
        <PayPalConnect api={props.api} initial={s.paypal} email={s.paypalEmail} onToast={props.onToast} />
      )}

      {kind !== "referral" && !s.paypal && (
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
