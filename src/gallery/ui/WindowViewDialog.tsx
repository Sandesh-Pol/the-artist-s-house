import { useState } from "react";
import { X, Upload } from "lucide-react";
import { useGallery } from "../store";

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
      res(c.toDataURL("image/jpeg", 0.85));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

export function WindowViewDialog() {
  const { windowView, setWindowView } = useGallery();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="rounded-full p-1.5 transition hover:text-primary"
        onClick={() => setOpen(true)}
        aria-label="Change the view outside the windows"
        title="Window view"
      >
        <Upload size={15} className="hidden" />
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 animate-fade md:items-center" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded-t-lg bg-background p-6 shadow-soft animate-rise md:rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Windows</p>
                <h2 className="font-display text-3xl">The view outside</h2>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close"><X /></button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Hang your own photo beyond the glass — a garden, the sea, a city skyline. It appears behind every window in the house.
            </p>
            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border bg-card p-4 text-sm text-muted-foreground hover:border-primary">
              {windowView ? <img src={windowView} alt="Current window view" className="max-h-48 rounded-sm" /> : <Upload />}
              <span>{windowView ? "Replace the view" : "Choose a photo for the view"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) setWindowView(await readImage(f));
                }}
              />
            </label>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-sm bg-primary px-5 py-2.5 text-sm text-primary-foreground transition hover:opacity-90"
              >
                Done
              </button>
              {windowView && (
                <button onClick={() => setWindowView("")} className="text-sm text-muted-foreground underline">
                  Back to plain daylight
                </button>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Saved in this browser.</p>
          </div>
        </div>
      )}
    </>
  );
}
