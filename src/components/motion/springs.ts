// Springs for the motion layer. A feel is a brand's way of moving: stiffness and damping per
// unit mass. Both are tuned to settle without wobble; motion should feel weighted, not toy-like.

export const FEELS = ["calm", "crisp"] as const;
export type Feel = (typeof FEELS)[number];

export const SPRING: Record<Feel, { k: number; c: number }> = {
  calm: { k: 70, c: 16.7 }, // critically damped: unhurried, never overshoots
  crisp: { k: 210, c: 26 }, // quicker, the faintest settle
};

/** One value chasing a target. step() integrates in small slices so long frames stay stable. */
export class Spring {
  v = 0;
  target: number;
  constructor(public x: number) {
    this.target = x;
  }
  step(dt: number, { k, c }: { k: number; c: number }) {
    const n = Math.ceil(dt / 0.004);
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      this.v += (k * (this.target - this.x) - c * this.v) * h;
      this.x += this.v * h;
    }
    return this.x;
  }
  snap(x: number) {
    this.x = this.target = x;
    this.v = 0;
  }
  get settled() {
    return Math.abs(this.target - this.x) < 0.01 && Math.abs(this.v) < 0.01;
  }
}

export const prefersReducedMotion = () =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
