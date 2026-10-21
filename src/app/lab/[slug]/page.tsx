import { notFound } from "next/navigation";
import { MotionLab } from "@/components/motion/MotionLab";
import { FEELS, type Feel } from "@/components/motion/springs";
import { ShopBuy } from "@/components/shop/ShopBuy";
import { ShopPage } from "@/components/shop/ShopPage";
import { tokensMatch } from "@/lib/ids";
import { getShopBySlug, shopView } from "@/lib/shops";

// Motion lab: any shop rendered through the experimental motion layer, to compare with the
// plain page. Same visibility rules as the shop: live shops for anyone, drafts with the token.

export const dynamic = "force-dynamic";

export default async function Lab(props: PageProps<"/lab/[slug]">) {
  const { slug } = await props.params;
  const q = await props.searchParams;
  const shop = await getShopBySlug(slug);
  const token = typeof q.token === "string" ? q.token : null;
  const isOwner = shop && token && tokensMatch(token, shop.admin_token);
  if (!shop || (shop.status !== "live" && !isOwner)) notFound();

  const feel: Feel = FEELS.includes(q.feel as Feel) ? (q.feel as Feel) : "calm";
  const enabled = q.motion !== "0";
  const base = `/lab/${shop.slug}${token ? `?token=${encodeURIComponent(token)}` : ""}`;

  return (
    <MotionLab feel={feel} enabled={enabled} base={base}>
      <ShopPage
        view={shopView(shop)}
        buy={<ShopBuy shop={shop} />}
        motion={enabled ? { feel } : undefined}
      />
    </MotionLab>
  );
}
