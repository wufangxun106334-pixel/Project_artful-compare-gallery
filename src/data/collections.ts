import type { Criteria } from "@/lib/catalogue";
import { centuries, regions, palettes, themes } from "./vocabularies";

export type Perspective = "time" | "regions" | "makers" | "colour" | "themes";

export type Collection = {
  id: string;
  slug: string;
  perspective: Perspective;
  title: string;
  introduction: string;
  essay?: string;
  coverArtworkId: string;
  membership: { type: "rule"; criteria: Partial<Criteria> } | { type: "explicit"; artworkIds: string[] };
  orderedArtworkIds?: string[];
  sources?: { url: string; title: string }[];
};

export const perspectives: { id: Perspective; title: string; kicker: string; intro: string; cover: string }[] = [
  { id: "time", title: "Through Time", kicker: "Chronology", intro: "Move century by century through five hundred years of making, from Norman embroidery to the tapestries of around 1500.", cover: "art-006" },
  { id: "regions", title: "Across Regions", kicker: "Geography & culture", intro: "Where works were made, not where they hang today — from Constantinople to Bruges.", cover: "art-013" },
  { id: "makers", title: "Artists & Workshops", kicker: "Makers", intro: "Named painters, collaborative workshops, and the many makers whose names were never recorded.", cover: "art-005" },
  { id: "colour", title: "Colour Stories", kicker: "Palettes", intro: "Groupings by the colours visible in today's digital images — a way of looking, not a claim about original pigments.", cover: "art-008" },
  { id: "themes", title: "Themes & Symbols", kicker: "Iconography", intro: "Recurring subjects and motifs, and how different media handle them.", cover: "art-011" },
];

const firstOf = (fallback: string, map: Record<string, string>, id: string) => map[id] ?? fallback;

const centuryCovers: Record<string, string> = { c11: "art-006", c12: "art-012", c13: "art-007", c14: "art-002", c15: "art-005", c16: "art-066" };
const regionCovers: Record<string, string> = { italy: "art-013", france: "art-004", england: "art-006", "low-countries": "art-010", byzantium: "art-007", scandinavia: "art-009" };
const paletteCovers: Record<string, string> = { "gold-and-earth": "art-014", ultramarine: "art-003", "crimson-and-green": "art-015", "stone-and-ivory": "art-009", "jewel-glow": "art-008" };
const themeCovers: Record<string, string> = { "virgin-and-child": "art-001", angels: "art-003", passion: "art-010", annunciation: "art-011", "christ-in-majesty": "art-007", adoration: "art-014", saints: "art-011", "courtly-life": "art-004", "civic-life": "art-013", "history-and-war": "art-006", animals: "art-015", portraiture: "art-005", "judgement-and-hell": "art-043", "folly-and-moralising": "art-036", "peasant-life": "art-076", landscape: "art-066" };

export const collections: Collection[] = [
  ...centuries.map((c) => ({
    id: `col-${c.id}`, slug: c.id === "c16" ? "around-1500" : `${c.id.slice(1)}th-century`, perspective: "time" as const,
    title: c.label, introduction: c.context, coverArtworkId: firstOf("art-001", centuryCovers, c.id),
    membership: { type: "rule" as const, criteria: { centuries: [c.id] } },
  })),
  ...regions.map((r) => ({
    id: `col-${r.id}`, slug: r.id, perspective: "regions" as const, title: r.label, introduction: r.intro ?? "",
    coverArtworkId: firstOf("art-001", regionCovers, r.id), membership: { type: "rule" as const, criteria: { regions: [r.id] } },
  })),
  {
    id: "col-tuscan-painters", slug: "tuscan-painters", perspective: "makers", title: "Tuscan Painters, Cimabue to Gentile",
    introduction: "Named painters active in Florence and Siena, whose panels and frescoes shaped Italian painting.",
    essay: "These painters signed or are documented for their works, which is why their names survive. Several worked in collaboration — the Siena Annunciation was shared between Simone Martini and his brother-in-law Lippo Memmi.",
    coverArtworkId: "art-011",
    membership: { type: "rule", criteria: { makers: ["cimabue", "giotto", "simone-martini", "lippo-memmi", "ambrogio-lorenzetti", "gentile-da-fabriano"] } },
    orderedArtworkIds: ["art-001", "art-002", "art-011", "art-013", "art-014"],
  },
  {
    id: "col-bosch", slug: "hieronymus-bosch", perspective: "makers", title: "Hieronymus Bosch",
    introduction: "Visions of paradise, folly and hell from 's-Hertogenbosch — monsters, saints and sinners painted with uncanny precision.",
    coverArtworkId: "art-026", membership: { type: "rule", criteria: { makers: ["hieronymus-bosch"] } },
  },
  {
    id: "col-bruegel", slug: "pieter-bruegel-the-elder", perspective: "makers", title: "Pieter Bruegel the Elder",
    introduction: "Seasons, proverbs and village life: Bruegel turned the peasant world and the wide landscape into great painting.",
    coverArtworkId: "art-066", membership: { type: "rule", criteria: { makers: ["pieter-bruegel"] } },
  },
  {
    id: "col-netherlandish", slug: "masters-of-the-low-countries", perspective: "makers", title: "Masters of the Low Countries",
    introduction: "From Campin and van Eyck to Memling and David: the painters of Flanders and Brabant who perfected oil on panel.",
    coverArtworkId: "art-010", membership: { type: "rule", criteria: { makers: ["robert-campin", "jan-van-eyck", "rogier-van-der-weyden", "dieric-bouts", "hans-memling", "hugo-van-der-goes", "gerard-david", "joachim-patinir"] } },
  },
  {
    id: "col-workshops", slug: "workshops-and-collaborations", perspective: "makers", title: "Workshops & Collaborations",
    introduction: "Works recorded as made by more than one hand: family workshops and painters sharing a commission.",
    coverArtworkId: "art-004", membership: { type: "explicit", artworkIds: ["art-004", "art-011"] },
  },
  {
    id: "col-unknown-makers", slug: "unknown-makers", perspective: "makers", title: "Unknown Makers",
    introduction: "Many objects were made by people whose names were not recorded. Each work here has its own unknown maker — they are not one person.",
    coverArtworkId: "art-008", membership: { type: "explicit", artworkIds: ["art-006", "art-009", "art-012", "art-008", "art-007", "art-003", "art-015"] },
  },
  ...palettes.map((p) => ({
    id: `col-${p.id}`, slug: p.id, perspective: "colour" as const, title: p.label, introduction: p.intro ?? "",
    coverArtworkId: firstOf("art-001", paletteCovers, p.id), membership: { type: "rule" as const, criteria: { palettes: [p.id] } },
  })),
  ...themes.map((t) => ({
    id: `col-${t.id}`, slug: t.id, perspective: "themes" as const, title: t.label, introduction: t.intro ?? "",
    coverArtworkId: firstOf("art-001", themeCovers, t.id), membership: { type: "rule" as const, criteria: { themes: [t.id] } },
  })),
];
