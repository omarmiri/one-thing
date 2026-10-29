/**
 * /<shop>/buy: the Order link at a path without /api in it, because Meta AI's browsing refused
 * /api/agent/... URLs. Same handler, same crawler and rate-limit guards.
 */
export { GET } from "@/app/api/agent/shops/[slug]/order/route";
