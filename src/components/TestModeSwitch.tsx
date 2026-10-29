"use client";

import { setTestMode, useTestMode, useTestModeExplicit } from "@/lib/testMode";

/**
 * The footer switch that shows the Test Panel. Takes its colour from the text around it. On a
 * buyer's page (`byHand`) it reads on only when switched on by hand, since that's when the panel shows there.
 */
export function TestModeSwitch({ byHand = false }: { byHand?: boolean }) {
  const testMode = useTestMode();
  const explicit = useTestModeExplicit();
  const on = byHand ? explicit : testMode;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setTestMode(!on)}
      className="inline-flex items-center gap-2 align-middle hover:opacity-80"
    >
      <span className={`relative inline-block h-4 w-7 rounded-full border border-current ${on ? "bg-current" : ""}`}>
        <span
          className={`absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full transition-all ${on ? "left-[14px] bg-white" : "left-[2px] bg-current"}`}
        />
      </span>
      Test mode
    </button>
  );
}
