import { createFileRoute } from "@tanstack/react-router";
import { GalleryApp } from "@/gallery/GalleryApp";

export const Route = createFileRoute("/")({
  ssr: false, // WebGL canvas is browser-only
  head: () => ({
    meta: [
      { title: "Mira Solenne — A House of Paintings" },
      { name: "description", content: "Walk through the artist's home and discover her paintings and drawings, room by room." },
      { property: "og:title", content: "Mira Solenne — A House of Paintings" },
      { property: "og:description", content: "An immersive 3D home gallery of paintings, drawings and the stories behind them." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryApp,
});
