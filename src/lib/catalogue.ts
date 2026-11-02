import { artworks, type Artwork } from "@/data/artworks";
import { makers } from "@/data/makers";
import { vocab, label } from "@/data/vocabularies";
import { collections, perspectives, type Collection } from "@/data/collections";

export type Dimension = "centuries" | "regions" | "makers" | "palettes" | "themes" | "mediums";
export const DIMENSIONS: Dimension[] = ["centuries", "regions", "makers", "palettes", "themes", "mediums"];

export type Criteria = Record<Dimension, string[]> & {
  yearFrom?: number | undefined;
  yearTo?: number | undefined;
  matchAllThemes?: boolean | undefined;
};

export const emptyCriteria = (): Criteria => ({ centuries: [], regions: [], makers: [], palettes: [], themes: [], mediums: [] });

const field: Record<Dimension, keyof Artwork> = {
  centuries: "centuryIds", regions: "regionIds", makers: "makerIds", palettes: "paletteIds", themes: "themeIds", mediums: "mediumIds",
};

export const dimensionMeta: Record<Dimension, { label: string; terms: { id: string; label: string }[] }> = {
  centuries: { label: "Century", terms: vocab.centuries },
  regions: { label: "Region", terms: vocab.regions },
  makers: { label: "Maker", terms: makers.map((m) => ({ id: m.id, label: m.name })) },
  palettes: { label: "Palette", terms: vocab.palettes },
  themes: { label: "Theme", terms: vocab.themes },
  mediums: { label: "Medium", terms: vocab.mediums },
};

export const termLabel = (d: Dimension, id: string) => label(dimensionMeta[d].terms, id);

/** Published works only: placeholders never count. */
export const published = artworks.filter((a) => a.verificationStatus !== "placeholder");

/** The single query engine: AND between dimensions, OR within (unless matchAllThemes). */
export function matches(a: Artwork, c: Partial<Criteria>): boolean {
  for (const d of DIMENSIONS) {
    const sel = c[d];
    if (!sel || sel.length === 0) continue;
    const values = a[field[d]] as string[];
    const ok = d === "themes" && c.matchAllThemes ? sel.every((s) => values.includes(s)) : sel.some((s) => values.includes(s));
    if (!ok) return false;
  }
  if (c.yearFrom != null || c.yearTo != null) {
    if (a.yearStart == null || a.yearEnd == null) return false;
    const from = c.yearFrom ?? -Infinity;
    const to = c.yearTo ?? Infinity;
    if (!(a.yearStart <= to && a.yearEnd >= from)) return false; // overlap
  }
  return true;
}

export function query(c: Partial<Criteria>, pool: Artwork[] = published) {
  return pool.filter((a) => matches(a, c));
}

export const getArtwork = (idOrSlug: string) => published.find((a) => a.slug === idOrSlug || a.id === idOrSlug);
export const getMaker = (id: string) => makers.find((m) => m.id === id);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getPerspective = (id: string) => perspectives.find((p) => p.id === id);

export function collectionMembers(col: Collection): Artwork[] {
  const set = col.membership.type === "rule"
    ? query(col.membership.criteria)
    : published.filter((a) => (col.membership as { artworkIds: string[] }).artworkIds.includes(a.id));
  const order = col.orderedArtworkIds ?? [];
  const rank = (a: Artwork) => { const i = order.indexOf(a.id); return i === -1 ? 1e6 + (a.yearStart ?? 9999) : i; };
  return [...set].sort((x, y) => rank(x) - rank(y));
}

export const collectionSortNote = (col: Collection) =>
  col.orderedArtworkIds?.length ? "Curated sequence" : "Sorted by earliest recorded date";

/** Collections an artwork belongs to — derived from the same membership logic. */
export const collectionsFor = (a: Artwork) => collections.filter((c) => collectionMembers(c).some((m) => m.id === a.id));

export const visibleCollections = (p?: string) =>
  collections.filter((c) => (!p || c.perspective === p) && collectionMembers(c).length > 0);

/** Criteria a collection contributes to the intersection explorer. */
export function collectionCriteria(col: Collection): Partial<Criteria> {
  if (col.membership.type === "rule") return col.membership.criteria;
  const ids = new Set(collectionMembers(col).flatMap((a) => a.makerIds));
  return { makers: [...ids] };
}

export function sharedAttributes(a: Artwork, b: Artwork) {
  const out: { dimension: Dimension; ids: string[] }[] = [];
  for (const d of DIMENSIONS) {
    const ids = (a[field[d]] as string[]).filter((x) => (b[field[d]] as string[]).includes(x));
    if (ids.length) out.push({ dimension: d, ids });
  }
  return out;
}

export function related(a: Artwork, n = 4) {
  return published
    .filter((b) => b.id !== a.id)
    .map((b) => {
      const s = sharedAttributes(a, b).filter((x) => x.dimension !== "mediums" || true);
      const score = s.reduce((t, x) => t + x.ids.length * (x.dimension === "makers" ? 3 : x.dimension === "themes" ? 2 : 1), 0);
      return { artwork: b, shared: s, score };
    })
    .filter((r) => r.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, n);
}

export function describeShared(shared: ReturnType<typeof sharedAttributes>) {
  return shared.slice(0, 3).map((s) => `${dimensionMeta[s.dimension].label.toLowerCase()}: ${s.ids.map((i) => termLabel(s.dimension, i)).join(", ")}`).join(" · ");
}

export function describeQuery(c: Partial<Criteria>) {
  const parts: string[] = [];
  for (const d of DIMENSIONS) {
    const sel = c[d] ?? [];
    if (!sel.length) continue;
    const joiner = d === "themes" && c.matchAllThemes ? " AND " : " OR ";
    const txt = sel.map((i) => termLabel(d, i)).join(joiner);
    parts.push(sel.length > 1 ? `(${txt})` : txt);
  }
  if (c.yearFrom != null || c.yearTo != null) parts.push(`dates overlapping ${c.yearFrom ?? "…"}–${c.yearTo ?? "…"}`);
  return parts.length ? parts.join(" AND ") : "All published works";
}

export const undatedCount = () => published.filter((a) => a.yearStart == null || a.yearEnd == null).length;

export { artworks, collections, perspectives, makers };
