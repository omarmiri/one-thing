// Some networks (corporate DLP, proxies) drop file uploads, or answer them with a block page.
// When that happens the browser sends photos again as base64 data URLs in a JSON body, which
// the upload routes also accept (see formBody.ts).

/** Our server never answered: no network, a timeout, or something else's page instead of ours. */
export class Unreachable extends Error {
  constructor() {
    super("We couldn't reach OneThing. Check your connection and try again.");
  }
}

/** The photo as a JPEG data URL, at most 2048 px across. */
export async function photoDataUrl(f: File): Promise<string> {
  try {
    const img = await createImageBitmap(f, { imageOrientation: "from-image" });
    const scale = Math.min(1, 2048 / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.88);
  } catch {
    // A format the browser can't draw: send it as it is.
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(f);
    });
  }
}
