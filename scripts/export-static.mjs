// Turns the production build (dist/client) into a GitHub Pages deployment:
// keeps only images referenced by content.md (other source assets stay in the
// repo but are not published), adds CNAME, .nojekyll and the 404.html routing
// workaround. Usage: bun scripts/export-static.mjs [distDir] [cname]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { referencedAssets } from "./generate-content.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.resolve(process.argv[2] ?? path.join(root, "dist/client"));
const cname = process.argv[3];

const keep = new Set(referencedAssets(root).map((s) => s.replace(/^public\//, "")));
const missing = [];
for (const rel of keep) {
  const out = path.join(dist, rel);
  if (!fs.existsSync(out)) {
    const src = path.join(root, "public", rel);
    if (!fs.existsSync(src)) { missing.push(rel); continue; }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.copyFileSync(src, out);
  }
}
if (missing.length) throw new Error(`referenced assets missing:\n  ${missing.join("\n  ")}`);

// Remove every published image not referenced by content.md.
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const imagesDir = path.join(dist, "images");
let removed = 0;
for (const f of fs.existsSync(imagesDir) ? walk(imagesDir) : []) {
  if (!keep.has(path.relative(dist, f).split(path.sep).join("/"))) { fs.rmSync(f); removed++; }
}
const prune = (dir) => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) prune(path.join(dir, e.name)); if (dir !== imagesDir && !fs.readdirSync(dir).length) fs.rmdirSync(dir); };
if (fs.existsSync(imagesDir)) prune(imagesDir);

// Root-absolute stylesheet paths so nested routes work.
for (const f of walk(dist).filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync(f, "utf8");
  const fixed = html.replace(/(href|src)="\.\/assets\//g, '$1="/assets/');
  if (fixed !== html) fs.writeFileSync(f, fixed);
}
fs.copyFileSync(path.join(dist, "index.html"), path.join(dist, "404.html"));
fs.writeFileSync(path.join(dist, ".nojekyll"), "");
if (cname) fs.writeFileSync(path.join(dist, "CNAME"), `${cname}\n`);
console.log(`static export OK — ${keep.size} referenced images published, ${removed} unreferenced removed${cname ? `, CNAME ${cname}` : ""}`);
