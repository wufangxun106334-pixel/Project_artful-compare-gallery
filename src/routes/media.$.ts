import { createFileRoute } from "@tanstack/react-router";

// Same-origin image delivery from the private "artworks" storage bucket.
// Read-only: storage policies allow anyone to read this bucket, nothing else.
export const Route = createFileRoute("/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params._splat ?? "").split("/").filter((p) => p && p !== "..").join("/");
        if (!/^[a-z0-9-]+\/[a-z0-9._-]+\.(webp|jpe?g|png)$/i.test(path)) return new Response("Not found", { status: 404 });
        const url = process.env["SUPABASE_URL"]!;
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
        const res = await fetch(`${url}/storage/v1/object/authenticated/artworks/${path}`, { headers: { apikey: key } });
        if (!res.ok || !res.body) return new Response("Not found", { status: 404 });
        return new Response(res.body, {
          headers: {
            "content-type": res.headers.get("content-type") ?? "image/webp",
            "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
          },
        });
      },
    },
  },
});
