

- The 3D gallery lives in src/gallery: rooms/frame slots in data/rooms.ts, default artworks keyed by slot id in data/artworks.ts, artist info in data/artist.ts — add rooms/paintings there, not in components. Why: keeps content modular.
- vite.config.ts strips devtools `data-tsd-source` attributes from src/gallery/three/*; keep all R3F JSX in that folder. Why: the injected attribute crashes React Three Fiber.
- Interior themes live in src/gallery/data/themes.ts; user-added frames, frame-size overrides and the chosen theme are runtime data persisted via idb-keyval in src/gallery/store.ts (keys gallery-uploads-v1 / gallery-prefs-v1), not in the data files. Why: data files stay the static defaults; visitor customisations stay per-browser.
- Clickable story objects (hotspots) are defined in src/gallery/data/hotspots.ts and rendered by three/Hotspots.tsx; the window "outside view" photo is runtime data persisted via idb-keyval key gallery-windowview-v1. Why: same rule as frames — data files stay static defaults, visitor customisations stay per-browser.
