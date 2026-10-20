import QRCode from "qrcode";

/** Desktop only: scan to open this shop on a phone and pay there (PayPal app or mobile web). */
export async function PayOnPhone({ url }: { url: string }) {
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#111111", light: "#ffffff" },
  });
  return (
    <div className="mt-2 hidden max-w-sm items-center gap-4 rounded-xl p-3 md:flex" style={{ background: "color-mix(in srgb, var(--surface) 70%, var(--text) 4%)" }}>
      <div
        className="size-24 shrink-0 rounded-lg bg-white p-2"
        role="img"
        aria-label={`QR code for ${url}`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="text-sm">
        <p className="font-semibold">Rather pay on your phone?</p>
        <p style={{ color: "var(--muted)" }}>Scan with your camera to open this page and check out with PayPal there.</p>
      </div>
    </div>
  );
}
