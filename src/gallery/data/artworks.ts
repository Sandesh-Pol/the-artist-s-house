import art3 from "@/assets/1.jpeg";
import art6 from "@/assets/2.jpeg";
import art1 from "@/assets/3.jpeg";
import art5 from "@/assets/4.jpeg";
import art4 from "@/assets/5.jpeg";
import art2 from "@/assets/6.jpeg";
import art7 from "@/assets/7.jpeg";
import art8 from "@/assets/8.jpeg";
import art9 from "@/assets/9.jpeg";
import { ALL_SLOTS } from "./rooms";

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

// Edit this ordered list to change the artwork sequence. Entries after the list stay empty.
export const ARTWORK_SEQUENCE: Artwork[] = [
  { 
    title: "Pink Flamingos", 
    image: art1, 
    medium: "Mixed media", 
    year: "2026", 
    description: "A textured artwork depicting a family of vibrant pink flamingos with distinct black beaks and legs.", 
    story: "Capturing the elegance and bonding of flamingos in a tactile format." 
  },
  { 
    title: "Heart Sanctuary", 
    image: art2, 
    medium: "Acrylic on paper", 
    year: "2026", 
    description: "A delicate green leafy vine stretching across the frame, suspending a small house with a glowing red heart window.", 
    story: "Symbolizing home, warmth, and the growth of love in nature." 
  },
  { 
    title: "Mandala Sunflowers", 
    image: art3, 
    medium: "Pen and ink on paper", 
    year: "2026", 
    description: "An intricate black-and-white ink drawing combining a mandala design with sunflower petals against a dark background.", 
    story: "Exploring patterns of nature and symmetry through detailed penwork." 
  },
  { 
    title: "Celestial Spiral", 
    image: art4, 
    medium: "Watercolor and acrylic", 
    year: "2026", 
    description: "A dynamic blue swirling galaxy background dotted with small golden-yellow stars.", 
    story: "Reflecting the infinite motion and mystery of the cosmos." 
  },
  { 
    title: "Peacock Mandala Fusion", 
    image: art5, 
    medium: "Pen and ink on paper", 
    year: "2026", 
    description: "A creative doodle art piece integrating a stylized peacock motif surrounded by floral and mandala elements.", 
    story: "A whimsical composition blending national heritage motifs with abstract line art." 
  },
  { 
    title: "Divine Trishula & Om", 
    image: art6, 
    medium: "Pencil on paper", 
    year: "2026", 
    description: "A sketch featuring a Trishula, Damru, and the Om symbol accompanied by a decorative half-mandala floral arrangement.", 
    story: "A spiritual artwork blending sacred symbols and traditional motifs." 
  },
  { 
    title: "Itachi Uchiha", 
    image: art7, 
    medium: "Pencil sketch", 
    year: "2026", 
    description: "A portrait sketch of Itachi Uchiha from Naruto wearing his Akatsuki collar and headband.", 
    story: "A tribute to one of anime's most complex and iconic characters." 
  },
  { 
    title: "Giyu Tomioka", 
    image: art8, 
    medium: "Pencil sketch", 
    year: "2026", 
    description: "A character sketch of Giyu Tomioka from Demon Slayer featuring his distinct spiky hair and calm expression.", 
    story: "Portraying the stoic and resilient Water Hashira." 
  },
  { 
    title: "Naruto Uzumaki", 
    image: art9, 
    medium: "Pencil sketch", 
    year: "2026", 
    description: "A sketch of Naruto Uzumaki wearing his leaf village headband and zipped jacket.", 
    story: "Capturing the determined spirit of the ninja hero." 
  },
];

export const ARTWORKS: Record<string, Artwork> = Object.fromEntries(
  ARTWORK_SEQUENCE.map((artwork, index) => [ALL_SLOTS[index]!.id, artwork]),
);
