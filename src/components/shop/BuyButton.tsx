"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// PayPal JavaScript SDK v6: one-time payment session + the <paypal-button> web component.
// Orders are created and captured on our server; the browser only ever sends the shop slug.

type Session = { start(opts: { presentationMode: string }, order: Promise<{ orderId: string }>): Promise<void> };
type Sdk = {
  findEligibleMethods(): Promise<{ isEligible(m: string): boolean }>;
  createPayPalOneTimePaymentSession(cb: {
    onApprove(d: { orderId: string }): Promise<void>;
    onCancel(): void;
    onError(e: Error): void;
  }): Promise<Session>;
};
declare global {
  interface Window {
    paypal?: { createInstance(o: { clientToken: string; components: string[] }): Promise<Sdk> };
  }
}

let sdkLoad: Promise<void> | null = null;
function loadSdk(src: string) {
  sdkLoad ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      sdkLoad = null;
      reject(new Error("PayPal SDK failed to load"));
    };
    document.head.append(s);
  });
  return sdkLoad;
}

export function BuyButton(props: { slug: string; enabled: boolean; sdkUrl: string; label: string }) {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const [msg, setMsg] = useState<{ kind: "error" | "info"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!props.enabled) return;
    let cancelled = false;
    const el = box.current;
    (async () => {
      // v6 needs a server-made client token; a bare client ID can't check eligibility.
      const [{ clientToken }] = await Promise.all([
        fetch("/api/paypal/client-token").then(async (r) => {
          const j = await r.json();
          if (!r.ok) throw new Error(j.error);
          return j as { clientToken: string };
        }),
        loadSdk(props.sdkUrl),
      ]);
      const sdk = await window.paypal!.createInstance({ clientToken, components: ["paypal-payments"] });
      // Eligibility is advisory. Some sandbox apps get 403 from PayPal's eligibility service
      // while checkout itself works, so only an explicit "not eligible" hides the button.
      const eligible = await sdk.findEligibleMethods().then((m) => m.isEligible("paypal"), () => true);
      if (!eligible || cancelled || !el) return;

      // Set once a capture succeeds, so the popup callback and the poll below finish only once.
      let settled = false;
      let watching: string | null = null;
      const finish = (localOrderId: string) => {
        if (settled) return;
        settled = true;
        setBusy(true);
        router.push(`/${props.slug}/thanks?order=${localOrderId}`);
      };
      // PayPal hands the approval back from its window. When that hand-off stalls (seen in
      // sandbox: the window sits on "Thanks for using PayPal"), notice the approval from here.
      const watch = async (paypalOrderId: string) => {
        const until = Date.now() + 15 * 60_000;
        while (watching === paypalOrderId && !settled && !cancelled && Date.now() < until) {
          await new Promise((r) => setTimeout(r, 3000));
          if (watching !== paypalOrderId || settled) return;
          const res = await fetch(`/api/orders/${paypalOrderId}/capture`, { method: "POST" }).catch(() => null);
          if (!res || res.status === 409) continue;
          const json = await res.json();
          if (res.ok) return finish(json.orderId);
          // A declined card can be swapped in the PayPal window, so keep waiting on 422.
          if (res.status !== 422) return;
        }
      };

      const session = await sdk.createPayPalOneTimePaymentSession({
        async onApprove({ orderId }) {
          setBusy(true);
          const res = await fetch(`/api/orders/${orderId}/capture`, { method: "POST" });
          const json = await res.json();
          if (res.ok) {
            finish(json.orderId);
          } else if (settled) {
            // The poll got there first.
          } else {
            setBusy(false);
            setMsg({ kind: "error", text: json.error === "INSTRUMENT_DECLINED" ? "That payment method was declined — please try another." : json.error });
          }
        },
        onCancel: () => {
          watching = null;
          setMsg({ kind: "info", text: "Checkout cancelled." });
        },
        onError: (e) => {
          console.error(e);
          setMsg({ kind: "error", text: "Something went wrong with PayPal. Please try again." });
        },
      });

      const button = document.createElement("paypal-button");
      button.setAttribute("type", "pay");
      button.addEventListener("click", async () => {
        setMsg(null);
        // Don't await before start(): the popup needs the click's user activation.
        const order = fetch("/api/orders", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ slug: props.slug }),
        }).then(async (r) => {
          const j = await r.json();
          if (!r.ok) throw new Error(j.error);
          return { orderId: j.id as string };
        });
        order.then(
          ({ orderId }) => {
            watching = orderId;
            void watch(orderId);
          },
          (e: Error) => setMsg({ kind: "error", text: e.message }),
        );
        try {
          await session.start({ presentationMode: "auto" }, order);
        } catch (e) {
          console.error(e);
        }
      });
      el.replaceChildren(button);
    })().catch((e) => {
      console.error(e);
      setMsg({ kind: "error", text: "PayPal couldn't load. Check your connection and refresh." });
    });
    return () => {
      cancelled = true;
    };
  }, [props.enabled, props.sdkUrl, props.slug, router]);

  if (!props.enabled) {
    return (
      <button className="shop-buy opacity-60" disabled title="Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to enable checkout">
        {props.label} · PayPal not configured
      </button>
    );
  }
  return (
    <div>
      <div ref={box} className={busy ? "pointer-events-none opacity-50" : ""} aria-busy={busy}>
        <div className="h-12 animate-pulse rounded-full bg-black/5" />
      </div>
      {busy && <p className="mt-2 text-sm">Confirming your payment…</p>}
      {msg && (
        <p role={msg.kind === "error" ? "alert" : "status"} className="mt-2 text-sm font-medium">
          {msg.text}
        </p>
      )}
    </div>
  );
}
