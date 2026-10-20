import Link from "next/link";
import { geminiEnabled } from "@/lib/gemini";
import { NewShopForm } from "./NewShopForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create your shop · micro-shop" };

export default function NewShop() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <Link href="/" className="text-sm font-semibold tracking-tight">micro-shop</Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">Let&apos;s build your shop</h1>
      <p className="mt-3 text-lg text-muted">
        One product, one page. Give us a photo and a few sentences — Gemini designs the page and writes the copy, and PayPal handles the money.
      </p>
      <div className="mt-10">
        <NewShopForm geminiReady={geminiEnabled()} />
      </div>
    </main>
  );
}
