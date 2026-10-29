"use client";

import { useState } from "react";

/** Copies `text`, and says so for a couple of seconds. */
export function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        });
      }}
      className={`shrink-0 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold hover:border-accent/70 ${className}`}
    >
      {done ? "Copied" : label}
    </button>
  );
}
