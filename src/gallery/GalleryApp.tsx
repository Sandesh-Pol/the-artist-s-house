import { useEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Palette, Plus, Lightbulb, Blinds, Map as MapIcon, CircleHelp, LockKeyhole, Delete } from "lucide-react";
import { House } from "./three/House";
import { dragState } from "./three/dragState";
import { ROOMS } from "./data/rooms";
import { THEMES } from "./data/themes";
import { ARTIST } from "./data/artist";
import { useGallery } from "./store";
import { FloorMap } from "./ui/FloorMap";
import { ArtworkModal } from "./ui/ArtworkModal";
import { EditDialog } from "./ui/EditDialog";
import { AddFrameDialog } from "./ui/AddFrameDialog";
import { InfoPanel } from "./ui/InfoPanel";
import { HotspotCard } from "./ui/HotspotCard";
import { HelpDialog } from "./ui/HelpDialog";

const blocked = () => {
  const s = useGallery.getState();
  return !s.entered || !!s.selected || !!s.editing || !!s.panel || s.help || !!s.hotspot;
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
      if (!start || blocked()) {
        start = null;
        return;
      }
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
  const btn = "glass-lite grid size-11 place-items-center rounded-full text-foreground transition hover:text-primary disabled:opacity-30";
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
  const r = ROOMS[roomIndex]!;
  return (
    <div key={r.id} className="animate-rise">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {String(roomIndex + 1).padStart(2, "0")} / {String(ROOMS.length).padStart(2, "0")} · {r.floor ? "Upper floor" : "Ground floor"}
      </p>
      <h2 className="font-display text-3xl leading-none md:text-5xl">{r.name}</h2>
      <p className="mt-1 hidden text-sm italic text-muted-foreground sm:block">{r.subtitle}</p>
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

const ENTRY_PIN = "1625";

function EntryLock({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const submit = (value: string) => {
    const next = value.slice(0, 4);
    setPin(next);
    setError(false);
    if (next.length !== 4) return;
    if (next === ENTRY_PIN) {
      onUnlock();
      return;
    }
    setPin("");
    setError(true);
  };

  const press = (digit: string) => submit(`${pin}${digit}`);
  const remove = () => submit(pin.slice(0, -1));

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink/80 p-6 text-center animate-fade">
      <div className="w-full max-w-xs rounded-lg bg-background/95 p-6 shadow-soft animate-rise">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-primary">
          <LockKeyhole size={22} />
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Private residence</p>
        <h1 className="mt-2 font-display text-3xl">Enter the house</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter the four-digit passcode to unlock the gallery.</p>
        <form className="mt-5" onSubmit={(event) => { event.preventDefault(); submit(pin); }}>
          <input
            autoFocus
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={pin}
            onChange={(event) => submit(event.target.value.replace(/\D/g, ""))}
            aria-label="Four-digit passcode"
            className="sr-only"
          />
          <div className="mb-4 flex justify-center gap-3" aria-label={`${pin.length} of 4 digits entered`}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`size-3 rounded-full border border-primary ${i < pin.length ? "bg-primary" : "bg-transparent"}`} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
              <button key={digit} type="button" onClick={() => press(digit)} className="glass-lite grid h-11 place-items-center rounded-md text-lg transition hover:text-primary">
                {digit}
              </button>
            ))}
            <span />
            <button type="button" onClick={() => press("0")} className="glass-lite grid h-11 place-items-center rounded-md text-lg transition hover:text-primary">0</button>
            <button type="button" onClick={remove} aria-label="Delete last digit" className="glass-lite grid h-11 place-items-center rounded-md transition hover:text-primary">
              <Delete size={18} />
            </button>
          </div>
          <p className={`mt-4 h-4 text-xs text-destructive ${error ? "opacity-100" : "opacity-0"}`} role="alert">Incorrect passcode</p>
        </form>
      </div>
    </div>
  );
}

function HomeControls() {
  const { lightsOn, curtainsOpen, toggleLights, toggleCurtains } = useGallery();
  const btn = "rounded-full p-1.5 transition hover:text-primary";
  return (
    <>
      <button
        className={`${btn} ${lightsOn ? "text-primary" : "text-muted-foreground"}`}
        onClick={toggleLights}
        aria-label={lightsOn ? "Turn lights off" : "Turn lights on"}
        title={lightsOn ? "Lights on" : "Lights off"}
      >
        <Lightbulb size={15} />
      </button>
      <button
        className={`${btn} ${curtainsOpen ? "text-primary" : "text-muted-foreground"}`}
        onClick={toggleCurtains}
        aria-label={curtainsOpen ? "Close curtains" : "Open curtains"}
        title={curtainsOpen ? "Curtains open" : "Curtains closed"}
      >
        <Blinds size={15} />
      </button>
    </>
  );
}

