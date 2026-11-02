import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArtworkGrid, PageHeader } from "@/components/atlas";
import { getCollection, collectionMembers, collectionSortNote, collectionCriteria, visibleCollections, getPerspective } from "@/lib/catalogue";
import { toSearch } from "@/lib/url-criteria";

export const Route = createFileRoute("/collection/$slug")({
  loader: ({ params }) => {
    const c = getCollection(params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Collection not found — Medieval Atlas" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${loaderData.title} — Medieval Atlas` },
        { name: "description", content: loaderData.introduction },
        { property: "og:title", content: `${loaderData.title} — Medieval Atlas` },
        { property: "og:description", content: loaderData.introduction },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const c = Route.useLoaderData();
  const members = collectionMembers(c);
  const p = getPerspective(c.perspective)!;
  const relatedCols = visibleCollections(c.perspective).filter((x) => x.id !== c.id).slice(0, 6);
  return (
    <>
      <PageHeader eyebrow={`${p.title} · Collection`} title={c.title}>{c.introduction}</PageHeader>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-5 text-sm">
        <p><strong>{members.length}</strong> {members.length === 1 ? "work" : "works"} · <span className="text-muted-foreground">{collectionSortNote(c)}</span></p>
        <div className="flex gap-3">
          <Link to="/perspective/$id" params={{ id: p.id }} className="text-muted-foreground hover:text-foreground">← All {p.title}</Link>
          <Link to="/explore" search={toSearch(collectionCriteria(c))} className="bg-primary px-4 py-2 text-primary-foreground">Explore intersections</Link>
        </div>
      </div>
      {c.essay && <p className="max-w-3xl py-10 font-serif text-2xl leading-relaxed">{c.essay}</p>}
      <div className="py-12">
        {members.length ? <ArtworkGrid items={members} /> : <p className="text-muted-foreground">No published works in this collection yet.</p>}
      </div>
      {relatedCols.length > 0 && (
        <section className="border-t border-border py-12">
          <h2 className="text-3xl">Related collections</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {relatedCols.map((r) => (
              <li key={r.id}><Link to="/collection/$slug" params={{ slug: r.slug }} className="inline-block border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary">{r.title} <span className="text-muted-foreground">({collectionMembers(r).length})</span></Link></li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
