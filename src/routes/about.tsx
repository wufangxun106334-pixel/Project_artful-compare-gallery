import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/atlas";
import { published, artworks } from "@/lib/catalogue";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Sources & methodology — Medieval Atlas" },
      { name: "description", content: "Editorial scope, sources, attribution conventions, dates, palettes and image rights in Medieval Atlas." },
      { property: "og:title", content: "Sources & methodology — Medieval Atlas" },
      { property: "og:description", content: "How the Medieval Atlas catalogue is selected, described and licensed." },
    ],
  }),
  component: About,
});

const sections: [string, string][] = [
  ["Editorial scope", "Selected art from Europe and Byzantium, approximately 1000–1500. This is a small, growing selection — it does not represent every medieval tradition, and 'medieval' is a European periodisation that does not apply everywhere. The Lady and the Unicorn (c. 1500) sits at the edge of the range."],
  ["Source selection", "Images come from Wikimedia Commons files whose licence was checked on the file page (public domain or CC BY). Facts are summarised in original wording from the linked sources. Records marked 'partially verified' have not yet been checked against the holding institution's own catalogue."],
  ["Attribution conventions", "Named artists are given as catalogued. Workshops and collaborations are recorded as such. Each unknown maker is a separate record — 'unknown' never implies a single anonymous artist. Qualifications such as 'probably' are kept."],
  ["Dates", "Each work records a display label and a numeric range. 'c.' means approximately. Year-range searches include any work whose range overlaps yours, so a result may — but need not — fall within it. Works without numeric dates are excluded from year queries and say so."],
  ["Century and style", "Century, style (Byzantine, Romanesque, Gothic…) and cultural context are separate fields. Styles overlap in time and are not date bins."],
  ["Palette methodology", "Representative colours are computed from the downsampled digital image by median-cut quantisation, including frames and backgrounds. They describe a photograph, not original pigments, and no symbolic meaning is attached to them. Palette groups are editorial."],
  ["Collection rules", "Each collection is either a rule (for example: region = Italy) or an explicit list, evaluated against the catalogue by the same query engine used in the explorer. Counts are always derived, never typed in."],
  ["Image rights", "Rights for images are recorded separately from text. Each artwork page links the file page and licence. Public-domain artworks may still have photographer credits, which are given."],
];

function About() {
  return (
    <>
      <PageHeader eyebrow="About" title="Sources & methodology">
        {published.length} works are published ({artworks.filter((a) => a.verificationStatus === "verified").length} fully verified against institutions; the rest partially verified). The catalogue is designed to grow to 100 works without changes to its structure.
      </PageHeader>
      <div className="grid gap-x-16 gap-y-10 py-14 md:grid-cols-2">
        {sections.map(([h, t]) => (
          <section key={h}>
            <h2 className="text-3xl">{h}</h2>
            <div className="rule-gold mt-3 w-16" />
            <p className="mt-4 leading-relaxed text-muted-foreground">{t}</p>
          </section>
        ))}
      </div>
    </>
  );
}
