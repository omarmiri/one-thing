"use client";

import { useRef, useState } from "react";

// More photos, added while refining: the shop starts from one snapshot, and the seller adds the
// other angles here. Buyers swipe through them on the shop page. The first photo is the cover.

export type Photo = { id: string; url: string };
type Api = (path: string, init?: RequestInit) => Promise<{ photos: Photo[] }>;

const MAX = 8;

export function PhotosPanel(props: { api: Api; initial: Photo[]; onChanged(photos: Photo[]): void; onToast(t: string): void }) {
  const [photos, setPhotos] = useState(props.initial);
  const [busy, setBusy] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  async function run(call: () => Promise<{ photos: Photo[] }>, done?: string) {
    setBusy(true);
    try {
      const next = (await call()).photos;
      setPhotos(next);
      props.onChanged(next);
      if (done) props.onToast(done);
    } catch (e) {
      props.onToast((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const add = (files: FileList) => {
    const body = new FormData();
    for (const f of files) body.append("photo", f);
    return run(() => props.api("/photos", { method: "POST", body }), files.length > 1 ? `Added ${files.length} photos` : "Photo added");
  };
  const order = (ids: string[], done?: string) =>
    run(() => props.api("/photos", { method: "PUT", body: JSON.stringify({ photos: ids }) }), done);
  const move = (i: number, by: number) => {
    const ids = photos.map((p) => p.id);
    [ids[i], ids[i + by]] = [ids[i + by], ids[i]];
    return order(ids);
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold">Photos</h2>
        <span className="text-xs text-muted">{photos.length} / {MAX}</span>
      </div>
      <p className="mt-1 text-sm text-muted">Add other angles and details. Buyers swipe through them; the first is the cover.</p>

      <ul className="mt-3 grid grid-cols-3 gap-2" aria-busy={busy}>
        {photos.map((p, i) => (
          <li key={p.id} className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element -- the seller's own upload */}
            <img src={p.url} alt={`Photo ${i + 1}`} className="size-full object-cover" />
            {i === 0 && (
              <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">Cover</span>
            )}
            <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1">
              <button
                type="button"
                disabled={busy || i === 0}
                onClick={() => move(i, -1)}
                aria-label={`Move photo ${i + 1} earlier`}
                className="rounded bg-white/90 px-1.5 text-xs shadow disabled:invisible"
              >
                ←
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  if (photos.length > 1 || confirm("Remove the only photo?")) order(photos.filter((x) => x.id !== p.id).map((x) => x.id), "Photo removed");
                }}
                aria-label={`Remove photo ${i + 1}`}
                className="rounded bg-white/90 px-1.5 text-xs shadow"
              >
                ✕
              </button>
              <button
                type="button"
                disabled={busy || i === photos.length - 1}
                onClick={() => move(i, 1)}
                aria-label={`Move photo ${i + 1} later`}
                className="rounded bg-white/90 px-1.5 text-xs shadow disabled:invisible"
              >
                →
              </button>
            </div>
          </li>
        ))}
        {photos.length < MAX && (
          <li>
            <button
              type="button"
              disabled={busy}
              onClick={() => picker.current?.click()}
              className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line text-sm text-muted hover:border-accent hover:text-accent disabled:opacity-50"
            >
              <span aria-hidden className="text-2xl leading-none">+</span>
              {busy ? "Uploading…" : "Add photos"}
            </button>
          </li>
        )}
      </ul>
      {/* On a phone, this offers the camera as well as the library. */}
      <input
        ref={picker}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) add(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
