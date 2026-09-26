// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { generate, prerenderPaths } from "./scripts/generate-content.mjs";

// content.md is the single source of truth: validate + regenerate derived files
// before every dev start/build (an invalid content.md fails the build).
generate(import.meta.dirname);
const contentPlugin = {
  name: "content-md",
  configureServer(server: { watcher: { add: (f: string) => void; on: (e: string, cb: (f: string) => void) => void } }) {
    server.watcher.add(path.resolve(import.meta.dirname, "content.md"));
    server.watcher.on("change", (file: string) => {
      if (file.endsWith("content.md")) {
        try { generate(import.meta.dirname); } catch (e) { console.error(e); }
      }
    });
  },
};

// Load all env vars (including non-VITE_ server secrets) into process.env for
// server-side code only. These are never injected into the client bundle.
const serverEnv = loadEnv(process.env['NODE_ENV'] ?? "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

const ghPagesBase = process.env['GHPAGES_BASE']; // e.g. "/alena-kuritka-dev/"

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    pages: prerenderPaths(import.meta.dirname).map((p: string) => ({ path: p })),
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
  },
  vite: {
    base: ghPagesBase ?? "/",
    plugins: [contentPlugin],
    resolve: {
      alias: {
        "entities/lib/decode.js": path.resolve(import.meta.dirname, "node_modules/entities/lib/decode.js"),
        "entities/lib/encode.js": path.resolve(import.meta.dirname, "node_modules/entities/lib/encode.js"),
        entities: path.resolve(import.meta.dirname, "node_modules/entities"),
      },
    },
  },
});
