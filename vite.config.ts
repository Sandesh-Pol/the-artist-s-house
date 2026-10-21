// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Devtools source injection adds data-tsd-source to every JSX element, which crashes
// React Three Fiber (it treats props as object paths). Strip it from 3D scene files.
const stripTsdSourceIn3D = {
  name: "strip-tsd-source-3d",
  enforce: "pre" as const,
  transform(code: string, id: string) {
    if (!id.includes("/src/gallery/three/")) return null;
    return { code: code.replace(/\s data-tsd-source="[^"]*"/g, "").replace(/\sdata-tsd-source="[^"]*"/g, ""), map: null };
  },
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: { plugins: [stripTsdSourceIn3D] },
});
