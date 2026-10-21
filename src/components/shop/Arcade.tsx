"use client";

import { useEffect, useRef, useState } from "react";
import type { ShowcaseView } from "@/lib/showcase";
import { createArcade, type Arcade as Game } from "./arcadeEngine";

// The arcade showcase: a short playable teaser made from the seller's own game art. The engine
// draws the game; this component owns the start and win screens and the score line.

type Phase = "loading" | "ready" | "playing" | "won" | "failed";

export function Arcade({ showcase }: { showcase: ShowcaseView }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const g = createArcade(canvas.current!, showcase, {
      onReady: () => setPhase("ready"),
      onFail: () => setPhase("failed"),
      onScore: setScore,
      onWin: () => setPhase("won"),
    });
    game.current = g;
    return () => g.destroy();
  }, [showcase]);

  // A showcase is a bonus: if its art won't load, the page simply goes without it.
  if (phase === "failed") return null;

  const play = () => {
    setPhase("playing");
    game.current?.start();
  };

  return (
    <section data-surface="panel" className="py-10" aria-label={showcase.title}>
      <div className="shop-card relative overflow-hidden p-0" style={{ padding: 0 }}>
        <canvas
          ref={canvas}
          tabIndex={0}
          aria-label={`${showcase.title}. ${showcase.instructions} Arrow keys move, space attacks.`}
          className="block aspect-video w-full outline-none"
          style={{ touchAction: phase === "playing" ? "none" : "auto", cursor: phase === "playing" ? "crosshair" : "default" }}
        />

        {phase === "playing" && (
          <p
            aria-live="polite"
            className="pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-semibold"
            style={{ background: "color-mix(in srgb, black 55%, transparent)", color: "white" }}
          >
            {score} / {showcase.goal} {showcase.pastVerb}
          </p>
        )}

        {phase !== "playing" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
            style={{ background: "color-mix(in srgb, black 45%, transparent)", color: "white" }}
          >
            <h2 className="shop-heading text-2xl sm:text-4xl">{phase === "won" ? showcase.winTitle : showcase.title}</h2>
            <p className="max-w-md text-sm sm:text-lg opacity-90">{phase === "won" ? showcase.winText : showcase.instructions}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <button type="button" className="shop-buy" onClick={play} disabled={phase === "loading"}>
                {phase === "loading" ? "Loading…" : phase === "won" ? "Play again" : "Play"}
              </button>
              {phase === "won" && (
                <a href="#buy" className="shop-buy" style={{ background: "transparent", color: "white", boxShadow: "inset 0 0 0 2px white" }}>
                  Get the game
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
