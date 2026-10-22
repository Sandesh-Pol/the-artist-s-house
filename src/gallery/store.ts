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
  lightsOn: boolean;
  curtainsOpen: boolean;
  hotspot: string | null;
  help: boolean;
  windowView: string;
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
  toggleLights: () => void;
  toggleCurtains: () => void;
  setHotspot: (id: string | null) => void;
  setHelp: (v: boolean) => void;
  setWindowView: (dataUrl: string) => void;
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
  lightsOn: boolean;
  curtainsOpen: boolean;
}

const savePrefs = (s: Pick<GalleryState, "theme" | "customSlots" | "lightsOn" | "curtainsOpen">) =>
  void idbSet(PREFS_KEY, {
    theme: s.theme,
    customSlots: s.customSlots,
    lightsOn: s.lightsOn,
    curtainsOpen: s.curtainsOpen,
  } satisfies Prefs);

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
  lightsOn: true,
  curtainsOpen: true,
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
    savePrefs(get());
  },
  toggleLights: () => {
    set({ lightsOn: !get().lightsOn });
    savePrefs(get());
  },
  toggleCurtains: () => {
    set({ curtainsOpen: !get().curtainsOpen });
    savePrefs(get());
  },
  saveArtwork: (id, a) => {
    const uploads = { ...get().uploads };
    if (a) uploads[id] = a;
    else delete uploads[id];
    set({ uploads });
    void idbSet(KEY, uploads);
  },
  addSlot: (s) => {
    set({ customSlots: [...get().customSlots, s] });
    savePrefs(get());
  },
  removeSlot: (id) => {
    const customSlots = get().customSlots.filter((s) => s.id !== id);
    const uploads = { ...get().uploads };
    delete uploads[id];
    set({ customSlots, uploads, selected: null, editing: null });
    savePrefs(get());
    void idbSet(KEY, uploads);
  },
  loadUploads: async () => {
    const u = (await idbGet(KEY)) as Record<string, Artwork> | undefined;
    const p = (await idbGet(PREFS_KEY)) as Prefs | undefined;
    set({
      ...(u ? { uploads: u } : {}),
      ...(p?.theme ? { theme: p.theme } : {}),
      ...(p?.customSlots ? { customSlots: p.customSlots } : {}),
      ...(p?.lightsOn !== undefined ? { lightsOn: p.lightsOn } : {}),
      ...(p?.curtainsOpen !== undefined ? { curtainsOpen: p.curtainsOpen } : {}),
    });
  },
}));

export const artworkFor = (uploads: Record<string, Artwork>, id: string): Artwork | undefined =>
  uploads[id] ?? ARTWORKS[id];

export const slotFor = (customSlots: CustomSlot[], id: string) =>
  customSlots.find((s) => s.id === id) ?? ALL_SLOTS.find((s) => s.id === id);

export const filledSlots = (uploads: Record<string, Artwork>, customSlots: CustomSlot[] = []) =>
  [...ALL_SLOTS, ...customSlots].filter((s) => artworkFor(uploads, s.id));