function ThemePicker() {
  const { theme, setTheme } = useGallery();
  const nextTheme = THEMES.find((t) => t.id !== theme) ?? THEMES[0]!;
  return (
    <button
      className={`rounded-full p-1.5 transition hover:text-primary ${theme === "evening" ? "text-primary" : ""}`}
      onClick={() => setTheme(nextTheme.id)}
      aria-label={`Switch to ${nextTheme.name}`}
      title={`Switch to ${nextTheme.name}`}
    >
      <Palette size={15} />
    </button>
  );
}

function FloatingControls() {
  return (
    <div className="glass pointer-events-auto absolute right-4 top-20 z-20 flex flex-col items-center gap-1 rounded-full p-1 animate-fade md:right-6 md:top-24">
      <HomeControls />
      <ThemePicker />
      <button
        className="rounded-full p-1.5 transition hover:text-primary"
        onClick={() => useGallery.getState().setHelp(true)}
        aria-label="How to explore"
        title="Visitor guide"
      >
        <CircleHelp size={15} />
      </button>
    </div>
  );
}

export function GalleryApp() {
  const ref = useRef<HTMLDivElement>(null);
  const { entered, curate, setCurate, setPanel, setAddingFrame, loadUploads } = useGallery();
  const [unlocked, setUnlocked] = useState(false);
  const [showMap, setShowMap] = useState(false);
  useControls(ref);
  useEffect(() => {
    void loadUploads();
  }, [loadUploads]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground">
      <div ref={ref} className="absolute inset-0 touch-none">
        <House />
      </div>
      {!unlocked && <EntryLock onUnlock={() => setUnlocked(true)} />}
      {unlocked && !entered && <Intro />}
      {unlocked && entered && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6">
          <header className="pointer-events-auto flex items-center justify-between gap-3 animate-fade">
            <span className="whitespace-nowrap font-display text-lg tracking-wide md:text-2xl">{ARTIST.name}</span>
            <nav className="glass flex items-center gap-1 rounded-full px-1 py-1 text-[10px] uppercase tracking-[0.15em] md:px-2 md:text-xs">
              <button className="rounded-full px-3 py-1.5 hover:text-primary" onClick={() => setPanel("about")}>About</button>
              <button className="rounded-full px-3 py-1.5 hover:text-primary" onClick={() => setPanel("contact")}>Contact</button>
              <a className="rounded-full px-3 py-1.5 hover:text-primary" href={ARTIST.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <button
                className="rounded-full px-3 py-1.5 transition hover:text-primary"
                onClick={() => useGallery.getState().goRoom(0)}
                aria-label="Return to entrance"
                title="Return to entrance"
              >
                Home
              </button>
              <button
                className={`rounded-full px-3 py-1.5 transition ${curate ? "bg-primary text-primary-foreground" : "hover:text-primary"}`}
                onClick={() => setCurate(!curate)}
              >
                {curate ? "Done" : "Curate"}
              </button>
            </nav>
          </header>
          <FloatingControls />
          <div className="flex flex-col gap-3">
            <RoomTitle />
            <div className="flex items-end justify-between gap-3">
              <NavPad />
              <div className="flex flex-col items-end gap-2">
                <button
                  className="glass-lite pointer-events-auto grid size-11 place-items-center rounded-full text-foreground transition hover:text-primary"
                  onClick={() => setShowMap(!showMap)}
                  aria-label={showMap ? "Hide floor plan" : "Show floor plan"}
                  title={showMap ? "Hide floor plan" : "Show floor plan"}
                >
                  <MapIcon size={17} />
                </button>
                {showMap && <FloorMap />}
              </div>
            </div>
          </div>
        </div>
      )}
      {curate && entered && (
        <div className="absolute left-1/2 top-20 z-20 flex -translate-x-1/2 items-center gap-2 animate-rise">
          <p className="glass pointer-events-none rounded-full px-4 py-2 text-xs">
            Curator mode — tap any frame to hang or edit a painting
          </p>
          <button
            className="glass pointer-events-auto flex items-center gap-1.5 rounded-full px-4 py-2 text-xs text-primary transition hover:opacity-80"
            onClick={() => setAddingFrame(true)}
          >
            <Plus size={14} /> New frame
          </button>
        </div>
      )}
      <ArtworkModal />
      <EditDialog />
      <AddFrameDialog />
      <InfoPanel />
      <HotspotCard />
      <HelpDialog />
    </div>
  );
}
