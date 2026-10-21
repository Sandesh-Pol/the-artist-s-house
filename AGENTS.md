<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The 3D gallery lives in src/gallery: rooms/frame slots in data/rooms.ts, default artworks keyed by slot id in data/artworks.ts, artist info in data/artist.ts — add rooms/paintings there, not in components. Why: keeps content modular.
- vite.config.ts strips devtools `data-tsd-source` attributes from src/gallery/three/*; keep all R3F JSX in that folder. Why: the injected attribute crashes React Three Fiber.
