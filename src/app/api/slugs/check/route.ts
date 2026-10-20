import { NextResponse } from "next/server";
import { slugProblem, slugTaken, toSlug } from "@/lib/slugs";

/** GET ?name=Raptor Rush → { slug: "raptor-rush", available, problem? } for the live check in forms. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = toSlug(url.searchParams.get("name") ?? "");
  const except = url.searchParams.get("shop") ?? undefined; // a shop checking its own current name
  const problem = slugProblem(slug) ?? ((await slugTaken(slug, except)) ? "Taken. Try another name." : null);
  return NextResponse.json({ slug, available: !problem, ...(problem && { problem }) });
}
