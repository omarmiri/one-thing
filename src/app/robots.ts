import type { MetadataRoute } from "next";
import { PREFETCHERS } from "@/lib/stats";

/**
 * Keeps crawlers and link previewers off the URLs that place orders (GET order links, for agents
 * that can only fetch) and the pay links. The rest of the site stays open to everyone. No `*`
 * rule: assistants fetching for a buyer honour robots.txt too, and ordering is their job.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: PREFETCHERS, allow: "/", disallow: ["/api/agent/shops/*/order", "/*/buy", "/o/"] },
      { userAgent: "*", allow: "/" },
    ],
  };
}
