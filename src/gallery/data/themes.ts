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
    name: "Clean White",
    wall: "#f5f3ee",
    trim: "#fbfaf6",
    ceiling: "#fbfaf6",
    sky: "#eef0f1",
    swatch: ["#f5f3ee", "#fbfaf6", "#c9c2b4"],
  },
  {
    id: "evening",
    name: "Evening Light",
    wall: "#45423d",
    trim: "#5a564f",
    ceiling: "#38352f",
    sky: "#2c2a26",
    swatch: ["#45423d", "#5a564f", "#c9b48a"],
  },
];

export const themeById = (id: string): Theme => THEMES.find((t) => t.id === id) ?? THEMES[0]!;
