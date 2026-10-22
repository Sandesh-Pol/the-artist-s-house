import { X, Move, MousePointerClick, Frame, Lightbulb, Blinds, Palette, Map as MapIcon, Pencil } from "lucide-react";
import { useGallery } from "../store";

const ITEMS: { icon: React.ReactNode; title: string; text: string }[] = [
  {
    icon: <Move size={15} />,
    title: "Walk & look around",
    text: "Use the arrow pad, your keyboard arrows, or scroll to move between rooms. Drag to look around; swipe on touch screens.",
  },
  {
    icon: <Frame size={15} />,
    title: "Paintings",
    text: "Tap any framed artwork to see it full-screen with its title, story and details.",
  },
  {
    icon: <MousePointerClick size={15} />,
    title: "Interactive objects",
    text: "Some objects in the house — vases, plants, the record player, books — can be tapped to hear their story. They glow gold when you hover over them.",
  },
  {
    icon: <Lightbulb size={15} />,
    title: "Lights",
    text: "The bulb button in the top bar switches every lamp in the house on or off.",
  },
  {
    icon: <Blinds size={15} />,
    title: "Curtains",
    text: "The blinds button opens or closes all curtains. Closed curtains dim the daylight coming in.",
  },
  {
    icon: <Palette size={15} />,
    title: "Interior themes",
    text: "The palette button switches the whole house between clean gallery white and evening light.",
  },
  {
    icon: <MapIcon size={15} />,
    title: "Floor plan",
    text: "The map button shows a live floor plan. Tap any room on it to jump straight there.",
  },
  {
    icon: <Pencil size={15} />,
    title: "Curate mode",
    text: "The Curate button lets the artist hang her own paintings, resize frames, and add brand-new frames to any wall.",
  },
];

export function HelpDialog() {
  const { help, setHelp } = useGallery();
  if (!help) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 animate-fade md:items-center" onClick={() => setHelp(false)}>
      <div
        className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-lg bg-background p-6 shadow-soft animate-rise md:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Visitor guide</p>
            <h2 className="font-display text-3xl">How to explore</h2>
          </div>
          <button onClick={() => setHelp(false)} aria-label="Close"><X /></button>
        </div>
        <div className="mt-5 grid gap-4">
          {ITEMS.map((it) => (
            <div key={it.title} className="flex gap-3">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-accent text-primary">{it.icon}</span>
              <div>
                <p className="text-sm font-medium">{it.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{it.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
