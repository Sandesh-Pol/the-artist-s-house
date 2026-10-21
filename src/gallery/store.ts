import { create } from "zustand";
import { get as idbGet, set as idbSet } from "idb-keyval";
import { ROOMS, ALL_SLOTS, HEADINGS, type Side } from "./data/rooms";
import { ARTWORKS, type Artwork } from "./data/artworks";

type Panel = "about" | "contact" | null;

interface GalleryState {
  entered: boolean;
  roomIndex: number;
  heading: number; // index into HEADINGS
  look: [number, number]; // drag yaw/pitch offsets
  selected: string | null;
  editing: string | null;
  curate: boolean;
  panel: Panel;
  uploads: Record<string, Artwork>;
  enter: () => void;
  goRoom: (i: number) => void;
  step: (d: number) => void;
  turn: (d: number) => void;
  face: (roomId: string, side: Side) => void;
  setLook: (l: [number, number]) => void;
  select: (id: string | null) => void;
  edit: (id: string | null) => void;
  setCurate: (v: boolean) => void;
  setPanel: (p: Panel) => void;
  saveArtwork: (id: string, a: Artwork | null) => void;
  loadUploads: () => Promise<void>;
}

const KEY = "gallery-uploads-v1";

export const useGallery = create<GalleryState>((set, get) => ({
  entered: false,
  roomIndex: 0,
  heading: 3,
  look: [0, 0],
  selected: null,
  editing: null,
  curate: false,
  panel: null,
  uploads: {},
  enter: () => set({ entered: true }),
  goRoom: (i) => {
    const roomIndex = Math.max(0, Math.min(ROOMS.length - 1, i));
    set({ roomIndex, heading: HEADINGS.indexOf(ROOMS[roomIndex]!.view), look: [0, 0] });
  },
  step: (d) => get().goRoom(get().roomIndex + d),
  turn: (d) => set({ heading: (get().heading + d + 4) % 4, look: [0, 0] }),
  face: (roomId, side) =>
    set({ roomIndex: ROOMS.findIndex((r) => r.id === roomId), heading: HEADINGS.indexOf(side), look: [0, 0] }),
  setLook: (look) => set({ look }),
  select: (selected) => set({ selected }),
  edit: (editing) => set({ editing }),
  setCurate: (curate) => set({ curate }),
  setPanel: (panel) => set({ panel }),
  saveArtwork: (id, a) => {
    const uploads = { ...get().uploads };
    if (a) uploads[id] = a;
    else delete uploads[id];
    set({ uploads });
    void idbSet(KEY, uploads);
  },
  loadUploads: async () => {
    const u = (await idbGet(KEY)) as Record<string, Artwork> | undefined;
    if (u) set({ uploads: u });
  },
}));

export const artworkFor = (uploads: Record<string, Artwork>, id: string): Artwork | undefined =>
  uploads[id] ?? ARTWORKS[id];

export const filledSlots = (uploads: Record<string, Artwork>) =>
  ALL_SLOTS.filter((s) => artworkFor(uploads, s.id));
