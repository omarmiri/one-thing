import type { ReactNode } from "react";

// A section of the manage page that folds away once it's done, so the settings column stays short.
// A plain <details>: what's inside stays mounted (and in the setup form) while it's closed.

const summary = "flex cursor-pointer list-none items-baseline gap-2 [&::-webkit-details-marker]:hidden";
const chevron = <span aria-hidden className="ml-auto text-xs text-muted transition-transform group-open:rotate-180">▾</span>;

/** A whole panel: Photos, Design with Gemini, A/B test. */
export function FoldPanel(props: { title: string; note?: ReactNode; open: boolean; dashed?: boolean; children: ReactNode }) {
  return (
    <details open={props.open} className={`group rounded-2xl border border-line bg-white p-5 ${props.dashed ? "border-dashed" : ""}`}>
      <summary className={summary}>
        <h2 className="font-semibold">{props.title}</h2>
        {props.note && <span className="text-xs text-muted">{props.note}</span>}
        {chevron}
      </summary>
      <div className="mt-1">{props.children}</div>
    </details>
  );
}

/** A group inside the settings form, folded only when `fold` is set (a live shop). */
export function FoldGroup(props: { fold: boolean; label: string; note?: ReactNode; children: ReactNode }) {
  if (!props.fold) return <>{props.children}</>;
  return (
    <details className="group border-t border-line pt-4">
      <summary className={summary}>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">{props.label}</span>
        {props.note && <span className="text-xs text-muted">{props.note}</span>}
        {chevron}
      </summary>
      <div className="mt-3">{props.children}</div>
    </details>
  );
}

/** On a form: open the folded group holding a field the browser says is invalid, so it can be focused. */
export const openInvalid = (e: React.FormEvent) => (e.target as HTMLElement).closest("details")?.setAttribute("open", "");
