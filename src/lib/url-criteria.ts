import { DIMENSIONS, emptyCriteria, type Criteria } from "./catalogue";

export type CriteriaSearch = Partial<Record<(typeof DIMENSIONS)[number], string | undefined>> & {
  from?: number | undefined; to?: number | undefined; all?: number | undefined; sort?: string | undefined;
};

const toNum = (v: unknown) => { const n = Number(v); return v !== undefined && v !== "" && Number.isFinite(n) ? Math.round(n) : undefined; };

export function validateCriteriaSearch(s: Record<string, unknown>): CriteriaSearch {
  const out: CriteriaSearch = {};
  for (const d of DIMENSIONS) if (typeof s[d] === "string" && s[d]) out[d] = s[d] as string;
  const from = toNum(s["from"]), to = toNum(s["to"]);
  if (from !== undefined) out.from = from;
  if (to !== undefined) out.to = to;
  if (s["all"] === 1 || s["all"] === "1") out.all = 1;
  if (typeof s["sort"] === "string") out.sort = s["sort"];
  return out;
}

export function fromSearch(s: CriteriaSearch): Criteria {
  const c = emptyCriteria();
  for (const d of DIMENSIONS) c[d] = (s[d] ?? "").split(",").filter(Boolean);
  if (s.from !== undefined) c.yearFrom = s.from;
  if (s.to !== undefined) c.yearTo = s.to;
  c.matchAllThemes = s.all === 1;
  return c;
}

export function toSearch(c: Partial<Criteria>, extra: { sort?: string | undefined } = {}): CriteriaSearch {
  const s: CriteriaSearch = {};
  for (const d of DIMENSIONS) if (c[d]?.length) s[d] = c[d]!.join(",");
  if (c.yearFrom != null) s.from = c.yearFrom;
  if (c.yearTo != null) s.to = c.yearTo;
  if (c.matchAllThemes) s.all = 1;
  if (extra.sort) s.sort = extra.sort;
  return s;
}
