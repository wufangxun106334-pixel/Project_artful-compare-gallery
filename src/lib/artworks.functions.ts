import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { Artwork } from "@/data/artworks";
import { rowToArtwork, type ArtworkRow } from "@/lib/artwork-row";

// Public, read-only client: RLS only lets it see published rows.
function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const COLUMNS = "id, slug, title, description, category, image_url, thumbnail_url, sort_order, status, maker_display, year_start, year_end, details, created_at";

/** Every published artwork (paged through in 1000-row chunks). */
export const listPublishedArtworks = createServerFn({ method: "GET" }).handler(async (): Promise<Artwork[]> => {
  const sb = publicClient();
  const out: Artwork[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from("artworks").select(COLUMNS).eq("status", "published").order("sort_order").range(from, from + 999);
    if (error) throw new Error(error.message);
    out.push(...(data as ArtworkRow[]).map(rowToArtwork));
    if (!data || data.length < 1000) break;
  }
  return out;
});

/** One page of published works, optionally filtered by category — the database does the paging. */
export const listArtworkPage = createServerFn({ method: "GET" })
  .inputValidator((input: { category?: string; page: number; pageSize: number }) => ({
    category: input.category || undefined,
    page: Math.max(1, Math.floor(input.page) || 1),
    pageSize: Math.min(60, Math.max(6, Math.floor(input.pageSize) || 24)),
  }))
  .handler(async ({ data }) => {
    const sb = publicClient();
    let q = sb.from("artworks").select(COLUMNS, { count: "exact" }).eq("status", "published");
    if (data.category) q = q.eq("category", data.category);
    const from = (data.page - 1) * data.pageSize;
    const { data: rows, count, error } = await q.order("sort_order").range(from, from + data.pageSize - 1);
    if (error) throw new Error(error.message);
    return { items: (rows as ArtworkRow[]).map(rowToArtwork), total: count ?? 0, page: data.page, pageSize: data.pageSize };
  });
