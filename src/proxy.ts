import { NextResponse, type NextRequest } from "next/server";

// The API docs portal (APIMatic, on GitHub Pages) calls the API from the browser for its
// "Try it" buttons. Only that origin gets CORS here; every other request passes through as is.
const DOCS_ORIGIN = "https://omarmiri.github.io";

const CORS = {
  "access-control-allow-origin": DOCS_ORIGIN,
  "access-control-allow-methods": "GET, POST, PATCH, OPTIONS",
  "access-control-allow-headers": "content-type, x-admin-token",
  "access-control-max-age": "86400",
  vary: "origin",
};

export function proxy(req: NextRequest) {
  if (req.headers.get("origin") !== DOCS_ORIGIN) return NextResponse.next();
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  return NextResponse.next({ headers: CORS });
}

export const config = { matcher: "/api/:path*" };
