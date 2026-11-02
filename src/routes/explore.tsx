import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArtworkGrid, Chip, PageHeader } from "@/components/atlas";
import { DIMENSIONS, dimensionMeta, query, describeQuery, termLabel, published, undatedCount, type Criteria, type Dimension } from "@/lib/catalogue";
import { fromSearch, toSearch, validateCriteriaSearch } from "@/lib/url-criteria";

export const Route = createFileRoute("/explore")({
  validateSearch: validateCriteriaSearch,
  head: () => ({
    meta: [
      { title: "Intersection explorer — Medieval Atlas" },
      { name: "description", content: "Combine century, region, maker, palette, theme and medium to find where medieval art collections intersect." },
      { property: "og:title", content: "Intersection explorer — Medieval Atlas" },
      { property: "og:description", content: "Combine criteria across five perspectives to find shared medieval artworks." },
    ],
  }),
  component: Explore,
});

const sorts = { date: "Earliest date", "date-desc": "Latest date", title: "Title A–Z" } as const;

function Explore() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/explore" });
  const c = fromSearch(search);
  const sort = (search.sort as keyof typeof sorts) in sorts ? (search.sort as keyof typeof sorts) : "date";
  const set = (next: Partial<Criteria>) => navigate({ search: toSearch({ ...c, ...next }, { sort: search.sort }) });
  const toggle = (d: Dimension, id: string) => set({ [d]: c[d].includes(id) ? c[d].filter((x) => x !== id) : [...c[d], id] });

  const results = useMemo(() => {
    const r = query(c);
    return [...r].sort((x, y) => sort === "title" ? x.title.localeCompare(y.title) : ((x.yearStart ?? 9999) - (y.yearStart ?? 9999)) * (sort === "date-desc" ? -1 : 1));
  }, [JSON.stringify(c), sort]);

  const active = DIMENSIONS.some((d) => c[d].length) || c.yearFrom != null || c.yearTo != null;
  const ranged = c.yearFrom != null || c.yearTo != null;

  return (
    <>
      <PageHeader eyebrow="Discovery tool" title="Explore intersections">
        Combine criteria across perspectives. Different dimensions are joined with <strong>AND</strong>; several choices within one dimension are joined with <strong>OR</strong>.
      </PageHeader>
      <div className="grid gap-10 py-10 lg:grid-cols-[19rem_1fr]">
        <aside className="space-y-7" aria-label="Criteria">
          {DIMENSIONS.map((d) => (
            <fieldset key={d}>
              <legend className="eyebrow mb-2">{dimensionMeta[d].label}</legend>
              <div className="flex flex-wrap gap-1.5">
                {dimensionMeta[d].terms.filter((t) => published.some((a) => matchesOne(a, d, t.id))).map((t) => {
                  const on = c[d].includes(t.id);
                  return (
                    <button key={t.id} type="button" aria-pressed={on} onClick={() => toggle(d, t.id)}
                      className={on ? "border border-primary bg-primary px-2.5 py-1 text-xs text-primary-foreground" : "border border-border px-2.5 py-1 text-xs hover:border-primary"}>
                      {t.label}
                    </button>
                  );
                })}
              </div>
              {d === "themes" && c.themes.length > 1 && (
                <label className="mt-3 flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={!!c.matchAllThemes} onChange={(e) => set({ matchAllThemes: e.target.checked })} className="accent-[var(--color-primary)]" />
                  Match all selected themes
                </label>
              )}
            </fieldset>
          ))}
          <fieldset>
            <legend className="eyebrow mb-2">Custom year range</legend>
            <div className="flex items-center gap-2 text-sm">
              <input type="number" aria-label="From year" placeholder="From" defaultValue={c.yearFrom} key={`f${c.yearFrom}`} onBlur={(e) => set({ yearFrom: e.target.value ? Number(e.target.value) : undefined })} className="w-24 border border-input bg-card px-2 py-1" />
              <span>–</span>
              <input type="number" aria-label="To year" placeholder="To" defaultValue={c.yearTo} key={`t${c.yearTo}`} onBlur={(e) => set({ yearTo: e.target.value ? Number(e.target.value) : undefined })} className="w-24 border border-input bg-card px-2 py-1" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Includes works whose recorded date range overlaps yours — a work <em>may</em> fall within it; its exact date may not be known.</p>
          </fieldset>
        </aside>

        <section aria-live="polite">
          <div className="border border-border bg-card p-5">
            <p className="eyebrow">Your query</p>
            <p className="mt-2 font-serif text-2xl">{describeQuery(c)}</p>
            {active && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {DIMENSIONS.flatMap((d) => c[d].map((id) => <Chip key={d + id} onRemove={() => toggle(d, id)}>{`${dimensionMeta[d].label}: ${termLabel(d, id)}`}</Chip>))}
                {ranged && <Chip onRemove={() => set({ yearFrom: undefined, yearTo: undefined })}>{`Years ${c.yearFrom ?? "…"}–${c.yearTo ?? "…"}`}</Chip>}
                <button onClick={() => navigate({ search: {} })} className="ml-2 text-xs text-primary underline">Clear all</button>
              </div>
            )}
            {ranged && undatedCount() > 0 && <p className="mt-3 text-xs text-muted-foreground">{undatedCount()} works without recorded dates are excluded from year-range queries.</p>}
          </div>

          <div className="flex items-center justify-between py-6 text-sm">
            <p><strong>{results.length}</strong> of {published.length} works</p>
            <label className="flex items-center gap-2">Sort
              <select value={sort} onChange={(e) => navigate({ search: { ...search, sort: e.target.value } })} className="border border-input bg-card px-2 py-1">
                {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>

          {results.length ? <ArtworkGrid items={results} /> : (
            <div className="border border-dashed border-border p-10 text-center">
              <h2 className="text-3xl">No works match every criterion</h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">The catalogue holds no work that satisfies all of these at once. Try removing one criterion:</p>
              <ul className="mt-5 flex flex-wrap justify-center gap-2">
                {DIMENSIONS.filter((d) => c[d].length).map((d) => {
                  const n = query({ ...c, [d]: [] }).length;
                  return <li key={d}><button onClick={() => set({ [d]: [] })} className="border border-border px-3 py-1.5 text-sm hover:border-primary">Without {dimensionMeta[d].label.toLowerCase()} → {n} {n === 1 ? "work" : "works"}</button></li>;
                })}
                {ranged && <li><button onClick={() => set({ yearFrom: undefined, yearTo: undefined })} className="border border-border px-3 py-1.5 text-sm hover:border-primary">Without year range → {query({ ...c, yearFrom: undefined, yearTo: undefined }).length} works</button></li>}
              </ul>
            </div>
          )}
          <p className="mt-10 text-xs text-muted-foreground">This link restores your query. <Link to="/about" className="text-primary">How collections and queries work</Link>.</p>
        </section>
      </div>
    </>
  );
}

function matchesOne(a: (typeof published)[number], d: Dimension, id: string) {
  return query({ [d]: [id] }, [a]).length > 0;
}
