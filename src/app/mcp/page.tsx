import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { CopyButton } from "@/components/CopyButton";
import { appUrl } from "@/lib/ids";

// How to add the MCP server to an assistant. The server itself (/api/mcp) only answers POSTs, so a
// person opening that URL got an error; the Test Panel and this site link here instead.

export const metadata: Metadata = {
  title: "MCP server · OneThing",
  description: "Add OneThing's MCP server to ChatGPT, Gemini, Claude or your editor, and let an AI assistant shop the gallery.",
};

const PROMPT = "Find me something interesting to buy from the OneThing gallery";

const TOOLS: [string, string, string][] = [
  ["search_shops", "query?, limit?", "Browse or search the gallery. No match returns the whole gallery."],
  ["get_product", "shop", "Price, shipping, options and stock for one shop."],
  ["create_order", "shop, options?", "One unit on order and a PayPal link. Charges nothing."],
  ["get_order", "order_id", "Paid yet? Once it is: the access code, download or shipping."],
];

function Code({ children }: { children: string }) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl border border-line bg-white p-3">
      <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-xs leading-relaxed">{children}</pre>
      <CopyButton text={children} />
    </div>
  );
}

function Client({ name, plan, clip, children }: { name: string; plan?: string; clip?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h3 className="text-lg font-semibold">
        {name}
        {plan && <span className="ml-2 text-xs font-normal text-muted">{plan}</span>}
      </h3>
      <div className="mt-2 space-y-2 text-sm text-muted [&_strong]:text-foreground">{children}</div>
      {clip && (
        <video
          src={clip}
          autoPlay
          muted
          loop
          playsInline
          className="mt-4 max-h-72 w-full rounded-lg border border-line bg-black object-contain"
        />
      )}
    </section>
  );
}

export default function McpPage() {
  const url = `${appUrl()}/api/mcp`;
  const json = (servers: string, extra = "") =>
    JSON.stringify({ [servers]: { onething: { ...(extra && { type: extra }), url } } }, null, 2);

  return (
    <main className="flex-1">
      <header className="mx-auto flex max-w-4xl items-center px-4 py-5 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          OneThing
        </Link>
        <Link href="/gallery" className="ml-auto text-sm font-medium text-muted hover:text-foreground">
          Gallery
        </Link>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">For AI assistants</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">The OneThing MCP server</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Add it to your assistant once, and it can search the gallery, show you a product and start a PayPal checkout for
          you. You always pay at PayPal yourself: the assistant can&apos;t spend your money.
        </p>

        <div className="mt-8 rounded-2xl border border-accent/40 bg-accent/5 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Server URL</p>
          <div className="mt-2 flex items-center gap-3">
            <code className="min-w-0 flex-1 truncate font-mono text-base">{url}</code>
            <CopyButton text={url} label="Copy URL" className="px-4 py-2 text-sm" />
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            {[
              ["Name", "OneThing"],
              ["Authentication", "None"],
              ["Transport", "Streamable HTTP"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted">
            No account, key or sign-in. Opening the URL in a browser shows an error: it&apos;s for assistants, which send
            it POST requests.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-4 px-4 pb-10 sm:px-6">
        <h2 className="text-2xl font-bold">Add it to your assistant</h2>

        <Client name="ChatGPT" plan="any plan, free included, on the web" clip="/connect/chatgpt-2.webm">
          <p>
            Open{" "}
            <a href="https://chatgpt.com/plugins" target="_blank" rel="noopener noreferrer" className="text-accent underline">
              Plugins
            </a>
            , click <strong>Add</strong>, then <strong>Add custom MCP server</strong>.
          </p>
          <p>
            Name it <strong>OneThing</strong>, paste the server URL, set Authentication to <strong>No authentication</strong>,
            tick <strong>I understand</strong> and click <strong>Create as a plugin</strong>. Then ask in a new chat: products
            show as a card with a Pay with PayPal button.
          </p>
        </Client>

        <Client name="Gemini" plan="custom apps may need a paid Google AI plan" clip="/connect/gemini-2.webm">
          <p>
            Open{" "}
            <a
              href="https://gemini.google.com/customize/connectors"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Connected Apps
            </a>{" "}
            and click <strong>+ Custom</strong>. Paste the server URL and click <strong>Next</strong>, tick the box and click{" "}
            <strong>Connect</strong>, then <strong>Connect</strong> again to save it.
          </p>
          <p>
            Start your message with <strong>@OneThing</strong> so Gemini uses it.
          </p>
        </Client>

        <Client name="Claude">
          <p>
            In Claude, open <strong>Settings → Connectors</strong>, choose <strong>Add custom connector</strong>, name it
            OneThing and paste the server URL. Leave the OAuth fields empty.
          </p>
          <p>In Claude Code, run:</p>
          <Code>{`claude mcp add --transport http onething ${url}`}</Code>
        </Client>

        <Client name="Cursor, VS Code and other MCP clients">
          <p>
            Cursor: add this to <code>~/.cursor/mcp.json</code> (or <code>.cursor/mcp.json</code> in a project).
          </p>
          <Code>{json("mcpServers")}</Code>
          <p className="pt-2">
            VS Code: add this to <code>.vscode/mcp.json</code>.
          </p>
          <Code>{json("servers", "http")}</Code>
        </Client>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6">
        <h2 className="text-2xl font-bold">Try it</h2>
        <p className="mt-2 text-muted">Once it&apos;s added, ask:</p>
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-line bg-white p-3">
          <span className="min-w-0 flex-1">{PROMPT}</span>
          <CopyButton text={PROMPT} />
        </div>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-muted">
          <li>The assistant shows you what&apos;s in the gallery. Pick one, and a size or colour if it has them.</li>
          <li>Say to buy it. You get a Pay with PayPal link; nothing is charged yet.</li>
          <li>Pay at PayPal, then tell the assistant you&apos;ve paid. It shows your access code, download or shipping details.</li>
        </ol>
        <p className="mt-4 rounded-xl border border-line bg-white p-3 text-sm text-muted">
          <strong className="text-foreground">This site runs on the PayPal sandbox.</strong> Pay with a personal sandbox
          account from your PayPal developer dashboard, or a test card. No real money moves.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6">
        <h2 className="text-2xl font-bold">Tools</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <tbody>
              {TOOLS.map(([name, args, what]) => (
                <tr key={name} className="border-b border-line last:border-0">
                  <td className="p-3 align-top font-mono text-xs font-semibold">{name}</td>
                  <td className="hidden p-3 align-top font-mono text-xs text-muted sm:table-cell">{args}</td>
                  <td className="p-3 align-top text-muted">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted">
          Only <code>create_order</code> changes anything; the others only read. Hosts that draw MCP Apps (ChatGPT) show
          results as a product card with the real photos.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6">
        <h2 className="text-2xl font-bold">Check it from a terminal</h2>
        <p className="mt-2 text-sm text-muted">The server is stateless JSON-RPC over POST, with no event stream:</p>
        <Code>{`curl -X POST ${url} \\
  -H "content-type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`}</Code>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <h2 className="text-2xl font-bold">No MCP?</h2>
        <p className="mt-2 text-sm text-muted">
          Assistants that can only read web pages (Grok, Kimi) can shop from{" "}
          <a href="/llms.txt" className="text-accent underline">
            /llms.txt
          </a>{" "}
          instead. The full API, the MCP details and SDKs are in the{" "}
          <a
            href="https://omarmiri.github.io/one-thing/#/http/x-redirect/cGFnZSUzQWd1aWRlcyUyRmFnZW50cw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            API docs
          </a>
          .
        </p>
      </section>
    </main>
  );
}
