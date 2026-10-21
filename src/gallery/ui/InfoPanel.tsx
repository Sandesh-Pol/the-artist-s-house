import { X, Instagram, Mail, MapPin } from "lucide-react";
import { ARTIST } from "../data/artist";
import { useGallery } from "../store";
import portrait from "@/assets/art-3.jpg";

export function InfoPanel() {
  const { panel, setPanel } = useGallery();
  if (!panel) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-ink/40 animate-fade" onClick={() => setPanel(null)}>
      <aside
        className="h-full w-full max-w-md overflow-y-auto bg-background p-8 shadow-soft animate-rise md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="float-right" onClick={() => setPanel(null)} aria-label="Close"><X /></button>
        {panel === "about" ? (
          <>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The artist</p>
            <h2 className="mt-3 font-display text-5xl leading-none">{ARTIST.name}</h2>
            <p className="mt-2 italic text-muted-foreground">{ARTIST.tagline}</p>
            <img src={portrait} alt="" loading="lazy" width={896} height={1152} className="mt-8 aspect-[4/3] w-full object-cover" />
            <p className="mt-8 font-display text-2xl leading-snug">{ARTIST.intro}</p>
            <p className="mt-6 leading-relaxed text-muted-foreground">{ARTIST.story}</p>
            <button onClick={() => setPanel("contact")} className="mt-8 text-sm uppercase tracking-widest text-primary underline-offset-4 hover:underline">
              Get in touch →
            </button>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact</p>
            <h2 className="mt-3 font-display text-5xl leading-none">Say hello</h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              For commissions, exhibitions, or just to talk about a painting — I'd love to hear from you.
            </p>
            <div className="mt-8 grid gap-4">
              <a href={`mailto:${ARTIST.email}`} className="flex items-center gap-3 border-b border-border pb-4 hover:text-primary"><Mail size={18} /> {ARTIST.email}</a>
              <a href={ARTIST.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 border-b border-border pb-4 hover:text-primary"><Instagram size={18} /> {ARTIST.instagramHandle}</a>
              <p className="flex items-center gap-3 text-muted-foreground"><MapPin size={18} /> {ARTIST.location}</p>
            </div>
            <form
              className="mt-8 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                window.location.href = `mailto:${ARTIST.email}?subject=${encodeURIComponent("Hello from your gallery")}&body=${encodeURIComponent(`${f.get("msg")}\n\n— ${f.get("name")}`)}`;
              }}
            >
              <input name="name" required placeholder="Your name" className="rounded-sm border border-input bg-card px-3 py-2 text-sm" />
              <textarea name="msg" required rows={4} placeholder="Your message" className="rounded-sm border border-input bg-card px-3 py-2 text-sm" />
              <button className="rounded-sm bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90">Send message</button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}
