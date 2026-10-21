import Link from "next/link";
import { currentAccount } from "@/lib/accounts";
import { SignInForm } from "@/components/SignInForm";
import { channel3Enabled } from "@/lib/channel3";
import { geminiEnabled } from "@/lib/gemini";
import { paypalLoginEnabled } from "@/lib/paypal";
import { NewShopForm } from "./NewShopForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create your shop · OneThing" };

export default async function NewShop() {
  // Shops belong to an account, so a lost link is never a lost shop. One field, no password.
  if (!(await currentAccount())) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
        <Link href="/" className="text-sm font-semibold tracking-tight">OneThing</Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">First, where should we keep your shop?</h1>
        <p className="mt-2 text-muted">Your shops stay together under this, and you can find them again from any device.</p>
        <div className="mt-8">
          <SignInForm paypal={paypalLoginEnabled()} next="/new" />
        </div>
      </main>
    );
  }
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <div className="flex items-center">
        <Link href="/" className="text-sm font-semibold tracking-tight">OneThing</Link>
        <Link href="/account" className="ml-auto text-sm text-muted hover:text-foreground">Your shops</Link>
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">What are you selling?</h1>
      <p className="mt-2 text-lg text-muted">Start with one thing. AI works out the rest.</p>
      <div className="mt-8">
        <NewShopForm geminiReady={geminiEnabled()} channel3Ready={channel3Enabled()} />
      </div>
    </main>
  );
}
