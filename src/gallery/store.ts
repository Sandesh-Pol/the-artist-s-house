import { create } from "zustand";
import { get as idbGet, set as idbSet } from "idb-keyval";
import { ROOMS, ALL_SLOTS, HEADINGS, type Side, type FrameSlot } from "./data/rooms";
import { ARTWORKS, type Artwork } from "./data/artworks";

type Panel = "about" | "contact" | null;
export type CustomSlot = FrameSlot & { roomId: string };

interface GalleryState {
  entered: boolean;
  roomIndex: number;
  heading: number; // index into HEADINGS
  look: [number, number]; // drag yaw/pitch offsets
  selected: string | null;
  editing: string | null;
  addingFrame: boolean;
  curate: boolean;
  panel: Panel;
  theme: string;
  uploads: Record<string, Artwork>;
  customSlots: CustomSlot[];
  enter: () => void;
  goRoom: (i: number) => void;
  step: (d: number) => void;
  turn: (d: number) => void;
  face: (roomId: string, side: Side) => void;
  setLook: (l: [number, number]) => void;
  select: (id: string | null) => void;
  edit: (id: string | null) => void;
  setAddingFrame: (v: boolean) => void;
  setCurate: (v: boolean) => void;
  setPanel: (p: Panel) => void;
  setTheme: (id: string) => void;
  saveArtwork: (id: string, a: Artwork | null) => void;
  addSlot: (s: CustomSlot) => void;
  removeSlot: (id: string) => void;
  loadUploads: () => Promise<void>;
}

const KEY = "gallery-uploads-v1";
const PREFS_KEY = "gallery-prefs-v1";

interface Prefs {
  theme: string;
  customSlots: CustomSlot[];
}

export const useGallery = create<GalleryState>((set, get) => ({
  entered: false,
  roomIndex: 0,
  heading: 3,
  look: [0, 0],
  selected: null,
  editing: null,
  addingFrame: false,
  curate: false,
  panel: null,
  theme: "gallery-white",
  uploads: {},
  customSlots: [],
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
  setAddingFrame: (addingFrame) => set({ addingFrame }),
  setCurate: (curate) => set({ curate, addingFrame: false }),
  setPanel: (panel) => set({ panel }),
  setTheme: (theme) => {
    set({ theme });
    void idbSet(PREFS_KEY, { theme, customSlots: get().customSlots } satisfies Prefs);
  },
  saveArtwork: (id, a) => {
    const uploads = { ...get().uploads };
    if (a) uploads[id] = a;
    else delete uploads[id];
    set({ uploads });
    void idbSet(KEY, uploads);
  },
  addSlot: (s) => {
    const customSlots = [...get().customSlots, s];
    set({ customSlots });
    void idbSet(PREFS_KEY, { theme: get().theme, customSlots } satisfies Prefs);
  },
  removeSlot: (id) => {
    const customSlots = get().customSlots.filter((s) => s.id !== id);
    const uploads = { ...get().uploads };
    delete uploads[id];
    set({ customSlots, uploads, selected: null, editing: null });
    void idbSet(PREFS_KEY, { theme: get().theme, customSlots } satisfies Prefs);
    void idbSet(KEY, uploads);
  },
  loadUploads: async () => {
    const u = (await idbGet(KEY)) as Record<string, Artwork> | undefined;
    const p = (await idbGet(PREFS_KEY)) as Prefs | undefined;
    set({
      ...(u ? { uploads: u } : {}),
      ...(p?.theme ? { theme: p.theme } : {}),
      ...(p?.customSlots ? { customSlots: p.customSlots } : {}),
    });
  },
}));

export const artworkFor = (uploads: Record<string, Artwork>, id: string): Artwork | undefined =>
  uploads[id] ?? ARTWORKS[id];

export const slotFor = (customSlots: CustomSlot[], id: string) =>
  customSlots.find((s) => s.id === id) ?? ALL_SLOTS.find((s) => s.id === id);

export const filledSlots = (uploads: Record<string, Artwork>, customSlots: CustomSlot[] = []) =>
  [...ALL_SLOTS, ...customSlots].filter((s) => artworkFor(uploads, s.id));
