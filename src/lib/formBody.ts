/**
 * A request body as FormData. Also takes the same fields as JSON, with photos as base64 data URLs
 * (one, or an array for a repeated field): the browser's fallback when a network (corporate DLP,
 * proxies) blocks multipart file uploads. Only the named fields may carry files.
 */
export async function readForm(req: Request, fileFields: string[] = ["photo"]): Promise<FormData> {
  if (!req.headers.get("content-type")?.includes("application/json")) return req.formData();
  const json = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const form = new FormData();
  for (const [k, v] of Object.entries(json ?? {})) {
    for (const item of Array.isArray(v) ? v : [v]) {
      if (typeof item !== "string") continue;
      if (!fileFields.includes(k)) {
        form.append(k, item);
        continue;
      }
      const m = /^data:([\w.+-]+\/[\w.+-]+);base64,(.+)$/.exec(item);
      if (m) form.append(k, new File([Buffer.from(m[2], "base64")], k, { type: m[1] }));
    }
  }
  return form;
}
