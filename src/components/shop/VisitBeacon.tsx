"use client";

import { useEffect } from "react";

/** Counts this page view (src/lib/stats.ts). Rendered only on live shops, never in the seller's preview. */
export function VisitBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const body = JSON.stringify({ ref: document.referrer });
    const url = `/api/shops/${encodeURIComponent(slug)}/visit`;
    // sendBeacon survives the tab closing; fetch is the fallback where it's missing or refused.
    if (!navigator.sendBeacon?.(url, new Blob([body], { type: "application/json" }))) {
      fetch(url, { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
    }
  }, [slug]);
  return null;
}
