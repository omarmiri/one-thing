import { notFound } from "next/navigation";
import { adminSupabase, currentAdmin } from "@/lib/admin";
import { isAdminKey } from "@/lib/ids";
import { findShops, listGalleryRequests, money, shopContacts, shopView, type GalleryStatus, type Shop } from "@/lib/shops";
import { AdminSignIn, AdminSignOut } from "./AdminSignIn";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gallery review · OneThing", robots: { index: false, follow: false } };

const LABEL: Record<GalleryStatus, string> = { pending: "Waiting", approved: "In the gallery", rejected: "Rejected" };

/**
 * Shops that asked to be in the gallery. Not linked anywhere. Sign in with the usage dashboard's
 * account (allowlisted), or open it with ?key=ADMIN_KEY.
 */
export default async function GalleryReview({ searchParams }: PageProps<"/admin/gallery">) {
  const { key: k, q: query, note } = await searchParams;
  const key = typeof k === "string" && isAdminKey(k) ? k : null;
  const admin = await currentAdmin();
  const supabase = adminSupabase();
  if (!key && !admin) {
    if (!supabase) notFound();
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Gallery review</h1>
        <AdminSignIn url={supabase.url} anonKey={supabase.anonKey} />
      </main>
    );
  }
  const shops = await listGalleryRequests();
  const q = typeof query === "string" ? query.trim().slice(0, 60) : "";
  const found = q ? await findShops(q) : [];
  const contacts = await shopContacts([...shops, ...found]);
  // The seller's sign-in (account email or phone), the email typed at setup, and where PayPal pays.
  const who = (shop: Shop) =>
    [
      shop.account_id && contacts.get(shop.account_id) && `Account: ${contacts.get(shop.account_id)}`,
      shop.seller_email && `Seller: ${shop.seller_email}`,
      shop.paypal_email && `PayPal: ${shop.paypal_email}`,
      shop.paypal_merchant_id && "PayPal connected",
    ]
      .filter(Boolean)
      .join(" · ") || "No contact on file";
  // A shop nobody owns can only be managed by its private link; this gives it to a seller's account.
  const giveForm = (shop: Shop) =>
    !shop.account_id && (
      <form method="post" action="/api/admin/shops/owner" className="mt-2 flex max-w-sm gap-2">
        {key && <input type="hidden" name="key" value={key} />}
        {q && <input type="hidden" name="q" value={q} />}
        <input type="hidden" name="id" value={shop.id} />
        <input
          name="owner"
          required
          placeholder="Give to account: email or phone"
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-2 py-1 text-xs"
        />
        <button className="rounded-full border border-line px-3 py-1 text-xs font-semibold">Give</button>
      </form>
    );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gallery review</h1>
        {admin && (
          <p className="text-sm text-muted">
            {admin} · <AdminSignOut />
          </p>
        )}
      </div>
      <p className="mt-2 text-muted">
        Shops whose sellers asked to be in /gallery. Only approved ones show there, on the home page and in agent search.
      </p>

      {typeof note === "string" && note && <p className="mt-4 rounded-lg bg-black/5 px-3 py-2 text-sm">{note.slice(0, 200)}</p>}
      <form method="get" className="mt-6 flex max-w-md gap-2">
        {key && <input type="hidden" name="key" value={key} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Find any shop: name, link or description"
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm"
        />
        <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold">Find</button>
      </form>
      {q && (
        <ul className="mt-3 space-y-2">
          {found.length ? (
            found.map((shop) => (
              <li key={shop.id} className="rounded-xl border border-line bg-white px-4 py-3 text-sm">
                <a href={`/${shop.slug}`} target="_blank" className="font-semibold hover:underline">
                  {shop.spec.productName}
                </a>{" "}
                <span className="text-muted">
                  /{shop.slug} · {shop.status}
                </span>
                <p className="mt-1 break-all text-muted">{who(shop)}</p>
                {giveForm(shop)}
              </li>
            ))
          ) : (
            <li className="text-sm text-muted">No shop matches &ldquo;{q}&rdquo;.</li>
          )}
        </ul>
      )}
      {shops.length ? (
        <ul className="mt-8 space-y-3">
          {shops.map((shop) => {
            const view = shopView(shop);
            const image = view.photoUrl ?? view.heroUrl ?? shop.referral?.image ?? null;
            return (
              <li key={shop.id} className="flex items-center gap-4 rounded-xl border border-line bg-white p-3">
                <a href={`/${shop.slug}`} target="_blank" className="size-24 shrink-0 overflow-hidden rounded-lg bg-black/5">
                  {image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt={shop.spec.imageAlt} className="size-full object-cover" />
                  )}
                </a>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                    {LABEL[shop.gallery_status]} · {shop.status === "live" ? "live" : "draft"}
                  </p>
                  <a href={`/${shop.slug}`} target="_blank" className="mt-1 block truncate font-semibold hover:underline">
                    {shop.spec.productName}
                  </a>
                  <p className="truncate text-sm text-muted">{shop.spec.headline}</p>
                  <p className="text-sm">{money(shop.price_cents, shop.currency)}</p>
                  <p className="truncate text-xs text-muted">{who(shop)}</p>
                  {giveForm(shop)}
                </div>
                <form method="post" action="/api/admin/gallery" className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  {key && <input type="hidden" name="key" value={key} />}
                  <input type="hidden" name="id" value={shop.id} />
                  {shop.gallery_status !== "approved" && (
                    <button name="status" value="approved" className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
                      Approve
                    </button>
                  )}
                  {shop.gallery_status !== "rejected" && (
                    <button name="status" value="rejected" className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
                      Reject
                    </button>
                  )}
                </form>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-8 text-muted">No shop has asked to be in the gallery yet.</p>
      )}
    </main>
  );
}
