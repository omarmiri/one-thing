import type { Metadata } from "next";
import Link from "next/link";
import { GalleryCard } from "@/components/GalleryCard";
import { listLiveShops } from "@/lib/shops";

// Reads live shops: render per request, not once at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery · OneThing",
  description: "One-product shops people made with OneThing: a photo in, a designed page out, paid with PayPal.",
};

export default async function Gallery() {
  const shops = await listLiveShops();

  return (
    <main className="flex-1">
      <header className="mx-auto flex max-w-6xl items-center px-4 py-5 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          OneThing
        </Link>
        <Link href="/new" className="ml-auto rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
          Create a shop
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Gallery</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">What people are selling</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Every page here started as one photo, link or pick. Gemini designed it; PayPal takes the payments.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {shops.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shops.map((s) => (
              <GalleryCard key={s.id} shop={s} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-white p-10 text-center">
            <p className="text-lg">No shops are live yet.</p>
            <Link href="/new" className="mt-5 inline-block rounded-full bg-foreground px-6 py-3 font-semibold text-background">
              Make the first one
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
