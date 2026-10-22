import { useState } from "react";
import { X } from "lucide-react";
import { ROOMS, HEADINGS, type Side } from "../data/rooms";
import { useGallery } from "../store";

const field = "w-full rounded-sm border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary";
const SIDE_LABEL: Record<Side, string> = { n: "North wall", e: "East wall", s: "South wall", w: "West wall" };

function Slider({ label, value, min, max, step = 0.05, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <label className="block text-xs text-muted-foreground">
      <span className="flex justify-between">
        <span>{label}</span>
        <span>{value.toFixed(2)} m</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full accent-primary" />
    </label>
  );
}

export function AddFrameDialog() {
  const { addingFrame, setAddingFrame, addSlot, edit, roomIndex } = useGallery();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [side, setSide] = useState<Side>("n");
  const [u, setU] = useState(0);
  const [y, setY] = useState(1.75);
  const [w, setW] = useState(1.4);
  const [h, setH] = useState(1.8);

  if (!addingFrame) return null;
  const room = ROOMS.find((r) => r.id === (roomId ?? ROOMS[roomIndex]!.id))!;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 animate-fade md:items-center" onClick={() => setAddingFrame(false)}>
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-lg bg-background p-6 shadow-soft animate-rise md:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Curator mode</p>
            <h2 className="font-display text-3xl">Add a new frame</h2>
          </div>
          <button onClick={() => setAddingFrame(false)} aria-label="Close"><X /></button>
        </div>
        <div className="mt-5 grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-muted-foreground">
              Room
              <select className={`${field} mt-1`} value={room.id} onChange={(e) => setRoomId(e.target.value)}>
                {ROOMS.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              Wall
              <select className={`${field} mt-1`} value={side} onChange={(e) => setSide(e.target.value as Side)}>
                {HEADINGS.map((s) => (
                  <option key={s} value={s}>{SIDE_LABEL[s]}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-3 rounded-sm border border-border bg-card p-3">
            <Slider label="Position along wall" value={u} min={-3.6} max={3.6} onChange={setU} />
            <Slider label="Height on wall" value={y} min={1.1} max={Math.max(2.6, room.height - 1.4)} onChange={setY} />
            <div className="grid grid-cols-2 gap-3">
              <Slider label="Frame width" value={w} min={0.6} max={3.2} onChange={setW} />
              <Slider label="Frame height" value={h} min={0.6} max={3.2} onChange={setH} />
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button
            className="rounded-sm bg-primary px-5 py-2.5 text-sm text-primary-foreground transition hover:opacity-90"
            onClick={() => {
              const id = `custom-${Date.now()}`;
              addSlot({ id, roomId: room.id, side, u, y, w, h });
              setAddingFrame(false);
              edit(id);
            }}
          >
            Place frame & hang art
          </button>
          <p className="text-xs text-muted-foreground">You can move or remove it later.</p>
        </div>
      </div>
    </div>
  );
}
