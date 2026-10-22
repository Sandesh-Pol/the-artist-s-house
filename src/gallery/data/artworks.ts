import art1 from "@/assets/art-1.jpg";
import art2 from "@/assets/art-2.jpg";
import art3 from "@/assets/art-3.jpg";
import art4 from "@/assets/art-4.jpg";

export interface Artwork {
  title: string;
  image: string;
  medium?: string;
  year?: string;
  description?: string;
  story?: string;
  w?: number; // frame width override (m)
  h?: number; // frame height override (m)
}

// Default artworks keyed by frame slot id (see rooms.ts). Uploads override these.
export const ARTWORKS: Record<string, Artwork> = {
  "foyer-w1": {
    title: "Afternoon in the Garden", image: art1, medium: "Oil on canvas", year: "2024",
    description: "A study of dappled summer light falling across skin and linen.",
    story: "Painted over three slow afternoons in my grandmother's garden. I wanted the heat to feel almost audible.",
  },
  "living-s1": {
    title: "Where the Cliffs Rest", image: art2, medium: "Acrylic, palette knife", year: "2023",
    description: "Coastal cliffs dissolving into dusk, built up in thick layers.",
    story: "I stood on that headland until the light was gone, then painted it from memory the same night.",
  },
  "studio-n2": {
    title: "Morning Ritual", image: art3, medium: "Graphite on paper", year: "2025",
    description: "A quiet observational drawing of hands and porcelain.",
    story: "My mother's hands, every morning, the same cup. Drawing them felt like keeping them.",
  },
  "bed-n1": {
    title: "Lemons & Peonies", image: art4, medium: "Watercolour", year: "2024",
    description: "A still life on the old dresser by the window.",
    story: "The peonies lasted four days. I painted them on the third, when they were most open.",
  },
};
