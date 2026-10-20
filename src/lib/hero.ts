import "server-only";
import { heroImage } from "./gemini";
import { getBlob, saveBlob, updateShop, type Shop } from "./shops";

/** Generates hero art in the background; the manage page polls hero_status. */
export async function generateHero(shop: Pick<Shop, "id" | "spec" | "photo_blob">) {
  try {
    const photo = shop.photo_blob ? await getBlob(shop.photo_blob) : null;
    const img = await heroImage(shop.spec, photo ? { data: photo.data, mime: photo.mime } : undefined);
    if (!img) {
      await updateShop(shop.id, { hero_status: "failed" });
      return;
    }
    const blob = await saveBlob(img.data, img.mime, "hero");
    await updateShop(shop.id, { hero_blob: blob, hero_status: "ready" });
  } catch (err) {
    console.error("hero image failed:", err);
    await updateShop(shop.id, { hero_status: "failed" });
  }
}
