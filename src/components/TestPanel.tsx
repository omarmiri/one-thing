"use client";

import { usePathname } from "next/navigation";
import { ApiLog } from "@/components/ApiLog";
import { apiCalls, installApiLog, subscribeApiLog } from "@/lib/apiLog";
import { OPEN_PANEL, setTestMode, useTestMode, useTestModeExplicit } from "@/lib/testMode";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Edge = "left" | "right" | "top" | "bottom";
// size: the drawer's width on a side edge, or its height on the top or bottom, in pixels.
type Dock = { edge: Edge; at: number; w?: number; h?: number };
type Section = "ai" | "sandbox" | "dev" | "log";

const STORE = "onething-test-panel";
const MIN_W = 300;
const MIN_H = 200;
const DEFAULT: Dock = { edge: "right", at: 0.5 };
// Routes that aren't storefronts: there the prompt is about the gallery, not this page.
const NOT_SHOPS = new Set([
  "account",
  "admin",
  "api",
  "lab",
  "llms",
  "manage",
  "mcp",
  "new",
  "o",
  "s",
]);

/**
 * Assistants that have bought from OneThing in testing. `url` opens the assistant with the
 * prompt typed (Grok and Kimi ask before sending); without one the prompt is copied
 * and the site opened. ChatGPT can't read our pages, so it gets the connector steps instead.
 * Perplexity was dropped on 2026-10-28: its fetches of /llms.txt fail ("Failed to fetch") while
 * ours get a 200, probably at the Cloudflare in front of Render, so it couldn't finish a purchase.
 */
const ASSISTANTS: {
  name: string;
  note: string;
  url?: (p: string) => string;
  home: string;
}[] = [
  {
    name: "Grok",
    note: "Prompt typed, press Send",
    url: (p) => `https://grok.com/?q=${encodeURIComponent(p)}`,
    home: "https://grok.com",
  },
  {
    name: "Kimi",
    // Its prefill link can't pick a model (only model=k2 or k1.5, which falls back to the default),
    // but the model menu remembers a choice, so one switch to Instant sticks.
    note: "Prompt typed, press Send. If it's busy, pick Instant in the model menu",
    url: (p) =>
      `https://www.kimi.ai/_prefill_chat?prefill_prompt=${encodeURIComponent(p)}&send_immediately=false`,
    home: "https://www.kimi.ai",
  },
  {
    name: "Muse",
    note: "Prompt copied: paste it",
    home: "https://muse.ai",
  },
];

type Step = {
  clip: string;
  text: React.ReactNode;
  action: { label: string; href?: string; copy?: string; copied?: string };
};

const Url = ({ children }: { children: string }) => (
  <span className="mt-1 block truncate rounded-lg bg-black/5 px-3 py-2 font-mono text-xs">
    {children}
  </span>
);

/** A developer row that opens in place: the essentials here, the full page one link away. */
const Fold = ({ title, note, children }: { title: string; note: string; children: React.ReactNode }) => (
  <details className="group rounded-xl border border-line bg-white hover:border-accent/70 open:border-accent/70">
    <summary className="flex cursor-pointer list-none items-start gap-2 p-3 [&::-webkit-details-marker]:hidden">
      <span className="min-w-0 flex-1">
        <span className="font-semibold">{title}</span>
        <span className="block text-xs text-muted">{note}</span>
      </span>
      <span aria-hidden="true" className="mt-0.5 text-muted transition-transform group-open:rotate-180">
        ▾
      </span>
    </summary>
    <div className="space-y-3 border-t border-line p-3 text-muted [&_strong]:text-foreground">{children}</div>
  </details>
);

const LinkButton = ({ href, primary, download, children }: { href: string; primary?: boolean; download?: boolean; children: React.ReactNode }) => (
  <a
    href={href}
    {...(download ? { download: true } : { target: "_blank", rel: "noopener noreferrer" })}
    className={`inline-block rounded-full px-4 py-2 text-xs font-semibold ${primary ? "bg-foreground text-background" : "border border-line text-foreground hover:border-accent/70"}`}
  >
    {children}
  </a>
);

/**
 * A connector's setup one step at a time: a short looping clip of the click, one line saying what
 * to do, and the one button that step needs (open the right settings page, or copy what to paste).
 * Clips live in public/connect, recorded in a real account; a clip shows once it has loaded, so a
 * step without one shows text only.
 */
