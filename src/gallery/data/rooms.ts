// House layout. Add a room by appending to ROOMS; add a frame by adding a slot.
export type Side = "n" | "e" | "s" | "w";
export const CELL = 10; // room footprint (m)
export const STOREY = 4.5; // floor-to-floor height (m)

export interface Door { side: Side; bottom?: number } // bottom = opening height above room floor
export interface FrameSlot { id: string; side: Side; u: number; y?: number; w: number; h: number }
export interface Room {
  id: string;
  name: string;
  subtitle: string;
  floor: number;
  gx: number;
  gz: number;
  height: number;
  eye?: number; // camera height above room floor
  doors: Door[];
  windows: Side[];
  wallTone: string;
  slots: FrameSlot[];
  stairs?: boolean;
  view: Side; // default facing direction on arrival
}

export const ROOMS: Room[] = [
  {
    id: "foyer", view: "w", name: "Entrance Hall", subtitle: "Where every visit begins",
    floor: 0, gx: 0, gz: 0, height: STOREY,
    doors: [{ side: "e" }, { side: "s" }], windows: ["n"], wallTone: "#ece4d6",
    slots: [
      { id: "foyer-w1", side: "w", u: -2, w: 1.4, h: 1.8 },
      { id: "foyer-w2", side: "w", u: 2, w: 1.4, h: 1.8 },
      { id: "foyer-e1", side: "e", u: -3, w: 1.1, h: 1.4 },
    ],
  },
  {
    id: "living", view: "s", name: "Living Room", subtitle: "Light, warmth & large canvases",
    floor: 0, gx: 1, gz: 0, height: STOREY,
    doors: [{ side: "w" }, { side: "e" }], windows: ["n"], wallTone: "#e6dccb",
    slots: [
      { id: "living-s1", side: "s", u: 0, w: 2.6, h: 2 },
      { id: "living-e1", side: "e", u: -3, w: 1.2, h: 1.5 },
      { id: "living-e2", side: "e", u: 3, w: 1.2, h: 1.5 },
      { id: "living-w1", side: "w", u: 3, w: 1.3, h: 1.6 },
    ],
  },
  {
    id: "studio", view: "n", name: "Studio", subtitle: "Sketches, studies & works in progress",
    floor: 0, gx: 2, gz: 0, height: STOREY,
    doors: [{ side: "w" }], windows: ["e"], wallTone: "#f1ece2",
    slots: [
      { id: "studio-n1", side: "n", u: -2.4, w: 1.2, h: 1.5 },
      { id: "studio-n2", side: "n", u: 0, w: 1.2, h: 1.5 },
      { id: "studio-n3", side: "n", u: 2.4, w: 1.2, h: 1.5 },
      { id: "studio-s1", side: "s", u: 0, w: 2, h: 1.6 },
    ],
  },
  {
    id: "stair", view: "w", name: "Stair Hall", subtitle: "A double-height gallery",
    floor: 0, gx: 0, gz: 1, height: STOREY * 2, eye: 3.2, stairs: true,
    doors: [{ side: "n" }, { side: "e", bottom: STOREY }], windows: ["s"], wallTone: "#e9e1d3",
    slots: [
      { id: "stair-w1", side: "w", u: 1, y: 5.6, w: 1.8, h: 2.2 },
      { id: "stair-e1", side: "e", u: 0, y: 1.9, w: 2.4, h: 1.8 },
    ],
  },
  {
    id: "corridor", view: "n", name: "Upper Corridor", subtitle: "Small works, close up",
    floor: 1, gx: 1, gz: 1, height: STOREY,
    doors: [{ side: "w" }, { side: "e" }], windows: [], wallTone: "#efe8dc",
    slots: [
      { id: "cor-n1", side: "n", u: -3, w: 1, h: 1.3 },
      { id: "cor-n2", side: "n", u: 0, w: 1, h: 1.3 },
      { id: "cor-n3", side: "n", u: 3, w: 1, h: 1.3 },
      { id: "cor-s1", side: "s", u: -2, w: 1.4, h: 1.1 },
      { id: "cor-s2", side: "s", u: 2, w: 1.4, h: 1.1 },
    ],
  },
  {
    id: "bedroom", view: "n", name: "Quiet Room", subtitle: "Personal pieces & stories",
    floor: 1, gx: 2, gz: 1, height: STOREY,
    doors: [{ side: "w" }], windows: ["s"], wallTone: "#e3d8c6",
    slots: [
      { id: "bed-n1", side: "n", u: 0, w: 2.2, h: 1.7 },
      { id: "bed-e1", side: "e", u: -2, w: 1.3, h: 1.6 },
      { id: "bed-e2", side: "e", u: 2, w: 1.3, h: 1.6 },
    ],
  },
];

export const roomCenter = (r: Room) => [r.gx * CELL, r.floor * STOREY, r.gz * CELL] as const;
export const ALL_SLOTS = ROOMS.flatMap((r) => r.slots.map((s) => ({ ...s, roomId: r.id })));
export const HEADINGS: Side[] = ["n", "e", "s", "w"];
export const DIR: Record<Side, [number, number]> = { n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] };
