"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { createMotion, type Motion } from "./engine";
import { attachInspect } from "./inspect";
import type { Feel } from "./springs";

// Puts a server-rendered shop page under the motion layer: the engine moves its surfaces and
// Inspect opens its product photos. Content is in the HTML either way; until the engine starts,
// surfaces wait unseen (globals.css), and without JavaScript the noscript rule shows them.

export function MotionRoot({
  children,
  feel,
  enabled = true,
  motionRef,
}: {
  children: ReactNode;
  feel: Feel;
  enabled?: boolean;
  motionRef?: RefObject<Motion | null>; // for the lab's Replay
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const m = createMotion(root.current!, feel);
    const detach = attachInspect(root.current!, () => feel);
    if (motionRef) motionRef.current = m;
    return () => {
      detach();
      m.destroy();
    };
  }, [enabled, feel, motionRef]);

  return (
    <div ref={root} data-motion={enabled ? "pending" : undefined}>
      {enabled && (
        <noscript>
          <style>{`[data-motion] [data-surface] { opacity: 1 !important; }`}</style>
        </noscript>
      )}
      {children}
    </div>
  );
}
