import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Pencil } from "lucide-react";
import { ROOMS } from "../data/rooms";
import { useGallery, artworkFor, filledSlots } from "../store";

export function ArtworkModal() {
  const { selected, uploads, select, edit, face } = useGallery();
  const list = filledSlots(uploads);
  const idx = list.findIndex((s) => s.id === selected);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") select(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      e.stopImmediatePropagation();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  });

  if (!selected || idx < 0) return null;
  const slot = list[idx];
  const art = artworkFor(uploads, slot.id)!;
  const room = ROOMS.find((r) => r.id === slot.roomId)!;

  function go(d: number) {
    const n = list[(idx + d + list.length) % list.length];
    face(n.roomId, n.side);
    select(n.id);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 animate-fade md:p-10" onClick={() => select(null)}>
      <div
        key={slot.id}
        className="grid max-h-full w-full max-w-6xl gap-6 overflow-y-auto md:grid-cols-[1.4fr_1fr] md:gap-10 animate-zoom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center">
          <img src={art.image} alt={art.title} className="max-h-[60vh] w-auto bg-card p-3 shadow-soft md:max-h-[82vh] md:p-5" />
        </div>
        <div className="flex flex-col justify-center text-ink-foreground animate-rise">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-foreground/60">{room.name}</p>
          <h2 className="mt-3 font-display text-4xl leading-tight md:text-6xl">{art.title}</h2>
          <p className="mt-2 text-sm italic text-ink-foreground/70">
            {[art.medium, art.year].filter(Boolean).join(" · ")}
          </p>
          {art.description && <p className="mt-6 leading-relaxed text-ink-foreground/90">{art.description}</p>}
          {art.story && (
            <blockquote className="mt-6 border-l border-primary pl-4 font-display text-xl italic leading-snug text-ink-foreground/85">
              {art.story}
            </blockquote>
          )}
          <div className="mt-8 flex items-center gap-2">
            <button onClick={() => go(-1)} className="rounded-full border border-ink-foreground/30 p-3 transition hover:bg-ink-foreground/10" aria-label="Previous artwork"><ChevronLeft size={18} /></button>
            <button onClick={() => go(1)} className="rounded-full border border-ink-foreground/30 p-3 transition hover:bg-ink-foreground/10" aria-label="Next artwork"><ChevronRight size={18} /></button>
            <span className="ml-2 text-xs tracking-widest text-ink-foreground/60">{idx + 1} / {list.length}</span>
            <button onClick={() => { select(null); edit(slot.id); }} className="ml-auto flex items-center gap-2 text-xs uppercase tracking-widest text-ink-foreground/60 hover:text-ink-foreground"><Pencil size={14} /> Edit</button>
          </div>
        </div>
      </div>
      <button onClick={() => select(null)} className="absolute right-4 top-4 rounded-full p-2 text-ink-foreground/80 hover:text-ink-foreground" aria-label="Close"><X /></button>
    </div>
  );
}
