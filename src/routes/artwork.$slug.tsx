import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { ArtImage, ArtworkCard, BookmarkButton, CompareButton, MetaRow, Swatches } from "@/components/atlas";
import { getArtwork, getMaker, collectionsFor, related, describeShared, termLabel, getPerspective } from "@/lib/catalogue";
import { makerKindLabel } from "@/data/makers";
import { label, styles } from "@/data/vocabularies";

export const Route = createFileRoute("/artwork/$slug")({
  loader: ({ params }) => {
    const a = getArtwork(params.slug);
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData: a }) => ({
    meta: a
      ? [
          { title: `${a.title} — Medieval Atlas` },
          { name: "description", content: a.introduction },
          { property: "og:title", content: `${a.title} — ${a.makerDisplay}, ${a.dateLabel}` },
          { property: "og:description", content: a.introduction },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Artwork not found — Medieval Atlas" }, { name: "robots", content: "noindex" }],
  }),
  component: ArtworkPage,
});

function ArtworkPage() {
  const a = Route.useLoaderData();
  const [open, setOpen] = useState(false);
  const cols = collectionsFor(a);
  const rel = related(a);
  return (
    <article className="py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb"><Link to="/" className="hover:text-foreground">Home</Link> / Artwork</nav>
      <div className="mt-6 grid gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <div className="relative bg-muted shadow-frame">
            <ArtImage src={a.image.display} alt={a.image.alt} width={a.image.width} height={a.image.height} eager className="max-h-[80vh] object-contain" />
            <button onClick={() => setOpen(true)} className="absolute right-3 top-3 inline-flex items-center gap-1.5 bg-card/90 px-3 py-1.5 text-xs hover:text-primary" aria-label="Enlarge and zoom image">
              <Maximize2 className="h-3.5 w-3.5" /> Enlarge
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Image: {a.image.credit}. {a.image.rightsUrl ? <a href={a.image.rightsUrl} target="_blank" rel="noreferrer" className="underline">{a.image.rightsLabel}</a> : a.image.rightsLabel}
            {a.image.sourceFilePage && <> · <a href={a.image.sourceFilePage} target="_blank" rel="noreferrer" className="underline">File page</a></>}
          </p>
        </div>

        <div>
          <p className="eyebrow">{a.mediumIds.map((m) => termLabel("mediums", m)).join(" · ")}</p>
          <h1 className="mt-2 text-5xl leading-[1.02]">{a.title}</h1>
          {a.originalTitle && <p className="mt-2 font-serif text-xl italic text-muted-foreground">{a.originalTitle}</p>}
          <p className="mt-3 text-lg">{a.makerDisplay} · {a.dateLabel}</p>
          <div className="mt-5 flex gap-2"><BookmarkButton id={a.id} withLabel /><CompareButton id={a.id} withLabel /></div>
          <p className="mt-8 font-serif text-2xl leading-snug">{a.introduction}</p>

          <dl className="mt-8">
            <MetaRow label="Date">{a.dateLabel}{a.dateNote && <span className="block text-xs text-muted-foreground">{a.dateNote}</span>}</MetaRow>
            <MetaRow label="Maker">
              {a.makerIds.map((id) => { const m = getMaker(id); return m ? <span key={id} className="block">{m.name} <span className="text-xs text-muted-foreground">({makerKindLabel[m.kind]})</span></span> : null; })}
              {a.attributionNote && <span className="block text-xs text-muted-foreground">{a.attributionNote}</span>}
            </MetaRow>
            <MetaRow label="Place made">{a.creationPlaceLabel}</MetaRow>
            <MetaRow label="Context">{a.culturalContext}</MetaRow>
            <MetaRow label="Style">{a.styleIds.map((s) => label(styles, s)).join(", ")}</MetaRow>
            <MetaRow label="Materials">{a.materials?.join(", ")}</MetaRow>
            <MetaRow label="Dimensions">{a.dimensions}</MetaRow>
            <MetaRow label="Held at">{a.institution}</MetaRow>
            <MetaRow label="Accession no.">{a.accessionNumber}</MetaRow>
          </dl>
        </div>
      </div>

      <section className="mt-16 grid gap-12 border-t border-border pt-12 md:grid-cols-2">
        <div>
          <p className="eyebrow">Observed</p>
          <h2 className="mt-2 text-3xl">Looking closely</h2>
          <p className="mt-4 leading-relaxed">{a.visualAnalysis}</p>
          {a.interpretation && (
            <>
              <p className="eyebrow mt-10">Interpretation</p>
              <h2 className="mt-2 text-3xl">What scholars suggest</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{a.interpretation}</p>
            </>
          )}
        </div>
        <div>
          <p className="eyebrow">Palette derived from the digital image</p>
          <div className="mt-4"><Swatches colours={a.representativeColours} /></div>
          <p className="mt-3 text-xs text-muted-foreground">{a.paletteMethod} These hex values describe a photograph, not original pigments, and carry no symbolic meaning.</p>
          <p className="eyebrow mt-10">Appears in</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {cols.map((c) => (
              <li key={c.id}><Link to="/collection/$slug" params={{ slug: c.slug }} className="inline-block border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                <span className="text-xs text-muted-foreground">{getPerspective(c.perspective)?.kicker}: </span>{c.title}
              </Link></li>
            ))}
          </ul>
          <p className="eyebrow mt-10">Sources</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {a.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="text-primary underline-offset-2 hover:underline">{s.title}</a>{s.accessedAt && <span className="text-xs text-muted-foreground"> · accessed {s.accessedAt}</span>}</li>)}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Record status: {a.verificationStatus === "verified" ? "verified against the holding institution" : "partially verified — image rights checked on Commons; metadata from cited general sources"}.</p>
        </div>
      </section>

      {rel.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-3xl">Related works</h2>
          <div className="mt-8 columns-1 gap-8 sm:columns-2 lg:columns-4">
            {rel.map((r) => <ArtworkCard key={r.artwork.id} a={r.artwork} note={<>Shared {describeShared(r.shared)} · <Link to="/compare" search={{ a: a.id, b: r.artwork.id }} className="text-primary">compare</Link></>} />)}
          </div>
        </section>
      )}

      <ZoomDialog open={open} onOpenChange={setOpen} src={a.image.display} alt={a.image.alt} title={a.title} />
    </article>
  );
}

