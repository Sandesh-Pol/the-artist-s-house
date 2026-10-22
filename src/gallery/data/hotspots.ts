// Clickable interactive objects scattered through the house.
// Add one by appending here; the 3D prop and the info card both read from this list.
export type HotspotKind = "vase" | "plant" | "lamp" | "books" | "tea" | "vinyl";

export interface Hotspot {
  id: string;
  roomId: string;
  kind: HotspotKind;
  pos: [number, number, number]; // room-local
  rotY?: number;
  title: string;
  text: string;
}

export const HOTSPOTS: Hotspot[] = [
  {
    id: "foyer-vase",
    roomId: "foyer",
    kind: "vase",
    pos: [-3.6, 0.49, 0],
    title: "The Welcome Vase",
    text: "Fresh flowers are placed here for every visitor. In the artist's home, the entrance always smelled of eucalyptus and rain.",
  },
  {
    id: "foyer-plant",
    roomId: "foyer",
    kind: "plant",
    pos: [3.8, 0, -3.8],
    title: "Old Fig Tree",
    text: "This plant is older than most of the paintings in the house. It has survived three moves and one very curious cat.",
  },
  {
    id: "living-sofa",
    roomId: "living",
    kind: "books",
    pos: [0, 0.41, 0.4],
    title: "Coffee Table Books",
    text: "A rotating stack of sketchbooks and exhibition catalogues. Guests are encouraged to flip through them — carefully.",
  },
  {
    id: "living-lamp",
    roomId: "living",
    kind: "lamp",
    pos: [4, 0, 3.6],
    title: "Reading Corner",
    text: "The warm pool of light where evening sketches begin. Most ideas in this house started right here, with tea going cold nearby.",
  },
  {
    id: "studio-tea",
    roomId: "studio",
    kind: "tea",
    pos: [-3, 0.49, 3],
    title: "Painter's Tea Set",
    text: "Brushes soak in the left cup, tea in the right. Mixing them up exactly once is a rite of passage in this studio.",
  },
  {
    id: "studio-vinyl",
    roomId: "studio",
    kind: "vinyl",
    pos: [3.8, 0, 3.4],
    rotY: -0.6,
    title: "Studio Record Player",
    text: "Painting sessions run on jazz and old film scores. The record collection is strictly alphabetical, the painting never is.",
  },
  {
    id: "corridor-plant",
    roomId: "corridor",
    kind: "plant",
    pos: [0, 0, 3.6],
    title: "Corridor Fern",
    text: "It gets the least light in the house and grows the fastest. The artist insists it's a metaphor.",
  },
  {
    id: "bedroom-books",
    roomId: "bedroom",
    kind: "books",
    pos: [-1.6, 0.63, 2.8],
    title: "Bedside Stack",
    text: "Half-read novels, a dream journal, and one poetry collection held together with a ribbon. The Quiet Room keeps its secrets.",
  },
];

export const hotspotFor = (id: string | null) => HOTSPOTS.find((h) => h.id === id);
