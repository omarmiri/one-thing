import Link from "next/link";
import { accountLabel, currentAccount } from "@/lib/accounts";
import { listKeys } from "@/lib/apiKeys";
import { PayPalLoginButton } from "@/components/SignInForm";
import { ApiKeys } from "../ApiKeys";

export const dynamic = "force-dynamic";
export const metadata = { title: "Developer API keys · OneThing", robots: { index: false } };

/** Platform API keys, kept off /account: most sellers never need one. */
export default async function KeysPage() {
  const account = await currentAccount();
  if (!account) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
        <Link href="/" className="text-sm font-semibold tracking-tight">OneThing</Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Developer API keys</h1>
        <p className="mt-2 text-muted">For platforms that make shops for their own sellers. Log in with PayPal to make one.</p>
        <div className="mt-8">
          <PayPalLoginButton next="/account/keys" />
        </div>
      </main>
    );
  }
  const keys = await listKeys(account.id);
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <header className="flex items-center gap-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">OneThing</Link>
        <Link href="/account" className="text-sm underline">Your shops</Link>
        <span className="ml-auto truncate text-sm text-muted">{accountLabel(account)}</span>
      </header>
      <ApiKeys keys={keys} verified={account.session_via === "paypal"} />
    </main>
  );
}
