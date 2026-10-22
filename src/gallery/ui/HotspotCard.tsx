import { X } from "lucide-react";
import { hotspotFor } from "../data/hotspots";
import { ROOMS } from "../data/rooms";
import { useGallery } from "../store";

export function HotspotCard() {
  const { hotspot, setHotspot } = useGallery();
  const h = hotspotFor(hotspot);
  if (!h) return null;
  const room = ROOMS.find((r) => r.id === h.roomId);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex justify-center px-4 md:bottom-28">
      <div className="glass pointer-events-auto relative w-full max-w-sm rounded-md p-5 animate-rise">
        <button
          className="absolute right-3 top-3 text-muted-foreground transition hover:text-foreground"
          onClick={() => setHotspot(null)}
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{room?.name}</p>
        <h3 className="mt-1 font-display text-2xl">{h.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.text}</p>
      </div>
    </div>
  );
}
