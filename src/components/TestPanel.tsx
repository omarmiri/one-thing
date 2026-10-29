"use client";

import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Edge = "left" | "right" | "top" | "bottom";
type Dock = { edge: Edge; at: number };
type Section = "ai" | "sandbox" | "dev";

const STORE = "onething-test-panel";
const DEFAULT: Dock = { edge: "right", at: 0.5 };
// Routes that aren't storefronts: the panel stays off them.
const NOT_SHOPS = new Set([
  "account",
  "admin",
  "api",
  "lab",
  "manage",
  "new",
  "o",
  "s",
]);

/**
 * Assistants that have bought from OneThing in testing. `url` opens the assistant with the
 * prompt typed (Perplexity sends it, Grok and Kimi ask first); without one the prompt is copied
 * and the site opened. ChatGPT can't read our pages, so it gets the connector steps instead.
 */
const ASSISTANTS: {
  name: string;
  note: string;
  url?: (p: string) => string;
  home: string;
}[] = [
  {
    name: "Perplexity",
    note: "Runs the prompt",
    url: (p) => `https://www.perplexity.ai/search?q=${encodeURIComponent(p)}`,
    home: "https://www.perplexity.ai",
  },
  {
    name: "Grok",
    note: "Prompt typed, press Send",
    url: (p) => `https://grok.com/?q=${encodeURIComponent(p)}`,
    home: "https://grok.com",
  },
  {
    name: "Kimi",
    note: "Prompt typed, press Send",
    url: (p) =>
      `https://www.kimi.com/_prefill_chat?prefill_prompt=${encodeURIComponent(p)}&send_immediately=false`,
    home: "https://www.kimi.com",
  },
  {
    name: "Muse (Meta AI)",
    note: "Prompt copied: paste it",
    home: "https://www.meta.ai",
  },
];

const noSubscribe = () => () => {};
// The raw stored string, so React can compare snapshots by value.
const storedDock = () => {
  try {
    return localStorage.getItem(STORE);
  } catch {
    return null;
  }
};
const parseDock = (raw: string | null): Dock => {
  try {
    const d = JSON.parse(raw ?? "");
    if (
      ["left", "right", "top", "bottom"].includes(d.edge) &&
      d.at >= 0 &&
      d.at <= 1
    )
      return d;
  } catch {}
  return DEFAULT;
};

/** The nearest screen edge to a point, and how far along it the point is (0 to 1). */
const dockAt = (x: number, y: number): Dock => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const gaps: [Edge, number][] = [
    ["left", x],
    ["right", w - x],
    ["top", y],
    ["bottom", h - y],
  ];
  const edge = gaps.sort((a, b) => a[1] - b[1])[0][0];
  const at = edge === "left" || edge === "right" ? y / h : x / w;
  return { edge, at: Math.min(0.92, Math.max(0.08, at)) };
};

/**
 * A "Test Panel" tab on the screen edge for judges and testers: buy through an AI assistant,
 * pay in the PayPal sandbox, and find the agent endpoints. Drag the grip to move it along an edge
 * or to another one; « opens it. Its place is remembered in this browser only.
 */
