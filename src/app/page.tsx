import Link from "next/link";
import { GalleryCard } from "@/components/GalleryCard";
import { listLiveShops } from "@/lib/shops";

// Reads live shops: render per request, not once at build time.
export const dynamic = "force-dynamic";

const STEPS = [
  { n: "1", title: "Snap a photo", body: "Add one picture and a few sentences about what you're selling — a mug, a print, an ebook, a preset pack." },
  { n: "2", title: "Gemini designs it", body: "Colours from your photo, fonts that fit, a headline, story, FAQ and a suggested price. Change anything by asking." },
  { n: "3", title: "Get paid with PayPal", body: "Publish and share the link. Buyers pay with PayPal or card, and the money goes straight to your PayPal account." },
];

export default async function Home() {
  const latest = await listLiveShops(3);

  return (
    <main className="flex-1">
      <header className="mx-auto flex max-w-6xl items-center px-4 py-5 sm:px-6">
        <span className="font-semibold tracking-tight">OneThing</span>
        <Link href="/gallery" className="ml-auto mr-5 text-sm font-medium text-muted hover:text-foreground">
          Gallery
        </Link>
        <Link href="/account" className="mr-5 text-sm font-medium text-muted hover:text-foreground">
          Your shops
        </Link>
        <Link href="/new" className=" rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
          Create a shop
        </Link>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">One product. One page. Paid.</p>
        <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-7xl">
          Sell your one thing
          <br />
          in about a minute.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-muted">
          You don&apos;t need a whole store to sell one product. Give OneThing a photo — AI builds the page, PayPal takes the payments.
        </p>
        <Link href="/new" className="mt-10 inline-block rounded-full bg-foreground px-8 py-4 text-lg font-semibold text-background">
          Design my shop — free
        </Link>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-24 sm:px-6 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="rounded-2xl border border-line bg-white p-7">
            <span className="flex size-9 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">{s.n}</span>
            <h2 className="mt-5 text-xl font-semibold">{s.title}</h2>
            <p className="mt-2 text-muted">{s.body}</p>
          </div>
        ))}
      </section>

      {latest.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="flex items-baseline">
            <h2 className="text-2xl font-bold tracking-tight">Made with OneThing</h2>
            <Link href="/gallery" className="ml-auto font-semibold text-accent">
              See the gallery →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((s) => (
              <GalleryCard key={s.id} shop={s} />
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        Built for the PayPal AI Hackathon · Gemini + PayPal
      </footer>
    </main>
  );
}