export function ZoomDialog({ open, onOpenChange, src, alt, title }: { open: boolean; onOpenChange: (o: boolean) => void; src: string; alt: string; title: string }) {
  const [z, setZ] = useState(1);
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setZ(1); }}>
      <DialogContent className="flex h-[92vh] max-w-[96vw] flex-col gap-3 border-none bg-ink p-3 text-ink-foreground sm:rounded-none [&>button:last-child]:hidden">
        <div className="flex items-center gap-2">
          <DialogTitle className="mr-auto truncate font-serif text-xl font-normal">{title}</DialogTitle>
          <button onClick={() => setZ((v) => Math.max(1, v - 0.5))} disabled={z <= 1} aria-label="Zoom out" className="p-2 hover:text-accent disabled:opacity-40"><ZoomOut className="h-5 w-5" /></button>
          <span className="w-12 text-center text-xs tabular-nums">{Math.round(z * 100)}%</span>
          <button onClick={() => setZ((v) => Math.min(4, v + 0.5))} disabled={z >= 4} aria-label="Zoom in" className="p-2 hover:text-accent disabled:opacity-40"><ZoomIn className="h-5 w-5" /></button>
          <DialogClose aria-label="Close (Esc)" className="p-2 hover:text-accent"><X className="h-5 w-5" /></DialogClose>
        </div>
        <div className="flex-1 overflow-auto" tabIndex={0} aria-label="Zoomable image; scroll to pan">
          <img src={src} alt={alt} style={{ width: `${z * 100}%`, maxWidth: z === 1 ? "100%" : "none" }} className={z === 1 ? "mx-auto h-full w-auto object-contain" : "h-auto"} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
