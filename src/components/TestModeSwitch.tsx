"use client";

import { setTestMode, useTestMode } from "@/lib/testMode";

/** The footer switch that shows the Test Panel. Takes its colour from the text around it. */
export function TestModeSwitch() {
  const on = useTestMode();
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
