import "server-only";
import { appUrl } from "./ids";
import type { Shop } from "./shops";

// Plain REST against the Orders v2 API. Sandbox unless PAYPAL_ENV=live.
const API =
  process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

export const paypalEnabled = () => Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);

type Token = { token: string; expires: number };
let cached: Token | null = null;
const clientTokens = new Map<string, Token>();

async function oauthToken(op: string, params: Record<string, string>): Promise<Token> {
  const basic = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${API}/v1/oauth2/token`, {
    method: "POST",
    headers: { authorization: `Basic ${basic}`, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", ...params }),
  });
  if (!res.ok) throw new PayPalError(op, res.status, await res.text());
  const json = (await res.json()) as { access_token: string; expires_in: number };
  return { token: json.access_token, expires: Date.now() + json.expires_in * 1000 };
}

async function accessToken(): Promise<string> {
  if (!cached || cached.expires < Date.now() + 60_000) cached = await oauthToken("auth", {});
  return cached.token;
}

/**
 * Browser-safe client token for the JS SDK v6, bound to the shop page's domain. A bare client
 * ID isn't enough: the low-scope token PayPal derives from it is refused by the eligibility
 * service (403 PERMISSION_DENIED), so the buttons never render.
 */
export async function clientToken(domain: string): Promise<string> {
  let t = clientTokens.get(domain);
  if (!t || t.expires < Date.now() + 5 * 60_000) {
    t = await oauthToken("client token", { response_type: "client_token", intent: "sdk_init", "domains[]": domain });
    clientTokens.set(domain, t);
  }
  return t.token;
}

export class PayPalError extends Error {
  constructor(public op: string, public status: number, public body: string) {
    super(`PayPal ${op} failed (${status}): ${body.slice(0, 500)}`);
  }
}

async function call<T>(op: string, path: string, init: { method: string; body?: unknown; requestId?: string }) {
  const res = await fetch(`${API}${path}`, {
    method: init.method,
    headers: {
      authorization: `Bearer ${await accessToken()}`,
      "content-type": "application/json",
      ...(init.requestId && { "PayPal-Request-Id": init.requestId }),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const text = await res.text();
  if (!res.ok) throw new PayPalError(op, res.status, text);
  return (text ? JSON.parse(text) : {}) as T;
}

const value = (cents: number) => (cents / 100).toFixed(2);

/**
 * Creates the PayPal order. The amount always comes from the database, never the browser.
 * The money goes straight to the seller: payee is their onboarded merchant id, else their
 * PayPal email, else (unset) the platform's own sandbox account.
 */
export function createOrder(shop: Shop, localOrderId: string) {
  const physical = shop.product_type === "physical";
  const shipping = physical ? shop.shipping_cents : 0;
  const payee = shop.paypal_merchant_id
    ? { merchant_id: shop.paypal_merchant_id }
    : shop.paypal_email
      ? { email_address: shop.paypal_email }
      : undefined;
  return call<{ id: string; status: string }>("create order", "/v2/checkout/orders", {
    method: "POST",
    requestId: `create-${localOrderId}`,
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: shop.slug,
          custom_id: localOrderId,
          description: shop.spec.productName.slice(0, 127),
          ...(payee && { payee }),
          amount: {
            currency_code: shop.currency,
            value: value(shop.price_cents + shipping),
            breakdown: {
              item_total: { currency_code: shop.currency, value: value(shop.price_cents) },
              shipping: { currency_code: shop.currency, value: value(shipping) },
            },
          },
          items: [
            {
              name: shop.spec.productName.slice(0, 127),
              quantity: "1",
              unit_amount: { currency_code: shop.currency, value: value(shop.price_cents) },
              category: physical ? "PHYSICAL_GOODS" : "DIGITAL_GOODS",
            },
          ],
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            // Physical: PayPal collects the buyer's address and returns it on capture.
            shipping_preference: physical ? "GET_FROM_FILE" : "NO_SHIPPING",
            user_action: "PAY_NOW",
            brand_name: shop.spec.productName.slice(0, 127),
            return_url: `${appUrl()}/${shop.slug}/thanks?order=${localOrderId}`,
            cancel_url: `${appUrl()}/${shop.slug}`,
          },
        },
      },
    },
  });
}

export type Capture = {
  id: string;
  status: string;
  payer?: { email_address?: string; name?: { given_name?: string; surname?: string } };
  purchase_units?: {
    custom_id?: string;
    shipping?: { name?: { full_name?: string }; address?: Record<string, string> };
    payments?: { captures?: { id: string; status: string; custom_id?: string }[] };
  }[];
};

export const captureOrder = (paypalOrderId: string) =>
  call<Capture>("capture order", `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: "POST",
    // Unique per attempt: a fixed id would make PayPal replay a cached decline when the buyer
    // retries the same order with another card. PayPal itself refuses to capture an order twice.
    requestId: `capture-${paypalOrderId}-${Date.now().toString(36)}`,
  });

export const CARRIERS = ["USPS", "UPS", "FEDEX", "DHL", "OTHER"] as const;

/** Shows the tracking number to the buyer inside PayPal. */
export const addTracking = (
  paypalOrderId: string,
  t: { captureId: string; trackingNumber: string; carrier: (typeof CARRIERS)[number]; carrierName?: string },
) =>
  call("add tracking", `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/track`, {
    method: "POST",
    body: {
      capture_id: t.captureId,
      tracking_number: t.trackingNumber,
      carrier: t.carrier,
      ...(t.carrier === "OTHER" && { carrier_name_other: t.carrierName || "Other" }),
      notify_payer: true,
    },
  });

/** Asks PayPal whether a webhook delivery is genuine. */
export async function verifyWebhook(headers: Headers, event: unknown): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;
  const res = await call<{ verification_status: string }>(
    "verify webhook",
    "/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      body: {
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: event,
      },
    },
  );
  return res.verification_status === "SUCCESS";
}

export const sdkUrl = () =>
  process.env.PAYPAL_ENV === "live"
    ? "https://www.paypal.com/web-sdk/v6/core"
    : "https://www.sandbox.paypal.com/web-sdk/v6/core";
