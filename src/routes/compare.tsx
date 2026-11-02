import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { ArtImage, PageHeader, Swatches } from "@/components/atlas";
import { getArtwork, sharedAttributes, termLabel, published, type Dimension } from "@/lib/catalogue";
import { useCompare } from "@/lib/storage";
import { ZoomDialog } from "@/components/zoom-dialog";
import type { Artwork } from "@/data/artworks";

export const Route = createFileRoute("/compare")({
  validateSearch: (s: Record<string, unknown>): { a?: string | undefined; b?: string | undefined } => ({
    a: typeof s["a"] === "string" ? s["a"] : undefined,
    b: typeof s["b"] === "string" ? s["b"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Compare two works — Medieval Atlas" },
      { name: "description", content: "Place two medieval artworks side by side and see what they share." },
      { property: "og:title", content: "Compare two works — Medieval Atlas" },
      { property: "og:description", content: "Side-by-side comparison of date, place, maker, medium, theme and palette." },
    ],
  }),
  component: Compare,
});

const rows: { label: string; get: (a: Artwork) => string; dim?: Dimension }[] = [
  { label: "Date", get: (a) => a.dateLabel, dim: "centuries" },
  { label: "Region", get: (a) => a.regionIds.map((r) => termLabel("regions", r)).join(", "), dim: "regions" },
  { label: "Place made", get: (a) => a.creationPlaceLabel ?? "Not recorded" },
  { label: "Maker", get: (a) => a.makerDisplay, dim: "makers" },
  { label: "Medium", get: (a) => a.mediumIds.map((m) => termLabel("mediums", m)).join(", "), dim: "mediums" },
  { label: "Themes", get: (a) => a.themeIds.map((t) => termLabel("themes", t)).join(", "), dim: "themes" },
  { label: "Palette group", get: (a) => a.paletteIds.map((p) => termLabel("palettes", p)).join(", "), dim: "palettes" },
  { label: "Held at", get: (a) => a.institution },
];

function Compare() {
  const search = Route.useSearch();
  const tray = useCompare();
  const ids = search.a || search.b ? [search.a, search.b] : tray.list;
  const [a, b] = [getArtwork(ids[0] ?? ""), getArtwork(ids[1] ?? "")];
  const [zoom, setZoom] = useState<Artwork | null>(null);

  if (!a || !b) {
    return (
      <>
        <PageHeader eyebrow="Compare" title="Choose two works">Use the compare button on any artwork card or page. You have selected {[a, b].filter(Boolean).length} of 2.</PageHeader>
        <ul className="grid gap-4 py-10 sm:grid-cols-3 lg:grid-cols-5">
          {published.map((x) => (
            <li key={x.id}><button onClick={() => tray.toggle(x.id)} aria-pressed={tray.has(x.id)} className={`block w-full border p-2 text-left text-xs ${tray.has(x.id) ? "border-primary" : "border-border"}`}>
              <ArtImage src={x.image.thumbnail} alt="" width={x.image.width} height={x.image.height} /><span className="mt-2 block">{x.title}</span>
            </button></li>
          ))}
        </ul>
      </>
    );
  }
  const shared = sharedAttributes(a, b);
  const sharedDims = new Set(shared.map((s) => s.dimension));
  return (
    <>
      <PageHeader eyebrow="Compare" title="Side by side">
        {shared.length ? <>These works share {shared.map((s) => s.ids.map((i) => termLabel(s.dimension, i)).join(", ")).join("; ")}.</> : "These works share no catalogued attributes — a contrast worth looking at."}
      </PageHeader>
      <div className="grid gap-8 py-10 md:grid-cols-2">
        {[a, b].map((x) => (
          <figure key={x.id}>
            <div className="relative flex h-[55vh] items-center justify-center bg-muted">
              <img src={x.image.display} alt={x.image.alt} className="max-h-full max-w-full object-contain" />
              <button onClick={() => setZoom(x)} className="absolute right-3 top-3 inline-flex items-center gap-1 bg-card/90 px-3 py-1.5 text-xs"><Maximize2 className="h-3.5 w-3.5" /> Enlarge</button>
            </div>
            <figcaption className="mt-3">
              <Link to="/artwork/$slug" params={{ slug: x.slug }} className="font-serif text-2xl hover:text-primary">{x.title}</Link>
            </figcaption>
          </figure>
        ))}
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-border align-top">
              <th scope="row" className="w-36 py-3 pr-4 text-left font-normal text-muted-foreground">{r.label}{r.dim && sharedDims.has(r.dim) && <span className="ml-1 text-gold" title="Shared">●</span>}</th>
              <td className="py-3 pr-4">{r.get(a)}</td>
              <td className="py-3">{r.get(b)}</td>
            </tr>
          ))}
          <tr className="border-b border-border align-top">
            <th scope="row" className="py-3 text-left font-normal text-muted-foreground">Image palette</th>
            <td className="py-3 pr-4"><Swatches colours={a.representativeColours} size="sm" /></td>
            <td className="py-3"><Swatches colours={b.representativeColours} size="sm" /></td>
          </tr>
          <tr className="align-top">
            <th scope="row" className="py-3 text-left font-normal text-muted-foreground">Observations</th>
            <td className="py-3 pr-4 leading-relaxed">{a.visualAnalysis}</td>
            <td className="py-3 leading-relaxed">{b.visualAnalysis}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4 text-xs text-muted-foreground">● marks a shared catalogue attribute. Observations come from each record; no comparative claims are generated.</p>
      <button onClick={tray.clear} className="mt-6 text-sm text-primary underline">Clear comparison tray</button>
      {zoom && <ZoomDialog open onOpenChange={(o) => !o && setZoom(null)} src={zoom.image.display} alt={zoom.image.alt} title={zoom.title} />}
    </>
  );
}
