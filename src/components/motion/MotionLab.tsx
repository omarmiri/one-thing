"use client";

import { useRef, type ReactNode } from "react";
import type { Motion } from "./engine";
import { MotionRoot } from "./MotionRoot";
import { FEELS, type Feel } from "./springs";

// Lab only: a shop page under the motion layer, with a small toolbar to compare it against the
// plain page and between feels.

export function MotionLab({ children, feel, enabled, base }: { children: ReactNode; feel: Feel; enabled: boolean; base: string }) {
  const motion = useRef<Motion | null>(null);
  const href = (q: Record<string, string>) => `${base}${base.includes("?") ? "&" : "?"}${new URLSearchParams(q)}`;
  const pill = (on: boolean) => `rounded-lg px-2.5 py-1 capitalize ${on ? "bg-white text-black" : "hover:bg-white/15"}`;

  return (
    <>
      <MotionRoot feel={feel} enabled={enabled} motionRef={motion}>
        {children}
      </MotionRoot>
      <div className="fixed right-3 top-3 z-50 flex items-center gap-1 rounded-xl bg-black/75 p-1 text-xs text-white shadow-xl backdrop-blur">
        <a className={pill(!enabled)} href={href({ motion: "0" })}>Static</a>
        {FEELS.map((f) => (
          <a key={f} className={pill(enabled && f === feel)} href={href({ feel: f })}>
            {f}
          </a>
        ))}
        {enabled && (
          <button
            type="button"
            className="rounded-lg px-2.5 py-1 hover:bg-white/15"
            onClick={() => {
              scrollTo({ top: 0 });
              motion.current?.replay();
            }}
          >
            Replay
          </button>
        )}
      </div>
    </>
  );
}
