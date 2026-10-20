import { permanentRedirect } from "next/navigation";

// Shops used to live at /s/<name>. Links in the wild (and the first game build) still point
// there, so send them to /<name>, keeping the rest of the path and the query.
export default async function OldShopLink(props: PageProps<"/s/[slug]/[[...rest]]">) {
  const { slug, rest } = await props.params;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(await props.searchParams)) {
    for (const one of Array.isArray(v) ? v : v === undefined ? [] : [v]) q.append(k, one);
  }
  const path = [slug, ...(rest ?? [])].map(encodeURIComponent).join("/");
  permanentRedirect(`/${path}${q.size ? `?${q}` : ""}`);
}