function ConnectorSteps({
  title,
  note,
  steps,
}: {
  title: string;
  note: string;
  steps: Step[];
}) {
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(-1);
  const [ready, setReady] = useState<Record<string, boolean>>({});
  const step = steps[i];
  const shown = () =>
    !ready[step.clip] && setReady((r) => ({ ...r, [step.clip]: true }));
  const act = async () => {
    if (!step.action.copy) return;
    try {
      await navigator.clipboard.writeText(step.action.copy);
      setCopied(i);
      setTimeout(() => setCopied(-1), 2500);
    } catch {}
  };
  const label =
    copied === i && step.action.copied ? step.action.copied : step.action.label;
  const primary =
    "rounded-full border border-foreground bg-foreground px-4 py-1.5 text-background hover:opacity-90";
  const plain =
    "rounded-full border border-line px-3 py-1.5 disabled:opacity-40";

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-semibold">{title}</p>
        <p className="shrink-0 text-xs text-muted">
          Step {i + 1} of {steps.length}
        </p>
      </div>
      <p className="mt-1 text-xs text-muted">{note}</p>
      <video
        key={step.clip}
        src={step.clip}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={shown}
        // The page is server-rendered, so a clip can finish loading before React listens.
        ref={(v) => {
          if (v && v.readyState >= 2) shown();
        }}
        className={`mt-3 max-h-80 w-full rounded-lg border border-line bg-black object-contain ${ready[step.clip] ? "" : "hidden"}`}
      />
      <div className="mt-3">{step.text}</div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {step.action.href ? (
          <a
            href={step.action.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={act}
            className={primary}
          >
            {label}
          </a>
        ) : (
          <button onClick={act} className={primary}>
            {label}
          </button>
        )}
        <span className="flex-1" />
        <button
          disabled={i === 0}
          onClick={() => setI(i - 1)}
          className={plain}
        >
          Back
        </button>
        <button
          disabled={i === steps.length - 1}
          onClick={() => setI(i + 1)}
          className={plain}
        >
          Next
        </button>
      </div>
    </div>
  );
}

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
      return {
        edge: d.edge,
        at: d.at,
        ...(typeof d.w === "number" && { w: d.w }),
        ...(typeof d.h === "number" && { h: d.h }),
      };
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

/** This shop on a shop page (its title is the product name), else the gallery. */
const promptFor = (isShop: boolean, origin: string, path: string) =>
  isShop
    ? `Buy me ${document.title.split(" — ")[0]} from ${origin}${path}`
    : `Find me something interesting to buy from the OneThing gallery at ${origin}/gallery`;

/**
 * A "Test Panel" tab on the screen edge for judges and testers: buy through an AI assistant,
 * pay in the PayPal sandbox, find the agent endpoints, and watch the page's API calls. It shows in
 * test mode (on by default; the footer switch or ?test=0 turns it off), on every page but the admin ones.
 * Drag the grip to move it along an edge or to another one; « opens it. Its place is remembered
 * in this browser only.
 */
