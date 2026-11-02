import { describe, expect, it } from "vitest";
import fixture from "./fixtures/artworks.json";
import type { Artwork } from "@/data/artworks";
import { setCatalogue, artworks, collections, collectionMembers, query, published, getCollection, collectionsFor, getArtwork } from "@/lib/catalogue";
import { vocab } from "@/data/vocabularies";
import { makers } from "@/data/makers";
import { fromSearch, toSearch } from "@/lib/url-criteria";

setCatalogue(fixture as unknown as Artwork[]);

describe("catalogue integrity", () => {
  it("has no duplicate artwork ids or slugs", () => {
    expect(new Set(artworks.map((a) => a.id)).size).toBe(artworks.length);
    expect(new Set(artworks.map((a) => a.slug)).size).toBe(artworks.length);
  });
  it("uses only controlled vocabulary ids", () => {
    const ids = (l: { id: string }[]) => new Set(l.map((t) => t.id));
    for (const a of artworks) {
      a.centuryIds.forEach((x) => expect(ids(vocab.centuries).has(x)).toBe(true));
      a.regionIds.forEach((x) => expect(ids(vocab.regions).has(x)).toBe(true));
      a.paletteIds.forEach((x) => expect(ids(vocab.palettes).has(x)).toBe(true));
      a.themeIds.forEach((x) => expect(ids(vocab.themes).has(x)).toBe(true));
      a.mediumIds.forEach((x) => expect(ids(vocab.mediums).has(x)).toBe(true));
      a.makerIds.forEach((x) => expect(ids(makers).has(x)).toBe(true));
    }
  });
  it("every collection cover exists and collection slugs are unique", () => {
    expect(new Set(collections.map((c) => c.slug)).size).toBe(collections.length);
    collections.forEach((c) => expect(artworks.some((a) => a.id === c.coverArtworkId)).toBe(true));
  });
  it("membership and artwork-collection links agree", () => {
    for (const c of collections) for (const a of collectionMembers(c)) expect(collectionsFor(a).map((x) => x.id)).toContain(c.id);
  });
});

describe("intersection query", () => {
  it("ORs within a dimension: France OR England", () => {
    const ids = query({ regions: ["france", "england"] }).map((a) => a.id).sort();
    expect(ids).toEqual(["art-003", "art-004", "art-006", "art-008", "art-015"]);
  });
  it("ANDs across dimensions: Italy AND 14th century AND angels", () => {
    expect(query({ regions: ["italy"], centuries: ["c14"], themes: ["angels"] }).map((a) => a.id).sort()).toEqual(["art-002", "art-011"]);
  });
  it("match-all themes narrows the result", () => {
    expect(query({ themes: ["virgin-and-child", "adoration"] }).length).toBeGreaterThan(1);
    expect(query({ themes: ["virgin-and-child", "adoration"], matchAllThemes: true }).map((a) => a.id)).toEqual(["art-014"]);
  });
  it("year range uses overlap: 1440–1450 includes Descent from the Cross (1435–1443)", () => {
    expect(query({ yearFrom: 1440, yearTo: 1450 }).map((a) => a.id)).toEqual(["art-010"]);
  });
  it("returns an honest empty result rather than substitutes", () => {
    expect(query({ regions: ["byzantium"], mediums: ["textile"] })).toEqual([]);
  });
  it("records with missing metadata still query (Christ mosaic has no dimensions)", () => {
    expect(getArtwork("art-007")!.dimensions).toBeUndefined();
    expect(query({ mediums: ["mosaic"] }).map((a) => a.id)).toEqual(["art-007"]);
  });
  it("round-trips criteria through URL search params", () => {
    const c = { ...fromSearch({}), regions: ["france", "england"], centuries: ["c13"], yearFrom: 1200, matchAllThemes: true, themes: ["angels"] };
    expect(fromSearch(toSearch(c))).toEqual({ ...c, mediums: [], makers: [], palettes: [] });
  });
  it("collection counts come from the catalogue", () => {
    expect(collectionMembers(getCollection("italy")!).length).toBe(published.filter((a) => a.regionIds.includes("italy")).length);
  });
});
