import type { Artwork } from "@/data/artworks";

export type ArtworkRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  thumbnail_url: string;
  sort_order: number;
  status: string;
  maker_display: string;
  year_start: number | null;
  year_end: number | null;
  details: unknown;
  created_at?: string;
};

/** Table columns are the source of truth; `details` holds the rest of the catalogue record. */
export function rowToArtwork(r: ArtworkRow): Artwork {
  const d = (r.details ?? {}) as Partial<Artwork>;
  const img = (d.image ?? {}) as Partial<Artwork["image"]>;
  return {
    centuryIds: [], styleIds: [], regionIds: [], makerIds: [], mediumIds: [], paletteIds: [], representativeColours: [], themeIds: [],
    institution: "", visualAnalysis: "", sources: [], dateLabel: "",
    ...d,
    id: r.id,
    slug: r.slug,
    title: r.title,
    introduction: r.description,
    makerDisplay: r.maker_display || d.makerDisplay || "",
    yearStart: r.year_start,
    yearEnd: r.year_end,
    styleIds: d.styleIds?.length ? d.styleIds : [r.category],
    verificationStatus: r.status === "published" ? (d.verificationStatus === "placeholder" ? "partial" : d.verificationStatus ?? "partial") : "placeholder",
    image: { alt: r.title, credit: "", rightsLabel: "", ...img, display: r.image_url, thumbnail: r.thumbnail_url || r.image_url },
  } as Artwork;
}

export function artworkToRow(a: Artwork, sortOrder: number, status: "published" | "draft") {
  return {
    id: a.id, slug: a.slug, title: a.title, description: a.introduction, category: a.styleIds[0] ?? "early-netherlandish",
    image_url: a.image.display, thumbnail_url: a.image.thumbnail, image_path: a.id, sort_order: sortOrder, status,
    maker_display: a.makerDisplay, year_start: a.yearStart, year_end: a.yearEnd,
    details: a as unknown as Record<string, unknown>,
  };
}
