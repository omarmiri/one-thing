import Link from "next/link";
import { channel3Enabled } from "@/lib/channel3";
import { geminiEnabled } from "@/lib/gemini";
import { NewShopForm } from "./NewShopForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create your shop · OneThing" };

export default function NewShop() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <Link href="/" className="text-sm font-semibold tracking-tight">OneThing</Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">What are you selling?</h1>
      <p className="mt-2 text-lg text-muted">Start with one thing. AI works out the rest.</p>
      <div className="mt-8">
        <NewShopForm geminiReady={geminiEnabled()} channel3Ready={channel3Enabled()} />
      </div>
    </main>
  );
}
