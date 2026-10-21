import { BuyButton } from "@/components/shop/BuyButton";
import { paypalEnabled, sdkUrl } from "@/lib/paypal";
import type { Shop } from "@/lib/shops";

/** The checkout button a shop page shows: PayPal once live, a disabled stand-in for a draft. */
export function ShopBuy({ shop }: { shop: Shop }) {
  return shop.status === "live" ? (
    <BuyButton
      slug={shop.slug}
      enabled={paypalEnabled()}
      sdkUrl={sdkUrl()}
      label={shop.spec.ctaLabel}
      options={shop.product_type === "physical" ? (shop.options ?? []).map((o) => o.name) : []}
    />
  ) : (
    <button className="shop-buy" disabled>{shop.spec.ctaLabel}</button>
  );
}
