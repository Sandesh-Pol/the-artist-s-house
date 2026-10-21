import { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import { ROOMS } from "../data/rooms";
import { useGallery, artworkFor } from "../store";
import type { Artwork } from "../data/artworks";

// Downscale uploads so they stay light in browser storage and on the GPU.
function readImage(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const max = 1600;
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL("image/jpeg", 0.88));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

const field = "w-full rounded-sm border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary";

export function EditDialog() {
  const { editing, uploads, edit, saveArtwork } = useGallery();
  const [form, setForm] = useState<Artwork>({ title: "", image: "" });

  useEffect(() => {
    if (editing) setForm(artworkFor(uploads, editing) ?? { title: "", image: "" });
  }, [editing]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!editing) return null;
  const room = ROOMS.find((r) => r.slots.some((s) => s.id === editing));
  const set = (k: keyof Artwork) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 animate-fade md:items-center" onClick={() => edit(null)}>
      <form
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-lg bg-background p-6 shadow-soft animate-rise md:rounded-lg"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.image || !form.title) return;
          saveArtwork(editing, form);
          edit(null);
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{room?.name}</p>
            <h2 className="font-display text-3xl">Hang an artwork</h2>
          </div>
          <button type="button" onClick={() => edit(null)} aria-label="Close"><X /></button>
        </div>
        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border bg-card p-4 text-sm text-muted-foreground hover:border-primary">
          {form.image ? <img src={form.image} alt="" className="max-h-48" /> : <Upload />}
          <span>{form.image ? "Replace image" : "Choose an image of the painting"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) setForm({ ...form, image: await readImage(f) });
            }}
          />
        </label>
        <div className="mt-4 grid gap-3">
          <input className={field} placeholder="Title *" value={form.title} onChange={set("title")} required />
          <div className="grid grid-cols-2 gap-3">
            <input className={field} placeholder="Medium" value={form.medium ?? ""} onChange={set("medium")} />
            <input className={field} placeholder="Year" value={form.year ?? ""} onChange={set("year")} />
          </div>
          <textarea className={field} rows={2} placeholder="Description" value={form.description ?? ""} onChange={set("description")} />
          <textarea className={field} rows={3} placeholder="The story behind it" value={form.story ?? ""} onChange={set("story")} />
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button type="submit" disabled={!form.image || !form.title} className="rounded-sm bg-primary px-5 py-2.5 text-sm text-primary-foreground transition hover:opacity-90 disabled:opacity-40">
            Hang it on the wall
          </button>
          {uploads[editing] && (
            <button type="button" onClick={() => { saveArtwork(editing, null); edit(null); }} className="text-sm text-muted-foreground underline">
              Remove
            </button>
          )}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Saved in this browser.</p>
      </form>
    </div>
  );
}
