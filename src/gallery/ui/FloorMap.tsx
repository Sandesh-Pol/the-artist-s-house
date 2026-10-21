import { HEADINGS, ROOMS } from "../data/rooms";
import { useGallery } from "../store";

const C = 26; // px per cell
const ARROW: Record<string, number> = { n: 0, e: 90, s: 180, w: 270 };

export function FloorMap() {
  const { roomIndex, heading, goRoom } = useGallery();
  const floors = [...new Set(ROOMS.map((r) => r.floor))];
  return (
    <div className="glass pointer-events-auto rounded-md p-3 animate-fade" aria-label="Floor map">
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>Floor plan</span>
        <span className="text-primary">{ROOMS[roomIndex].name}</span>
      </div>
      <div className="flex gap-3">
        {floors.map((f) => (
          <div key={f}>
            <svg width={C * 3 + 4} height={C * 2 + 4} className="block">
              {ROOMS.filter((r) => r.floor === f || (r.stairs && f === 1)).map((r) => {
                const i = ROOMS.indexOf(r);
                const active = i === roomIndex && (r.floor === f || r.stairs);
                return (
                  <g key={r.id} onClick={() => goRoom(i)} className="cursor-pointer">
                    <title>{r.name}</title>
                    <rect
                      x={2 + r.gx * C}
                      y={2 + r.gz * C}
                      width={C - 2}
                      height={C - 2}
                      rx={2}
                      className={
                        active
                          ? "fill-primary stroke-primary"
                          : "fill-card stroke-border transition-colors hover:fill-accent"
                      }
                      strokeWidth={1}
                    />
                    {r.stairs &&
                      [0, 1, 2, 3].map((k) => (
                        <line key={k} x1={5 + r.gx * C} x2={11 + r.gx * C} y1={8 + r.gz * C + k * 4} y2={8 + r.gz * C + k * 4} className={active ? "stroke-primary-foreground" : "stroke-muted-foreground"} strokeWidth={0.8} />
                      ))}
                    {active && (
                      <g transform={`translate(${2 + r.gx * C + (C - 2) / 2} ${2 + r.gz * C + (C - 2) / 2}) rotate(${ARROW[HEADINGS[heading]]})`}>
                        <path d="M0 -7 L5 4 L0 1.5 L-5 4 Z" className="fill-primary-foreground" />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="mt-1 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {f === 0 ? "Ground" : "Upper"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
