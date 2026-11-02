import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listArtworkPage } from "@/lib/artworks.functions";
import { styles } from "@/data/vocabularies";
import { ArtworkCard, PageHeader } from "@/components/atlas";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 24;
const pageQuery = (category: string, page: number) =>
  queryOptions({ queryKey: ["works", category, page], queryFn: () => listArtworkPage({ data: { category, page, pageSize: PAGE_SIZE } }), staleTime: 60_000 });

export const Route = createFileRoute("/works")({
  validateSearch: (s: Record<string, unknown>) => ({
    category: typeof s["category"] === "string" ? s["category"] : "",
    page: Math.max(1, Number(s["page"]) || 1),
  }),
  loaderDeps: ({ search }) => ({ category: search.category, page: search.page }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(pageQuery(deps.category, deps.page)),
  head: () => ({
    meta: [
      { title: "All works — Medieval Atlas" },
      { name: "description", content: "Browse every published work, filter by style and page through the full catalogue of Netherlandish and medieval art." },
      { property: "og:title", content: "All works — Medieval Atlas" },
      { property: "og:description", content: "Browse and filter the full catalogue, from Bosch and Bruegel to Byzantine icons." },
    ],
  }),
  component: Works,
  errorComponent: ({ error }) => <p role="alert" className="py-20">{(error as Error).message}</p>,
  notFoundComponent: () => <p className="py-20">No works found.</p>,
});

function Works() {
  const { category, page } = Route.useSearch();
  const { data } = useSuspenseQuery(pageQuery(category, page));
  const pages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const pill = (on: boolean) => cn("rounded-full border px-3 py-1 text-xs transition-colors", on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary");
  return (
    <>
      <PageHeader eyebrow="Catalogue" title="All works">
        {data.total} published works{category ? ` in ${styles.find((s) => s.id === category)?.label ?? category}` : ""}. Filter by style; pages are loaded from the database.
      </PageHeader>
      <nav aria-label="Style filter" className="glass sticky top-16 z-30 my-6 flex flex-wrap items-center gap-2 rounded-xl p-3">
        <Link to="/works" search={{ category: "", page: 1 }} resetScroll={false} className={pill(!category)}>All</Link>
        {styles.map((s) => (
          <Link key={s.id} to="/works" search={{ category: s.id, page: 1 }} resetScroll={false} className={pill(category === s.id)}>{s.label}</Link>
        ))}
        {category && <Link to="/works" search={{ category: "", page: 1 }} resetScroll={false} className="ml-auto text-xs text-primary underline">Clear</Link>}
      </nav>
      {data.items.length === 0 ? (
        <p className="py-16 text-muted-foreground">No published works in this style yet.</p>
      ) : (
        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
          {data.items.map((a) => <ArtworkCard key={a.id} a={a} />)}
        </div>
      )}
      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
          {page > 1 && <Link to="/works" search={{ category, page: page - 1 }} className={pill(false)}>← Previous</Link>}
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} to="/works" search={{ category, page: n }} className={pill(n === page)} aria-current={n === page ? "page" : undefined}>{n}</Link>
          ))}
          {page < pages && <Link to="/works" search={{ category, page: page + 1 }} className={pill(false)}>Next →</Link>}
        </nav>
      )}
    </>
  );
}
