import Link from "next/link";
import { accountLabel, currentAccount } from "@/lib/accounts";
import { blobUrl, listAccountShops, money, shopPhotos } from "@/lib/shops";
import { SignInForm } from "@/components/SignInForm";
import { SignOutButton } from "./SignOutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your shops · OneThing", robots: { index: false } };

export default async function AccountPage() {
  const account = await currentAccount();

  if (!account) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
        <Link href="/" className="text-sm font-semibold tracking-tight">OneThing</Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Your shops</h1>
        <p className="mt-2 text-muted">Sign in with the email or phone number you made them with.</p>
        <div className="mt-8">
          <SignInForm cta="Sign in" />
        </div>
      </main>
    );
  }

  const shops = await listAccountShops(account.id);
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <header className="flex items-center gap-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">OneThing</Link>
        <span className="ml-auto truncate text-sm text-muted">{accountLabel(account)}</span>
        <SignOutButton />
      </header>
      <div className="mt-8 flex items-end justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Your shops</h1>
        <Link href="/new" className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
          Create a shop
        </Link>
      </div>

      {shops.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line px-6 py-12 text-center text-muted">
          No shops yet. Snap a photo of the thing you sell to make your first.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
          {shops.map((s) => {
            const cover = blobUrl(shopPhotos(s)[0] ?? s.hero_blob) ?? s.referral?.image ?? null;
            return (
              <li key={s.id} className="flex items-center gap-4 p-4">
                <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-background">
                  {/* eslint-disable-next-line @next/next/no-img-element -- the seller's own photo */}
                  {cover && <img src={cover} alt="" className="size-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{s.spec.productName}</p>
                  <p className="text-sm text-muted">
                    /{s.slug} · {s.product_type === "referral" ? "recommendation" : money(s.price_cents, s.currency)}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.status === "live" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-900"}`}>
                  {s.status === "live" ? "Live" : "Draft"}
                </span>
                <Link href={`/manage/${s.slug}`} className="rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-foreground">
                  Manage
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