export function TestPanel() {
  const path = usePathname();
  const stored = useSyncExternalStore(noSubscribe, storedDock, () => null);
  const origin = useSyncExternalStore(
    noSubscribe,
    () => window.location.origin,
    () => "",
  );
  const [moved, setDock] = useState<Dock | null>(null);
  const dock = moved ?? parseDock(stored);
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>("ai");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState("");
  const dragging = useRef(false);

  const first = path.split("/")[1] ?? "";
  const isShop = !!first && first !== "gallery" && path.split("/").length === 2;
  const hidden = NOT_SHOPS.has(first) || path.split("/").length > 2;

  // Opening writes a fresh prompt: this shop on a shop page (its title is the product name), else the gallery.
  const toggle = () => {
    if (!open)
      setPrompt(
        isShop
          ? `Buy me ${document.title.split(" — ")[0]} from ${origin}${path}`
          : `Find me something to buy at ${origin}/gallery and help me check out with PayPal`,
      );
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  if (hidden) return null;

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    } catch {}
  };

  const startDrag = (e: ReactPointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    setOpen(false);
    const move = (ev: PointerEvent) => setDock(dockAt(ev.clientX, ev.clientY));
    const up = (ev: PointerEvent) => {
      dragging.current = false;
      const d = dockAt(ev.clientX, ev.clientY);
      setDock(d);
      try {
        localStorage.setItem(STORE, JSON.stringify(d));
      } catch {}
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const side = dock.edge === "left" || dock.edge === "right";
  // The drawer hugs its edge; closed, it slides fully off screen and only the tab shows.
  const drawer: React.CSSProperties = side
    ? {
        top: 0,
        bottom: 0,
        [dock.edge]: 0,
        width: "min(560px, 100vw)",
        transform: open
          ? "none"
          : `translateX(${dock.edge === "right" ? "100%" : "-100%"})`,
      }
    : {
        left: 0,
        right: 0,
        [dock.edge]: 0,
        maxHeight: "80vh",
        transform: open
          ? "none"
          : `translateY(${dock.edge === "bottom" ? "100%" : "-100%"})`,
      };
  // The tab sits just outside the drawer's inner edge (right: 100% on a right-hand drawer puts
  // it to the drawer's left), at its place along the screen edge.
  const tab: React.CSSProperties = side
    ? {
        top: `${dock.at * 100}%`,
        [dock.edge]: "100%",
        transform: "translateY(-50%)",
      }
    : {
        left: `${dock.at * 100}%`,
        [dock.edge]: "100%",
        transform: "translateX(-50%)",
      };
  // « points into the screen when closed and back at the edge when open.
  const turn =
    { right: 0, bottom: 90, left: 180, top: 270 }[dock.edge] + (open ? 180 : 0);
  const tabRound = {
    right: "rounded-l-2xl border-r-0",
    left: "rounded-r-2xl border-l-0",
    top: "rounded-b-2xl border-t-0",
    bottom: "rounded-t-2xl border-b-0",
  }[dock.edge];
  const mcp = `${origin}/api/mcp`;

  return (
    <div
      className="fixed z-[60] flex flex-col bg-[#0d0b0a] font-sans text-white shadow-2xl transition-transform duration-300 ease-out"
      style={drawer}
      role="dialog"
      aria-label="Test panel"
    >
      <div
        className={`absolute flex items-center gap-2 border-2 border-[#e8762b] bg-[#0d0b0a] p-2 ${side ? "flex-col" : "flex-row"} ${tabRound}`}
        style={tab}
      >
        <button
          onClick={() => !dragging.current && toggle()}
          aria-label={open ? "Close test panel" : "Open test panel"}
          className="grid size-7 place-items-center rounded-md text-lg leading-none hover:bg-white/10"
          style={{ transform: `rotate(${turn}deg)` }}
        >
          «
        </button>
        <span className="grid size-8 place-items-center rounded-lg border border-[#e8762b] font-mono text-xs text-[#e8762b]">
          &lt;/&gt;
        </span>
        <span
          className={`text-center text-xs font-bold leading-tight ${side ? "w-12" : ""}`}
        >
          Test Panel
        </span>
        <span
          onPointerDown={startDrag}
          title="Drag to move"
          className={`grid cursor-grab touch-none grid-cols-3 gap-1 p-1.5 active:cursor-grabbing ${side ? "border-t border-white/15 pt-2" : "border-l border-white/15 pl-2"}`}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} className="size-1 rounded-full bg-white/80" />
          ))}
        </span>
      </div>

      {/* Closed, the drawer is off screen: keep its links out of the tab order. */}
      <div className="flex min-h-0 flex-1 flex-col" inert={!open}>
        <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <span className="grid size-8 place-items-center rounded-lg border border-[#e8762b] font-mono text-xs text-[#e8762b]">
            &lt;/&gt;
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white/50">OneThing</p>
            <p className="font-semibold">Test Panel</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full border border-white/20 hover:bg-white/10"
          >
            ✕
          </button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-white/10 px-4 py-2 text-sm">
          {(
            [
              ["ai", "Buy with AI"],
              ["sandbox", "Pay in sandbox"],
              ["dev", "For developers"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`shrink-0 rounded-full px-4 py-1.5 ${section === id ? "border border-[#e8762b]/60 bg-[#e8762b]/15" : "text-white/70 hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#2a1608] to-[#0d0b0a] p-5 text-sm">
          {section === "ai" && (
            <div className="space-y-4">
              <p className="inline-block rounded-full border border-[#e8762b]/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#f0a060]">
                Agentic checkout
              </p>
              <h2 className="text-2xl font-bold">Let an AI assistant buy it</h2>
              <p className="text-white/70">
                Open an assistant with this prompt. It reads{" "}
                {isShop ? "this shop" : "the gallery"}, makes the order and
                hands back a PayPal link. You approve the payment; the assistant
                can&apos;t pay for you.
              </p>
              <div className="rounded-xl border border-white/15 bg-black/30 p-3">
                <label
                  htmlFor="tp-prompt"
                  className="text-[11px] uppercase tracking-wider text-white/50"
                >
                  Prompt
                </label>
                <textarea
                  id="tp-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={2}
                  className="mt-1 w-full resize-none bg-transparent outline-none"
                />
                <button
                  onClick={() => copy(prompt, "prompt")}
                  className="text-xs text-[#f0a060] hover:underline"
                >
                  {copied === "prompt" ? "Copied" : "Copy prompt"}
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {ASSISTANTS.map((a) => (
                  <a
                    key={a.name}
                    href={a.url ? a.url(prompt) : a.home}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => !a.url && copy(prompt, "prompt")}
                    className="rounded-xl border border-white/15 bg-white/[0.04] p-3 hover:border-[#e8762b]/70"
                  >
                    <span className="font-semibold">{a.name} ↗</span>
                    <span className="block text-xs text-white/55">
                      {a.note}
                    </span>
                  </a>
                ))}
              </div>
              <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4">
                <p className="font-semibold">
                  ChatGPT, with the OneThing connector
                </p>
                <p className="mt-1 text-xs text-white/55">
                  ChatGPT can&apos;t open our pages from its sandbox, so it
                  shops through our MCP server and shows a product card. Needs
                  ChatGPT Plus or higher.
                </p>
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-white/80">
                  <li>
                    Settings → Apps &amp; Connectors → Advanced → turn on
                    Developer mode.
                  </li>
                  <li>
                    Create a connector, name it OneThing, and paste the server
                    URL:
                  </li>
                </ol>
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2 font-mono text-xs">
                  <span className="min-w-0 flex-1 truncate">{mcp}</span>
                  <button
                    onClick={() => copy(mcp, "mcp")}
                    className="shrink-0 text-[#f0a060] hover:underline"
                  >
                    {copied === "mcp" ? "Copied" : "Copy"}
                  </button>
                </div>
                <ol
                  start={3}
                  className="mt-2 list-decimal space-y-1 pl-5 text-white/80"
                >
                  <li>
                    Choose No authentication, save, and turn OneThing on in a
                    new chat.
                  </li>
                </ol>
                <a
                  href={`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-full border border-[#e8762b]/60 bg-[#e8762b]/15 px-4 py-1.5 hover:bg-[#e8762b]/25"
                >
                  Open ChatGPT with the prompt ↗
                </a>
              </div>
            </div>
          )}

          {section === "sandbox" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                Paying in the PayPal sandbox
              </h2>
              <p className="text-white/70">
                Every shop here runs on PayPal&apos;s sandbox. No real money
                moves.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-white/80">
                <li>
                  <strong>Card:</strong> at PayPal choose{" "}
                  <em>Pay with Debit or Credit Card</em> and use a test card
                  from{" "}
                  <a
                    href="https://developer.paypal.com/tools/sandbox/card-testing/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f0a060] underline"
                  >
                    PayPal&apos;s card generator
                  </a>
                  , any future expiry and any CVV.
                </li>
                <li>
                  <strong>PayPal account:</strong> log in with a{" "}
                  <em>personal</em> sandbox account from your PayPal developer
                  dashboard. A business account is a seller, and PayPal refuses
                  it.
                </li>
                <li>
                  After paying, the shop shows the access code, the download or
                  the shipping confirmation. An assistant gets the same when you
                  tell it you&apos;ve paid.
                </li>
              </ul>
            </div>
          )}

          {section === "dev" && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">How agents shop here</h2>
              {[
                [
                  "llms.txt",
                  `${origin}/llms.txt`,
                  "Instructions any assistant can read",
                ],
                ...(isShop
                  ? [
                      [
                        "Product JSON",
                        `${origin}/api/agent/shops${path}`,
                        "Price, options and the order links",
                      ],
                    ]
                  : []),
                [
                  "MCP server",
                  mcp,
                  "search_shops, get_product, create_order, get_order",
                ],
                ["OpenAPI", `${origin}/openapi.yaml`, "The full REST API"],
                [
                  "Docs and SDKs",
                  "https://omarmiri.github.io/one-thing/",
                  "Generated with APIMatic",
                ],
              ].map(([name, url, note]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-white/15 bg-white/[0.04] p-3 hover:border-[#e8762b]/70"
                >
                  <span className="font-semibold">{name} ↗</span>
                  <span className="block text-xs text-white/55">{note}</span>
                  <span className="block truncate font-mono text-xs text-white/40">
                    {url}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
