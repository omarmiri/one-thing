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

async function oauthToken(
  op: string,
  params: Record<string, string>,
  creds = `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
): Promise<Token> {
  const basic = Buffer.from(creds).toString("base64");
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

async function call<T>(
  op: string,
  path: string,
  init: { method: string; body?: unknown; requestId?: string },
  token: () => Promise<string> = accessToken,
) {
  const res = await fetch(`${API}${path}`, {
    method: init.method,
    headers: {
      authorization: `Bearer ${await token()}`,
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
 * The money goes straight to the seller: payee is their connected PayPal account once PayPal
 * says it can be paid, else the PayPal email they typed, else a connected account that isn't
 * ready yet, else (unset) the platform's own sandbox account.
 */
export function createOrder(shop: Shop, localOrderId: string, choiceLabel?: string) {
  const physical = shop.product_type === "physical";
  const shipping = physical ? shop.shipping_cents : 0;
  const payee =
    shop.paypal_merchant_id && (paypalReadyToPay(shop) || !shop.paypal_email)
      ? { merchant_id: shop.paypal_merchant_id }
      : shop.paypal_email
        ? { email_address: shop.paypal_email }
        : undefined;
  // links: rel "payer-action" is the PayPal page where a buyer approves the order outside our page.
  return call<{ id: string; status: string; links?: { rel: string; href: string }[] }>("create order", "/v2/checkout/orders", {
    method: "POST",
    requestId: `create-${localOrderId}`,
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: shop.slug,
          custom_id: localOrderId,
          description: (choiceLabel ? `${shop.spec.productName} (${choiceLabel})` : shop.spec.productName).slice(0, 127),
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
              // The buyer's size/color shows in PayPal's review page and receipt.
              name: (choiceLabel ? `${shop.spec.productName} (${choiceLabel})` : shop.spec.productName).slice(0, 127),
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

/** The order as PayPal has it. Null when PayPal no longer knows it (an old unapproved order expires). */
export const getPayPalOrder = (paypalOrderId: string) =>
  call<{ id: string; status: string; links?: { rel: string; href: string }[] }>(
    "get order",
    `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`,
    { method: "GET" },
  ).catch((err) => {
    if (err instanceof PayPalError && err.status === 404) return null;
    throw err;
  });

/** Where an order stands at PayPal: CREATED, PAYER_ACTION_REQUIRED, APPROVED, COMPLETED, VOIDED, or EXPIRED once PayPal has dropped it. */
export const orderStatus = (paypalOrderId: string) => getPayPalOrder(paypalOrderId).then((o) => o?.status ?? "EXPIRED");

/** The PayPal page where the buyer approves the order. */
export const approveLink = (o: { links?: { rel: string; href: string }[] }) =>
  o.links?.find((l) => l.rel === "payer-action" || l.rel === "approve")?.href ?? null;

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

// ---- Connect PayPal (Partner Referrals) ----------------------------------------------------
// Sellers connect their PayPal account through PayPal's own onboarding: they sign in (or sign
// up, or upgrade to business) at PayPal and grant OneThing permission. Partner Referrals needs a
// Platform app, so these calls use their own keys: PAYPAL_PARTNER_CLIENT_ID / _SECRET, plus
// PAYPAL_PARTNER_MERCHANT_ID (the Platform app's own account). Checkout keeps the main keys.

export const paypalConnectEnabled = () =>
  Boolean(process.env.PAYPAL_PARTNER_CLIENT_ID && process.env.PAYPAL_PARTNER_CLIENT_SECRET && process.env.PAYPAL_PARTNER_MERCHANT_ID);

let partnerCached: Token | null = null;
async function partnerToken(): Promise<string> {
  if (!partnerCached || partnerCached.expires < Date.now() + 60_000) {
    partnerCached = await oauthToken("partner auth", {}, `${process.env.PAYPAL_PARTNER_CLIENT_ID}:${process.env.PAYPAL_PARTNER_CLIENT_SECRET}`);
  }
  return partnerCached.token;
}

/** What PayPal says about a connected seller, as of checkedAt. */
export type PayPalStatus = { receivable: boolean; emailConfirmed: boolean; checkedAt: string };

export const paypalReadyToPay = (shop: Pick<Shop, "paypal_merchant_id" | "paypal_status">) =>
  Boolean(shop.paypal_merchant_id && shop.paypal_status?.receivable && shop.paypal_status.emailConfirmed);

/** The PayPal page where a seller connects their account. trackingId is how we find them after. */
export async function connectUrl(trackingId: string, returnUrl: string, email?: string | null): Promise<string> {
  const res = await call<{ links: { rel: string; href: string }[] }>(
    "partner referral",
    "/v2/customer/partner-referrals",
    {
      method: "POST",
      body: {
        tracking_id: trackingId,
        ...(email && { email }),
        operations: [
          {
            operation: "API_INTEGRATION",
            api_integration_preference: {
              rest_api_integration: {
                integration_method: "PAYPAL",
                integration_type: "THIRD_PARTY",
                // PARTNER_FEE now, so a platform fee can be added later without asking again.
                third_party_details: { features: ["PAYMENT", "REFUND", "PARTNER_FEE"] },
              },
            },
          },
        ],
        products: ["EXPRESS_CHECKOUT"],
        legal_consents: [{ type: "SHARE_DATA_CONSENT", granted: true }],
        partner_config_override: { return_url: returnUrl, return_url_description: "Back to your OneThing shop" },
      },
    },
    partnerToken,
  );
  const url = res.links.find((l) => l.rel === "action_url")?.href;
  if (!url) throw new PayPalError("partner referral", 502, "no action_url in PayPal's reply");
  return url;
}

/**
 * The seller who finished onboarding with this trackingId, and whether they can be paid, or null
 * if nobody has. Asked of PayPal, never taken from the return URL, which anyone could forge.
 */
export async function connectedMerchant(trackingId: string): Promise<{ merchantId: string; status: PayPalStatus } | null> {
  const partner = encodeURIComponent(process.env.PAYPAL_PARTNER_MERCHANT_ID!);
  let found: { merchant_id?: string };
  try {
    found = await call("find merchant", `/v1/customer/partners/${partner}/merchant-integrations?tracking_id=${encodeURIComponent(trackingId)}`, { method: "GET" }, partnerToken);
  } catch (err) {
    if (err instanceof PayPalError && err.status === 404) return null;
    throw err;
  }
  if (!found.merchant_id) return null;
  return { merchantId: found.merchant_id, status: await merchantStatus(found.merchant_id) };
}

export async function merchantStatus(merchantId: string): Promise<PayPalStatus> {
  const partner = encodeURIComponent(process.env.PAYPAL_PARTNER_MERCHANT_ID!);
  const s = await call<{ payments_receivable?: boolean; primary_email_confirmed?: boolean }>(
    "merchant status",
    `/v1/customer/partners/${partner}/merchant-integrations/${encodeURIComponent(merchantId)}`,
    { method: "GET" },
    partnerToken,
  );
  return { receivable: Boolean(s.payments_receivable), emailConfirmed: Boolean(s.primary_email_confirmed), checkedAt: new Date().toISOString() };
}

export const sdkUrl = () =>
  process.env.PAYPAL_ENV === "live"
    ? "https://www.paypal.com/web-sdk/v6/core"
    : "https://www.sandbox.paypal.com/web-sdk/v6/core";

// ---- Log in with PayPal (OpenID Connect) ---------------------------------------------------
// Sellers can sign in with their PayPal account: PayPal vouches for the email, and it's the
// account their sales should be paid into. Needs "Log in with PayPal" ticked on the app in the
// developer dashboard, with <APP_URL>/api/account/paypal/callback as a Return URL.

const CONNECT =
  process.env.PAYPAL_ENV === "live" ? "https://www.paypal.com/connect" : "https://www.sandbox.paypal.com/connect";

/** Off until the PayPal app has Log in with PayPal and our Return URL set up: PAYPAL_LOGIN=on. */
export const paypalLoginEnabled = () => paypalEnabled() && process.env.PAYPAL_LOGIN === "on";

export const paypalLoginReturnUrl = () => `${appUrl()}/api/account/paypal/callback`;

export function paypalLoginUrl(state: string): string {
  const q = new URLSearchParams({
    flowEntry: "static",
    client_id: process.env.PAYPAL_CLIENT_ID ?? "",
    response_type: "code",
    // email: who they are; paypalattributes: payer id and whether the account is verified.
    scope: "openid email https://uri.paypal.com/services/paypalattributes",
    redirect_uri: paypalLoginReturnUrl(),
    state,
    fullPage: "true",
  });
  return `${CONNECT}?${q.toString().replace(/\+/g, "%20")}`;
}

export type PayPalIdentity = { userId: string; email: string | null; emailVerified: boolean; payerId: string | null; verifiedAccount: boolean };

/** Trades the code PayPal sent back for the person's identity. */
export async function paypalIdentity(code: string): Promise<PayPalIdentity> {
  const basic = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${API}/v1/oauth2/token`, {
    method: "POST",
    headers: { authorization: `Basic ${basic}`, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code }),
  });
  if (!res.ok) throw new PayPalError("login token", res.status, await res.text());
  const { access_token } = (await res.json()) as { access_token: string };

  // PayPal documents two paths for user info; try the one their integration guide uses first.
  type Info = {
    user_id?: string;
    sub?: string;
    payer_id?: string;
    email?: string;
    email_verified?: boolean;
    emails?: { value: string; primary?: boolean; confirmed?: boolean }[];
    verified_account?: boolean | string;
  };
  let info: Info | null = null;
  let last = "";
  for (const path of ["/v1/identity/oauth2/userinfo?schema=paypalv1.1", "/v1/identity/openidconnect/userinfo?schema=openid"]) {
    const r = await fetch(`${API}${path}`, { headers: { authorization: `Bearer ${access_token}` } });
    if (r.ok) {
      info = (await r.json()) as Info;
      break;
    }
    last = `${r.status} ${await r.text()}`;
  }
  if (!info) throw new PayPalError("login userinfo", 502, last);

  // The two schemas shape email differently: a flat field, or a list with a primary one.
  const listed = info.emails?.find((e) => e.primary) ?? info.emails?.[0];
  const email = (info.email ?? listed?.value ?? null)?.toLowerCase() ?? null;
  const userId = info.user_id ?? info.sub;
  if (!userId) throw new PayPalError("login userinfo", 502, "no user id in user info");
  return {
    userId,
    email,
    emailVerified: Boolean(info.email_verified ?? listed?.confirmed),
    payerId: info.payer_id ?? null,
    verifiedAccount: info.verified_account === true || info.verified_account === "true",
  };
}
