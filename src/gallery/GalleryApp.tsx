import { useEffect, useRef } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { House } from "./three/House";
import { dragState } from "./three/dragState";
import { ROOMS } from "./data/rooms";
import { ARTIST } from "./data/artist";
import { useGallery } from "./store";
import { FloorMap } from "./ui/FloorMap";
import { ArtworkModal } from "./ui/ArtworkModal";
import { EditDialog } from "./ui/EditDialog";
import { InfoPanel } from "./ui/InfoPanel";

const blocked = () => {
  const s = useGallery.getState();
  return !s.entered || !!s.selected || !!s.editing || !!s.panel;
};

function useControls(el: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (blocked()) return;
      const s = useGallery.getState();
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") s.step(1);
      else if (k === "arrowdown" || k === "s") s.step(-1);
      else if (k === "arrowleft" || k === "a") s.turn(-1);
      else if (k === "arrowright" || k === "d") s.turn(1);
      else return;
      e.preventDefault();
    };
    let acc = 0;
    let last = 0;
    const onWheel = (e: WheelEvent) => {
      if (blocked()) return;
      acc += e.deltaY;
      const now = performance.now();
      if (Math.abs(acc) > 60 && now - last > 1100) {
        useGallery.getState().step(acc > 0 ? 1 : -1);
        last = now;
        acc = 0;
      }
    };
    const node = el.current!;
    let start: { x: number; y: number; t: number; look: [number, number] } | null = null;
    const down = (e: PointerEvent) => {
      dragState.moved = false;
      start = { x: e.clientX, y: e.clientY, t: performance.now(), look: useGallery.getState().look };
    };
    const move = (e: PointerEvent) => {
      if (!start || blocked()) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.hypot(dx, dy) > 6) dragState.moved = true;
      if (dragState.moved) {
        const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
        useGallery.getState().setLook([clamp(start.look[0] + dx * 0.004, 1), clamp(start.look[1] + dy * 0.003, 0.4)]);
      }
    };
    const up = (e: PointerEvent) => {
      if (!start || blocked()) return (start = null);
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const fast = performance.now() - start.t < 320;
      const s = useGallery.getState();
      if (fast && e.pointerType === "touch") {
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) s.turn(dx < 0 ? 1 : -1);
        else if (Math.abs(dy) > 50) s.step(dy < 0 ? 1 : -1);
      }
      start = null;
      setTimeout(() => (dragState.moved = false), 0);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    node.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      node.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [el]);
}

function NavPad() {
  const { step, turn, roomIndex } = useGallery();
  const btn = "glass grid size-11 place-items-center rounded-full text-foreground transition hover:text-primary disabled:opacity-30";
  return (
    <div className="pointer-events-auto grid grid-cols-3 gap-1.5">
      <span />
      <button className={btn} onClick={() => step(1)} disabled={roomIndex === ROOMS.length - 1} aria-label="Next room"><ChevronUp size={18} /></button>
      <span />
      <button className={btn} onClick={() => turn(-1)} aria-label="Turn left"><ChevronLeft size={18} /></button>
      <button className={btn} onClick={() => step(-1)} disabled={roomIndex === 0} aria-label="Previous room"><ChevronDown size={18} /></button>
      <button className={btn} onClick={() => turn(1)} aria-label="Turn right"><ChevronRight size={18} /></button>
    </div>
  );
}

function RoomTitle() {
  const roomIndex = useGallery((s) => s.roomIndex);
  const r = ROOMS[roomIndex];
  return (
    <div key={r.id} className="animate-rise">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {String(roomIndex + 1).padStart(2, "0")} / {String(ROOMS.length).padStart(2, "0")} · {r.floor ? "Upper floor" : "Ground floor"}
      </p>
      <h2 className="font-display text-3xl leading-none md:text-5xl">{r.name}</h2>
      <p className="mt-1 text-sm italic text-muted-foreground">{r.subtitle}</p>
    </div>
  );
}

function Intro() {
  const enter = useGallery((s) => s.enter);
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-b from-background/70 via-background/40 to-background/80 p-6 text-center animate-fade">
      <div className="max-w-xl">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground animate-rise">Welcome to the home of</p>
        <h1 className="mt-4 font-display text-6xl leading-[0.9] md:text-8xl animate-rise [animation-delay:150ms]">{ARTIST.name}</h1>
        <p className="mx-auto mt-6 max-w-md font-display text-xl italic text-muted-foreground animate-rise [animation-delay:300ms]">{ARTIST.intro}</p>
        <button onClick={enter} className="mt-10 rounded-sm bg-ink px-8 py-3.5 text-sm uppercase tracking-[0.25em] text-ink-foreground shadow-soft transition hover:bg-primary animate-rise [animation-delay:450ms]">
          Step inside
        </button>
        <p className="mt-6 text-xs text-muted-foreground animate-rise [animation-delay:600ms]">Scroll or use arrows to walk · drag to look · tap a painting</p>
      </div>
    </div>
  );
}

export function GalleryApp() {
  const ref = useRef<HTMLDivElement>(null);
  const { entered, curate, setCurate, setPanel, loadUploads } = useGallery();
  useControls(ref);
  useEffect(() => {
    void loadUploads();
  }, [loadUploads]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      <div ref={ref} className="absolute inset-0 touch-none">
        <House />
      </div>
      {!entered && <Intro />}
      {entered && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6">
          <header className="pointer-events-auto flex items-center justify-between gap-3 animate-fade">
            <span className="font-display text-xl tracking-wide md:text-2xl">{ARTIST.name}</span>
            <nav className="glass flex items-center gap-1 rounded-full px-2 py-1 text-xs uppercase tracking-[0.18em]">
              <button className="rounded-full px-3 py-1.5 hover:text-primary" onClick={() => setPanel("about")}>About</button>
              <button className="rounded-full px-3 py-1.5 hover:text-primary" onClick={() => setPanel("contact")}>Contact</button>
              <a className="rounded-full p-1.5 hover:text-primary" href={ARTIST.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={15} /></a>
              <button
                className={`rounded-full px-3 py-1.5 transition ${curate ? "bg-primary text-primary-foreground" : "hover:text-primary"}`}
                onClick={() => setCurate(!curate)}
              >
                {curate ? "Done" : "Curate"}
              </button>
            </nav>
          </header>
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col gap-4">
              <RoomTitle />
              <NavPad />
            </div>
            <div className="hidden sm:block"><FloorMap /></div>
          </div>
          <div className="absolute bottom-4 right-4 sm:hidden"><FloorMap /></div>
        </div>
      )}
      {curate && entered && (
        <p className="glass pointer-events-none absolute left-1/2 top-20 z-20 -translate-x-1/2 rounded-full px-4 py-2 text-xs animate-rise">
          Curator mode — tap any frame to hang or edit a painting
        </p>
      )}
      <ArtworkModal />
      <EditDialog />
      <InfoPanel />
    </div>
  );
}
