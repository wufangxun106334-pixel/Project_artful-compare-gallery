import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CollectionCard, PageHeader, Swatches, ArtImage } from "@/components/atlas";
import { getPerspective, visibleCollections, collectionMembers, getArtwork, makers, published } from "@/lib/catalogue";
import { centuries, palettes } from "@/data/vocabularies";
import { makerKindLabel } from "@/data/makers";

export const Route = createFileRoute("/perspective/$id")({
  loader: ({ params }) => {
    const p = getPerspective(params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Medieval Atlas` },
          { name: "description", content: loaderData.intro },
          { property: "og:title", content: `${loaderData.title} — Medieval Atlas` },
          { property: "og:description", content: loaderData.intro },
        ]
      : [{ title: "Unavailable — Medieval Atlas" }, { name: "robots", content: "noindex" }],
  }),
  component: PerspectivePage,
});

function PerspectivePage() {
  const p = Route.useLoaderData();
  const cols = visibleCollections(p.id);
  return (
    <>
      <PageHeader eyebrow={p.kicker} title={p.title}>{p.intro}</PageHeader>
      {p.id === "time" ? <Timeline /> : p.id === "colour" ? <Palettes /> : (
        <>
          {p.id === "makers" && <MakerIndex />}
          <div className="grid gap-x-8 gap-y-14 py-14 sm:grid-cols-2 lg:grid-cols-3">
            {cols.map((c) => <CollectionCard key={c.id} c={c} />)}
          </div>
        </>
      )}
    </>
  );
}

function Timeline() {
  const cols = visibleCollections("time");
  return (
    <ol className="relative py-14">
      <span className="absolute bottom-14 left-[5.5rem] top-14 hidden w-px bg-border md:block" aria-hidden />
      {cols.map((c) => {
        const cent = centuries.find((x) => `col-${x.id}` === c.id)!;
        const members = collectionMembers(c);
        return (
          <li key={c.id} className="relative grid gap-6 border-b border-border py-10 md:grid-cols-[11rem_1fr_1.2fr]">
            <div>
              <p className="font-serif text-4xl text-primary">{cent.start === 1501 ? "c. 1500" : `${cent.start - 1}s`}</p>
              <p className="text-xs text-muted-foreground">{cent.start === 1501 ? "edge of scope" : `${cent.start}–${cent.end}`}</p>
            </div>
            <div>
              <Link to="/collection/$slug" params={{ slug: c.slug }} className="text-3xl hover:text-primary">{c.title}</Link>
              <p className="mt-2 text-muted-foreground">{c.introduction}</p>
              <Link to="/collection/$slug" params={{ slug: c.slug }} className="mt-4 inline-block text-sm text-primary">View {members.length} {members.length === 1 ? "work" : "works"} →</Link>
            </div>
            <div className="flex items-end gap-3 overflow-x-auto">
              {members.slice(0, 4).map((a) => (
                <Link key={a.id} to="/artwork/$slug" params={{ slug: a.slug }} className="w-28 shrink-0" title={a.title}>
                  <ArtImage src={a.image.thumbnail} alt={a.image.alt} width={a.image.width} height={a.image.height} />
                </Link>
              ))}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Palettes() {
  const cols = visibleCollections("colour");
  return (
    <div className="grid gap-10 py-14 md:grid-cols-2">
      {cols.map((c) => {
        const pal = palettes.find((x) => `col-${x.id}` === c.id)!;
        const members = collectionMembers(c);
        const cover = getArtwork(c.coverArtworkId)!;
        return (
          <Link key={c.id} to="/collection/$slug" params={{ slug: c.slug }} className="group grid border border-border bg-card sm:grid-cols-[1fr_1.1fr]">
            <div className="aspect-[4/3] overflow-hidden bg-muted sm:aspect-auto"><ArtImage src={cover.image.thumbnail} alt="" className="h-full w-full rounded-lg bg-background object-contain p-2" /></div>
            <div className="flex flex-col p-6">
              <Swatches colours={pal.swatches} label={false} />
              <h2 className="mt-5 text-3xl group-hover:text-primary">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.introduction}</p>
              <div className="mt-auto flex gap-1 pt-5">
                {members.slice(0, 5).map((m) => <span key={m.id} className="h-10 w-8 overflow-hidden bg-muted"><ArtImage src={m.image.thumbnail} alt="" className="h-full w-full object-cover" /></span>)}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{members.length} works</p>
            </div>
          </Link>
        );
      })}
      <p className="text-sm text-muted-foreground md:col-span-2">Palette groupings describe colours visible in the digital images, which are affected by photography, lighting, varnish and age. They are not evidence of original pigments. <Link to="/about" className="text-primary">How palettes are derived</Link>.</p>
    </div>
  );
}

function MakerIndex() {
  const used = makers.filter((m) => published.some((a) => a.makerIds.includes(m.id)));
  return (
    <section className="border-b border-border py-10">
      <h2 className="text-2xl">Index of makers</h2>
      <ul className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {used.map((m) => (
          <li key={m.id}>
            <Link to="/explore" search={{ makers: m.id }} className="hover:text-primary">{m.name}</Link>
            <span className="text-muted-foreground"> — {makerKindLabel[m.kind]}{m.lifeDates ? `, ${m.lifeDates}` : ""}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
