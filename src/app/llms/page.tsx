import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { appUrl } from "@/lib/ids";
import { listLiveShops } from "@/lib/shops";

// What /llms.txt is, for people. The file itself is written for models; the Test Panel links here
// and this page links to the file.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "llms.txt · OneThing",
  description: "The plain-text guide that lets any AI assistant search OneThing's gallery and buy, with no plugin or key.",
};

const SECTIONS: [string, string][] = [
  ["Shops in the gallery", "Every live gallery shop with its price, total with shipping, photo and a ready order link for each size or colour."],
  ["Talking to the buyer", "Show the photo, keep replies short, and write the pay link as a link."],
  ["Buy", "Open the order link once the buyer says to buy, hand them the PayPal link, then check the order when they've paid."],
  ["Find and read", "Search the gallery and read one product as JSON."],
  ["Check an order", "What each order status means and what to do next."],
  ["MCP", "The MCP server, for assistants that can call tools instead."],
];

export default async function LlmsPage() {
  const base = appUrl();
  const file = `${base}/llms.txt`;
  const shops = (await listLiveShops()).length;
  const prompt = `Read ${file} and help me buy something from the OneThing gallery`;

  return (
    <main className="flex-1">
      <header className="mx-auto flex max-w-3xl items-center px-4 py-5 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          OneThing
        </Link>
        <Link href="/gallery" className="ml-auto text-sm font-medium text-muted hover:text-foreground">
          Gallery
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">For AI assistants</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">llms.txt</h1>
        <p className="mt-4 text-lg text-muted">
          A plain-text guide to OneThing written for language models, following the{" "}
          <a href="https://llmstxt.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            llms.txt
          </a>{" "}
          convention. An assistant that can read web pages (Grok, Kimi) learns from it how to search the gallery and buy,
          with no plugin, key or sign-in. The buyer still pays at PayPal themselves.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="/llms.txt" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
            Open llms.txt
          </a>
          <a
            href="/llms.txt"
            download="onething-llms.txt"
            className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold hover:border-accent/70"
          >
            Download
          </a>
          <code className="font-mono text-sm text-muted">{file}</code>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <h2 className="text-2xl font-bold">What&apos;s in it</h2>
        <p className="mt-2 text-sm text-muted">
          It&apos;s built live from the gallery on every request, so it lists the {shops} shop{shops === 1 ? "" : "s"} live
          right now.
        </p>
        <dl className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {SECTIONS.map(([name, what]) => (
            <div key={name} className="p-4 sm:flex sm:gap-6">
              <dt className="font-semibold sm:w-48 sm:shrink-0">{name}</dt>
              <dd className="mt-1 text-sm text-muted sm:mt-0">{what}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <h2 className="text-2xl font-bold">Try it</h2>
        <p className="mt-2 text-sm text-muted">Paste this into an assistant that can browse:</p>
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-line bg-white p-3">
          <span className="min-w-0 flex-1 text-sm">{prompt}</span>
          <CopyButton text={prompt} />
        </div>
        <p className="mt-4 text-sm text-muted">
          Assistants that can call tools (ChatGPT, Gemini, Claude) do better with the{" "}
          <Link href="/mcp" className="text-accent underline">
            MCP server
          </Link>
          . Every page on this site links to llms.txt, so an assistant that browses finds it on its own.
        </p>
      </section>
    </main>
  );
}
