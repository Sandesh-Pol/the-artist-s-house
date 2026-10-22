// Interior themes. wall: null keeps each room's own wallTone from rooms.ts.
export interface Theme {
  id: string;
  name: string;
  wall: string | null;
  trim: string;
  ceiling: string;
  sky: string; // canvas background & fog
  swatch: [string, string, string];
}

export const THEMES: Theme[] = [
  {
    id: "gallery-white",
    name: "Gallery White",
    wall: "#f5f3ee",
    trim: "#fbfaf6",
    ceiling: "#fbfaf6",
    sky: "#eef0f1",
    swatch: ["#f5f3ee", "#fbfaf6", "#c9c2b4"],
  },
  {
    id: "warm-plaster",
    name: "Warm Plaster",
    wall: null,
    trim: "#f3eee5",
    ceiling: "#f7f3ec",
    sky: "#e9e1d3",
    swatch: ["#ece4d6", "#e6dccb", "#8a6a48"],
  },
  {
    id: "soft-sage",
    name: "Soft Sage",
    wall: "#e8ece3",
    trim: "#f5f7f2",
    ceiling: "#f6f7f3",
    sky: "#e5eae5",
    swatch: ["#e8ece3", "#9db08f", "#f5f7f2"],
  },
  {
    id: "evening",
    name: "Evening Charcoal",
    wall: "#45423d",
    trim: "#5a564f",
    ceiling: "#38352f",
    sky: "#2c2a26",
    swatch: ["#45423d", "#5a564f", "#c9b48a"],
  },
];

export const themeById = (id: string): Theme => THEMES.find((t) => t.id === id) ?? THEMES[0]!;
