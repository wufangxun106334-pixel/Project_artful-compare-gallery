import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bookmark, BookmarkCheck, Columns2, ImageOff, X } from "lucide-react";
import type { Artwork } from "@/data/artworks";
import type { Collection } from "@/data/collections";
import { collectionMembers, getArtwork } from "@/lib/catalogue";
import { useBookmarks, useCompare } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function ArtImage({ src, srcSet, sizes, alt, width, height, className, eager }: { src: string; srcSet?: string | undefined; sizes?: string | undefined; alt: string; width?: number | undefined; height?: number | undefined; className?: string | undefined; eager?: boolean | undefined }) {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const ref = useRef<HTMLImageElement>(null);
  // Images may finish loading before hydration attaches onLoad/onError.
  useEffect(() => {
    const el = ref.current;
    if (el?.complete) setState(el.naturalWidth > 0 ? "ok" : "error");
  }, [src]);
  const ratio = width && height ? `${width} / ${height}` : undefined;
  if (state === "error")
    return (
      <div style={{ aspectRatio: ratio ?? "4 / 3" }} className={cn("flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted text-muted-foreground", className)} role="img" aria-label={`Image unavailable: ${alt}`}>
        <ImageOff className="h-6 w-6" aria-hidden />
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  return (
    <img
      ref={ref} src={src} srcSet={srcSet} sizes={sizes} alt={alt} width={width} height={height}
      loading={eager ? "eager" : "lazy"} decoding="async"
      style={{ aspectRatio: ratio }}
      onLoad={() => setState("ok")} onError={() => setState("error")}
      className={cn("block h-auto w-full rounded-lg bg-muted transition-opacity duration-500", state === "loading" ? "opacity-0" : "opacity-100", className)}
    />
  );
}

/**
 * Real stored variants only: thumbnail (long edge 1100px) and display (long edge 1920px).
 * Widths are computed from each record's display size so the browser picks correctly on 2x screens.
 */
export function variantSrcSet(a: Artwork) {
  const w = a.image.width, h = a.image.height;
  if (!w || !h) return undefined;
  const thumbW = Math.round(w * Math.min(1, 1100 / Math.max(w, h)));
  return thumbW < w ? `${a.image.thumbnail} ${thumbW}w, ${a.image.display} ${w}w` : `${a.image.display} ${w}w`;
}

export function Swatches({ colours, size = "md", label = true }: { colours: string[]; size?: "sm" | "md"; label?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <ul className="flex" aria-label="Palette derived from the digital image">
        {colours.map((c) => (
          <li key={c} title={c} style={{ backgroundColor: c }} className={cn("border border-border/60 first:rounded-l-sm last:rounded-r-sm", size === "sm" ? "h-3 w-6" : "h-10 flex-1 min-w-10")}>
            <span className="sr-only">{c}</span>
          </li>
        ))}
      </ul>
      {label && size === "md" && (
        <div className="flex justify-between text-xs text-muted-foreground">
          {colours.map((c) => <span key={c}>{c}</span>)}
        </div>
      )}
    </div>
  );
}

export function BookmarkButton({ id, withLabel }: { id: string; withLabel?: boolean }) {
  const b = useBookmarks();
  const on = b.has(id);
  return (
    <button type="button" onClick={() => b.toggle(id)} aria-pressed={on} aria-label={on ? "Remove bookmark" : "Bookmark artwork"}
      className="inline-flex items-center gap-2 rounded-sm border border-border bg-card/90 px-2.5 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:text-primary">
      {on ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
      {withLabel && (on ? "Saved" : "Save")}
    </button>
  );
}

export function CompareButton({ id, withLabel }: { id: string; withLabel?: boolean }) {
  const c = useCompare();
  const on = c.has(id);
  return (
    <button type="button" onClick={() => c.toggle(id)} aria-pressed={on} aria-label={on ? "Remove from comparison" : "Add to comparison"}
      className={cn("inline-flex items-center gap-2 rounded-sm border px-2.5 py-1.5 text-xs transition-colors", on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/90 text-foreground hover:border-primary hover:text-primary")}>
      <Columns2 className="h-4 w-4" />
      {withLabel && (on ? "In comparison" : "Compare")}
    </button>
  );
}

export function ArtworkCard({ a, note }: { a: Artwork; note?: ReactNode }) {
  return (
    <article className="group glass-hover mb-8 break-inside-avoid rounded-xl p-2 -m-2">
      <Link to="/artwork/$slug" params={{ slug: a.slug }} className="block overflow-hidden rounded-lg bg-muted shadow-frame">
        <ArtImage src={a.image.thumbnail} srcSet={variantSrcSet(a)} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" alt={a.image.alt} width={a.image.width} height={a.image.height} />
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xl leading-tight">
            <Link to="/artwork/$slug" params={{ slug: a.slug }} className="hover:text-primary">{a.title}</Link>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{a.makerDisplay} · {a.dateLabel}</p>
          {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
        </div>
        <div className="flex shrink-0 gap-1.5">
          <BookmarkButton id={a.id} />
          <CompareButton id={a.id} />
        </div>
      </div>
    </article>
  );
}

export function ArtworkGrid({ items, step = 12 }: { items: Artwork[]; step?: number }) {
  const [n, setN] = useState(step);
  return (
    <>
      <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
        {items.slice(0, n).map((a) => <ArtworkCard key={a.id} a={a} />)}
      </div>
      {n < items.length && (
        <div className="mt-4 text-center">
          <button onClick={() => setN(n + step)} className="border border-foreground px-5 py-2 text-sm hover:bg-foreground hover:text-background">
            Show more ({items.length - n} remaining of {items.length})
          </button>
        </div>
      )}
    </>
  );
}

export function CollectionCard({ c, variant = "default" }: { c: Collection; variant?: "default" | "palette" }) {
  const members = collectionMembers(c);
  const cover = getArtwork(c.coverArtworkId) ?? members[0];
  return (
    <Link to="/collection/$slug" params={{ slug: c.slug }} className="group glass-hover block rounded-xl p-2 -m-2">
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg bg-background p-3">
        {cover && (
          // Whole artwork, natural proportions: contain inside the frame, never crop or zoom.
          <img src={cover.image.display} srcSet={variantSrcSet(cover)} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            alt="" loading="lazy" decoding="async" width={cover.image.width} height={cover.image.height}
            className={cn("max-h-full max-w-full rounded-md object-contain", variant === "palette" && "mb-14")} />
        )}
        {variant === "palette" && (
          <div className="absolute inset-x-0 bottom-0 flex h-14 overflow-hidden rounded-b-lg">
            {Array.from(new Set(members.flatMap((m) => m.representativeColours.slice(0, 2)))).slice(0, 8).map((col) => (
              <span key={col} className="flex-1" style={{ backgroundColor: col }} />
            ))}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-2xl leading-tight group-hover:text-primary">{c.title}</h3>
        <span className="shrink-0 text-xs text-muted-foreground">{members.length} {members.length === 1 ? "work" : "works"}</span>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.introduction}</p>
    </Link>
  );
}

export function Chip({ children, onRemove }: { children: ReactNode; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 py-1 pl-3 pr-1.5 text-xs text-primary">
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Remove ${typeof children === "string" ? children : "criterion"}`} className="rounded-full p-0.5 hover:bg-primary/15">
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="fade-up border-b border-border pb-10 pt-14">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-3 max-w-4xl text-4xl leading-tight md:text-6xl">{title}</h1>
      {children && <div className="mt-5 max-w-2xl text-lg text-muted-foreground">{children}</div>}
    </header>
  );
}

export function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-border py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{children || <span className="italic text-muted-foreground">Not recorded</span>}</dd>
    </div>
  );
}
