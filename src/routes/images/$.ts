// Implementation-only Lovable preview compatibility (NOT authoritative).
// Static builds serve /images/* directly from public/. Only when a referenced
// binary is absent (Lovable workspace stores CDN pointers instead) does this
// route redirect to the pointer URL. content.md stays the single source.
import { createFileRoute } from "@tanstack/react-router";
import { assetPointers } from "@/generated/asset-pointers";

export const Route = createFileRoute("/images/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const target = assetPointers[`/images/${params._splat ?? ""}`];
        if (!target) return new Response("Not found", { status: 404 });
        return new Response(null, { status: 302, headers: { Location: encodeURI(target), "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
