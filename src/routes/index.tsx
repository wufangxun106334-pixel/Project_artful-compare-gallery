import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ArtImage, ArtworkCard, CollectionCard } from "@/components/atlas";
import { getArtwork, getCollection, perspectives, published, visibleCollections, collectionMembers } from "@/lib/catalogue";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medieval Atlas — Curated collections of medieval art" },
      { name: "description", content: "Explore medieval art from Europe, Byzantium and the Islamic world (c. 1000–1650) through time, region, makers, colour and theme." },
      { property: "og:title", content: "Medieval Atlas — Curated collections of medieval art" },
      { property: "og:description", content: "Five ways to encounter one collection of medieval art: time, region, makers, colour and theme." },
    ],
  }),
  component: Home,
});

function Home() {
  const hero = getArtwork("art-004")!;
  const featured = ["ultramarine", "14th-century", "virgin-and-child"].map((s) => getCollection(s)!).filter(Boolean);
  const picks = ["art-005", "art-008", "art-011", "art-015", "art-009", "art-007"].map((id) => getArtwork(id)!).filter(Boolean);
  return (
    <>
      <section className="grid items-center gap-10 py-12 md:grid-cols-[1.1fr_1fr] md:py-20">
        <div className="fade-up">
          <p className="eyebrow">Europe, Byzantium & Islamic world · c. 1000–1650</p>
          <h1 className="mt-4 text-5xl leading-[1.05] md:text-7xl">One collection,<br /><span className="text-gold">five ways</span> of looking.</h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Medieval Atlas introduces medieval art through curated collections — by century, by place, by maker, by colour and by subject. Every work appears once, and connects to many others.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#perspectives" className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-90">Explore collections <ArrowRight className="h-4 w-4" /></a>
            <Link to="/about" className="border border-foreground px-6 py-3 text-sm hover:bg-foreground hover:text-background">About this catalogue</Link>
          </div>
        </div>
        <figure className="md:justify-self-end">
          <Link to="/artwork/$slug" params={{ slug: hero.slug }} className="block max-w-md shadow-frame">
            <ArtImage src={hero.image.display} alt={hero.image.alt} width={hero.image.width} height={hero.image.height} eager />
          </Link>
          <figcaption className="mt-3 max-w-md text-xs text-muted-foreground">{hero.title}. {hero.makerDisplay}, {hero.dateLabel}. {hero.institution}. {hero.image.rightsLabel}.</figcaption>
        </figure>
      </section>

      <section id="perspectives" className="scroll-mt-24 border-t border-border py-16">
        <p className="eyebrow">Five perspectives</p>
        <h2 className="mt-2 text-4xl md:text-5xl">Choose a way in</h2>
        <div className="mt-10 grid gap-px bg-border md:grid-cols-5">
          {perspectives.map((p, i) => {
            const cover = getArtwork(p.cover)!;
            return (
              <Link key={p.id} to="/perspective/$id" params={{ id: p.id }} className="group flex flex-col bg-background p-5 hover:bg-card">
                <span className="font-serif text-lg text-gold">0{i + 1}</span>
                <div className="my-4 aspect-[3/4] overflow-hidden bg-muted">
                  <ArtImage src={cover.image.thumbnail} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="eyebrow">{p.kicker}</p>
                <h3 className="mt-1 text-3xl group-hover:text-primary">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.intro}</p>
                <p className="mt-auto pt-4 text-xs text-muted-foreground">{visibleCollections(p.id).length} collections</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border py-16">
        <p className="eyebrow">Featured collections</p>
        <h2 className="mt-2 text-4xl md:text-5xl">Start here</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {featured.map((c) => <CollectionCard key={c.id} c={c} variant={c.perspective === "colour" ? "palette" : "default"} />)}
        </div>
      </section>

      <section className="border-t border-border py-16">
        <p className="eyebrow">Selected works</p>
        <h2 className="mt-2 text-4xl md:text-5xl">From glass to tapestry</h2>
        <div className="mt-10 columns-1 gap-8 sm:columns-2 lg:columns-3">
          {picks.map((a) => <ArtworkCard key={a.id} a={a} />)}
        </div>
      </section>

      <section className="grid gap-10 border-t border-border py-16 md:grid-cols-2">
        <div>
          <p className="eyebrow">Compare & combine</p>
          <h2 className="mt-2 text-4xl">Notice relationships</h2>
          <p className="mt-4 text-muted-foreground">Place two works side by side to see what they share — a century, a region, a subject, a palette. Or combine criteria, like <em>Italy AND 14th century AND Angels</em>, to find where collections intersect.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/compare" search={{ a: "art-011", b: "art-003" }} className="bg-primary px-5 py-2.5 text-sm text-primary-foreground">Compare a Sienese altarpiece with the Wilton Diptych</Link>
            <Link to="/explore" search={{ regions: "italy", centuries: "c14", themes: "angels" }} className="border border-foreground px-5 py-2.5 text-sm">Try an intersection</Link>
          </div>
        </div>
        <aside className="border border-border bg-card p-8">
          <p className="eyebrow">Catalogue scope</p>
          <p className="mt-3 font-serif text-2xl leading-snug">{published.length} works from Europe, Byzantium and the Islamic world, approximately 1000–1650.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            This is a growing editorial selection, not a survey of all medieval art. Images come from public-domain or openly licensed files on Wikimedia Commons; each record lists its sources. Across {visibleCollections().length} collections, membership is derived from the catalogue — so the {collectionMembers(getCollection("unknown-makers")!).length} works by unknown makers are counted, not assumed.
          </p>
          <Link to="/about" className="mt-4 inline-flex items-center gap-1 text-sm text-primary">Sources & methodology <ArrowRight className="h-3 w-3" /></Link>
        </aside>
      </section>
    </>
  );
}