const noSubscribe = () => () => {};

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
  const [resizing, setResizing] = useState(false);
  const testMode = useTestMode();
  const testModeByHand = useTestModeExplicit();
  const logged = useSyncExternalStore(subscribeApiLog, () => apiCalls().length, () => 0);

  const first = path.split("/")[1] ?? "";
  const isShop = !!first && first !== "gallery" && !NOT_SHOPS.has(first) && path.split("/").length === 2;
  // Framed: the manage page's shop preview, which already sits beside this panel.
  const framed = useSyncExternalStore(noSubscribe, () => window.self !== window.top, () => false);
  // A buyer's pages (the shop, its buy and thanks pages, order status) stay clean unless test mode
  // was switched on by hand: someone buying wants the product and the receipt, not the API calls.
  const parts = path.split("/");
  const buyerPage = first === "o" || (isShop || (!!first && !NOT_SHOPS.has(first) && first !== "gallery" && parts.length === 3 && ["buy", "thanks"].includes(parts[2])));
  const hidden = !testMode || first === "admin" || framed || (buyerPage && !testModeByHand);

  // Opening writes a fresh prompt: this shop on a shop page (its title is the product name), else the
  // gallery. Kept short: the assistants that work find /llms.txt or the MCP tools themselves, and
  // pointing them at llms.txt didn't help the ones that don't.
  const toggle = () => {
    if (!open) setPrompt(promptFor(isShop, origin, path));
    setOpen(!open);
  };

  // ?test=1 (or ?test=0) on any link switches test mode, so a link can open the site ready to test.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("test");
    if (t === "1" || t === "on") setTestMode(true);
    if (t === "0" || t === "off") setTestMode(false);
  }, []);

  useEffect(() => {
    if (testMode) installApiLog();
  }, [testMode]);

  // The footer switch asks the panel to open once test mode is on.
  useEffect(() => {
    const show = () => {
      setPrompt(promptFor(isShop, origin, path));
      setOpen(true);
    };
    window.addEventListener(OPEN_PANEL, show);
    return () => window.removeEventListener(OPEN_PANEL, show);
  }, [isShop, origin, path]);

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

  const keep = (d: Dock) => {
    try {
      localStorage.setItem(STORE, JSON.stringify(d));
    } catch {}
  };

  const startDrag = (e: ReactPointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    setOpen(false);
    // Moving keeps the size the panel was given.
    const at = (ev: PointerEvent) => ({ ...dock, ...dockAt(ev.clientX, ev.clientY) });
    const move = (ev: PointerEvent) => setDock(at(ev));
    const up = (ev: PointerEvent) => {
      dragging.current = false;
      const d = at(ev);
      setDock(d);
      keep(d);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // The inner edge resizes: narrower, so the page beside it stays in view (the create flow
  // with its API log, say), or wider for reading.
  const startResize = (e: ReactPointerEvent) => {
    e.preventDefault();
    setResizing(true);
    const sized = (ev: PointerEvent): Dock => {
      const { innerWidth: vw, innerHeight: vh } = window;
      const clamp = (n: number, lo: number, hi: number) => Math.round(Math.min(hi, Math.max(lo, n)));
      return dock.edge === "right"
        ? { ...dock, w: clamp(vw - ev.clientX, MIN_W, vw) }
        : dock.edge === "left"
          ? { ...dock, w: clamp(ev.clientX, MIN_W, vw) }
          : dock.edge === "bottom"
            ? { ...dock, h: clamp(vh - ev.clientY, MIN_H, vh * 0.9) }
            : { ...dock, h: clamp(ev.clientY, MIN_H, vh * 0.9) };
    };
    const move = (ev: PointerEvent) => setDock(sized(ev));
    const up = (ev: PointerEvent) => {
      setResizing(false);
      const d = sized(ev);
      setDock(d);
      keep(d);
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
        width: `min(${dock.w ?? 560}px, 100vw)`,
        transform: open
          ? "none"
          : `translateX(${dock.edge === "right" ? "100%" : "-100%"})`,
      }
    : {
        left: 0,
        right: 0,
        [dock.edge]: 0,
        height: `min(${dock.h ?? 440}px, 90vh)`,
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
      className="fixed z-[60] flex flex-col bg-background font-sans text-foreground shadow-2xl transition-transform duration-300 ease-out"
      style={drawer}
      role="dialog"
      aria-label="Test panel"
    >
      {/* The resize handle: the drawer's inner edge, with a grip at its middle. */}
      <div
        onPointerDown={startResize}
        title="Drag to resize"
        aria-hidden="true"
        className={`group absolute z-10 flex touch-none items-center justify-center ${
          side ? "inset-y-0 w-2 cursor-col-resize" : "inset-x-0 h-2 cursor-row-resize"
        }`}
        style={{ [{ right: "left", left: "right", bottom: "top", top: "bottom" }[dock.edge]]: -4 }}
      >
        <span
          className={`rounded-full bg-line transition-colors group-hover:bg-accent ${resizing ? "bg-accent" : ""} ${
            side ? "h-12 w-1" : "h-1 w-12"
          }`}
        />
      </div>
      {resizing && (
        <div
          className={`fixed inset-0 z-[70] ${side ? "cursor-col-resize" : "cursor-row-resize"}`}
        />
      )}
      <div
        className={`absolute flex items-center gap-2 border-2 border-accent bg-background p-2 shadow-lg ${side ? "flex-col" : "flex-row"} ${tabRound}`}
        style={tab}
      >
        <button
          onClick={() => !dragging.current && toggle()}
          aria-label={open ? "Close test panel" : "Open test panel"}
          className="grid size-7 place-items-center rounded-md text-lg leading-none hover:bg-black/5"
          style={{ transform: `rotate(${turn}deg)` }}
        >
          «
        </button>
        <span className="grid size-8 place-items-center rounded-lg border border-accent font-mono text-xs text-accent">
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
          className={`grid cursor-grab touch-none grid-cols-3 gap-1 p-1.5 active:cursor-grabbing ${side ? "border-t border-line pt-2" : "border-l border-line pl-2"}`}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} className="size-1 rounded-full bg-foreground/70" />
          ))}
        </span>
      </div>

      {/* Closed, the drawer is off screen: keep its links out of the tab order. */}
      <div className="flex min-h-0 flex-1 flex-col" inert={!open}>
        <header className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="grid size-8 place-items-center rounded-lg border border-accent font-mono text-xs text-accent">
            &lt;/&gt;
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">OneThing</p>
            <p className="font-semibold">Test Panel</p>
          </div>
          <button
            onClick={() => setTestMode(false)}
            className="rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:text-foreground"
          >
            Leave test mode
          </button>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full border border-line hover:bg-black/5"
          >
            ✕
          </button>
        </header>
        <nav className="flex flex-wrap gap-1 border-b border-line px-4 py-2 text-sm">
          {(
            [
              ["ai", "Buy with AI"],
              ["sandbox", "Pay in sandbox"],
              ["dev", "For developers"],
              ["log", "API log"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`shrink-0 rounded-full px-4 py-1.5 ${section === id ? "border border-foreground bg-foreground text-background" : "text-muted hover:text-foreground"}`}
            >
              {label}
              {id === "log" && logged > 0 && (
                <span className="ml-1.5 rounded-full bg-accent px-1.5 text-[10px] font-semibold text-white">
                  {logged}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-accent/5 to-background p-5 text-sm">
          {section === "ai" && (
            <div className="space-y-4">
              <p className="inline-block rounded-full border border-accent/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
                Agentic checkout
              </p>
              <h2 className="text-2xl font-bold">Let an AI assistant buy it</h2>
              <p className="text-muted">
                Open an assistant with this prompt. It reads{" "}
                {isShop ? "this shop" : "the gallery"}, makes the order and
                hands back a PayPal link. You approve the payment; the assistant
                can&apos;t pay for you.
              </p>
              <div className="rounded-xl border border-line bg-white p-3">
                <label
                  htmlFor="tp-prompt"
                  className="text-[11px] uppercase tracking-wider text-muted"
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
                  className="text-xs text-accent hover:underline"
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
                    className="rounded-xl border border-line bg-white p-3 hover:border-accent/70"
                  >
                    <span className="font-semibold">{a.name} ↗</span>
                    <span className="block text-xs text-muted">{a.note}</span>
                  </a>
                ))}
              </div>
              <ConnectorSteps
                title="ChatGPT, with the OneThing connector"
                note="ChatGPT can't open our pages from its sandbox, so it shops through our MCP server and shows a product card.."
                steps={[
                  {
                    clip: "/connect/chatgpt-1.webm",
                    text: "Open ChatGPT's Plugins page, click Add, then Add custom MCP server.",
                    action: {
                      label: "Open Plugins ↗",
                      href: "https://chatgpt.com/plugins",
                    },
                  },
                  {
                    clip: "/connect/chatgpt-2.webm",
                    text: (
                      <>
                        Name it OneThing, paste the server URL, choose No
                        authentication, tick I understand and click Create as a
                        plugin: <Url>{mcp}</Url>
                      </>
                    ),
                    action: {
                      label: "Copy the server URL",
                      copy: mcp,
                      copied: "Copied: now paste it in ChatGPT",
                    },
                  },
                  {
                    clip: "/connect/chatgpt-3.webm",
                    text: "Ask for something in a new chat: OneThing shows its card with a PayPal button.",
                    action: {
                      label: "Open ChatGPT with the prompt ↗",
                      href: `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
                    },
                  },
                ]}
              />
              <ConnectorSteps
                title="Gemini, with the OneThing connector"
                note="Gemini shops through our MCP server as a custom app. Custom apps may need a paid Google AI plan."
                steps={[
                  {
                    clip: "/connect/gemini-1.webm",
                    text: "Open Gemini's Connected Apps (Customize → Connectors) and click + Custom.",
                    action: {
                      label: "Open Connected Apps ↗",
                      href: "https://gemini.google.com/customize/connectors",
                    },
                  },
                  {
                    clip: "/connect/gemini-2.webm",
                    text: (
                      <>
                        Paste the server URL and click Next, tick the box and
                        click Connect, then Connect again to save it:{" "}
                        <Url>{mcp}</Url>
                      </>
                    ),
                    action: {
                      label: "Copy the server URL",
                      copy: mcp,
                      copied: "Copied: now paste it in Gemini",
                    },
                  },
                  {
                    clip: "/connect/gemini-3.webm",
                    text: "Start your message with @OneThing so Gemini uses it. Gemini has no link that types a prompt, so this copies it.",
                    action: {
                      label: "Copy the prompt and open Gemini ↗",
                      href: "https://gemini.google.com/app",
                      copy: `@OneThing ${prompt}`,
                      copied: "Prompt copied: paste it in Gemini",
                    },
                  },
                ]}
              />
            </div>
          )}

          {section === "sandbox" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                Paying in the PayPal sandbox
              </h2>
              <p className="text-muted">
                Every shop here runs on PayPal&apos;s sandbox. No real money
                moves.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-foreground/80">
                <li>
                  <strong>Card:</strong> at PayPal choose{" "}
                  <em>Pay with Debit or Credit Card</em> and use a test card
                  from{" "}
                  <a
                    href="https://developer.paypal.com/tools/sandbox/card-testing/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline"
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

          {section === "log" && <ApiLog />}
          {section === "dev" && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">How agents shop here</h2>

              <Fold title="llms.txt" note="Instructions any assistant can read">
                <p>
                  A plain-text guide written for models. Assistants that read web
                  pages (Grok, Kimi) learn from it how to shop here, with no
                  plugin or key: every live gallery shop with its price and
                  order links, how to talk to the buyer, and how to check an
                  order. It&apos;s built live from the gallery.
                </p>
                <Url>{`${origin}/llms.txt`}</Url>
                <div className="flex flex-wrap gap-2">
                  <LinkButton href={`${origin}/llms.txt`} primary>
                    Open llms.txt ↗
                  </LinkButton>
                  <LinkButton href={`${origin}/llms.txt`} download>
                    Download
                  </LinkButton>
                  <LinkButton href={`${origin}/llms`}>Full page ↗</LinkButton>
                </div>
              </Fold>

              <Fold
                title="MCP server"
                note="Add it to ChatGPT, Gemini, Claude or an editor"
              >
                <Url>{mcp}</Url>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => copy(mcp, "mcp")}
                    className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
                  >
                    {copied === "mcp" ? "Copied" : "Copy the server URL"}
                  </button>
                  <span className="text-xs">
                    No authentication · Streamable HTTP · name it OneThing
                  </span>
                </div>
                <p>
                  <strong>ChatGPT and Gemini:</strong> step by step, with clips,
                  on{" "}
                  <button
                    onClick={() => setSection("ai")}
                    className="text-accent hover:underline"
                  >
                    Buy with AI
                  </button>
                  .
                </p>
                <p>
                  <strong>Claude:</strong> Settings → Connectors → Add custom
                  connector, and paste the URL. In Claude Code (click to copy):
                </p>
                <button
                  onClick={() =>
                    copy(`claude mcp add --transport http onething ${mcp}`, "cc")
                  }
                  className="block w-full truncate rounded-lg bg-black/5 px-3 py-2 text-left font-mono text-xs text-foreground hover:bg-black/10"
                >
                  {copied === "cc"
                    ? "Copied"
                    : `claude mcp add --transport http onething ${mcp}`}
                </button>
                <p>
                  <strong>Tools:</strong> search_shops, get_product and get_order
                  only read; create_order starts a PayPal checkout and charges
                  nothing.
                </p>
                <LinkButton href={`${origin}/mcp`}>
                  Full setup page, with Cursor and VS Code ↗
                </LinkButton>
              </Fold>

              {[
                ...(isShop
                  ? [
                      [
                        "Product JSON",
                        `${origin}/api/agent/shops${path}?view=json`,
                        "Price, options and the order links",
                      ],
                    ]
                  : []),
                [
                  "OpenAPI",
                  "https://omarmiri.github.io/one-thing/#/http/api-endpoints/agents/overview",
                  "The agent endpoints in the APIMatic portal; download the spec",
                  `${origin}/openapi.yaml`,
                  `${origin}/openapi.yaml`,
                ],
                [
                  "Docs and SDKs",
                  "https://omarmiri.github.io/one-thing/",
                  "Generated with APIMatic",
                ],
              ].map(([name, url, note, download, shown = url]) => (
                <div
                  key={name}
                  className="relative flex items-start gap-2 rounded-xl border border-line bg-white p-3 hover:border-accent/70"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1 after:absolute after:inset-0"
                  >
                    <span className="font-semibold">{name} ↗</span>
                    <span className="block text-xs text-muted">{note}</span>
                    <span className="block truncate font-mono text-xs text-muted">
                      {shown}
                    </span>
                  </a>
                  {download && (
                    <a
                      href={download}
                      download
                      title={`Download ${download.split("/").pop()}`}
                      aria-label={`Download ${download.split("/").pop()}`}
                      className="relative z-10 shrink-0 rounded-full border border-line p-2 text-muted hover:border-accent/70 hover:text-accent"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 3v12" />
                        <path d="m7 10 5 5 5-5" />
                        <path d="M5 21h14" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
