// Controlled vocabularies. IDs are stable; labels are for display only.
export type Term = { id: string; label: string; intro?: string };

export const centuries: (Term & { start: number; end: number; context: string })[] = [
  { id: "c11", label: "11th century", start: 1001, end: 1100, context: "Monastic reform, the Norman conquest of England, and a revival of monumental building across western Europe." },
  { id: "c12", label: "12th century", start: 1101, end: 1200, context: "Pilgrimage, growing towns, and early Gothic experiment with light and glass; Constantinople remains a centre of icon painting." },
  { id: "c13", label: "13th century", start: 1201, end: 1300, context: "Great cathedral workshops, the Latin occupation and recovery of Constantinople, and new panel painting in Tuscany." },
  { id: "c14", label: "14th century", start: 1301, end: 1400, context: "Sienese and Florentine painting flourishes; famine and plague reshape European society after 1348." },
  { id: "c15", label: "15th century", start: 1401, end: 1500, context: "Courtly luxury manuscripts, oil painting in the Low Countries, and Florentine altarpieces of extraordinary richness." },
  { id: "c16", label: "16th century", start: 1501, end: 1600, context: "Bosch's late visions and Pieter Bruegel's landscapes and peasant scenes carry Netherlandish painting beyond the Middle Ages." },
];

export const regions: Term[] = [
  { id: "italy", label: "Italy", intro: "City-states such as Florence, Siena and Padua, where panel painting and fresco developed rapidly." },
  { id: "france", label: "France", intro: "Royal and ducal patronage, cathedral glass, and luxurious illuminated manuscripts." },
  { id: "england", label: "England", intro: "Anglo-Norman embroidery and courtly painting connected closely to France." },
  { id: "low-countries", label: "Low Countries", intro: "Flanders and Brabant, home of early oil painting and great tapestry workshops." },
  { id: "byzantium", label: "Byzantium", intro: "The Eastern Roman Empire centred on Constantinople, with its traditions of mosaic and icon." },
  { id: "scandinavia", label: "Scandinavia", intro: "Northern workshops working in walrus ivory and wood, linked to the wider Norse world." },
];

export const styles: Term[] = [
  { id: "byzantine", label: "Byzantine" },
  { id: "romanesque", label: "Romanesque" },
  { id: "gothic", label: "Gothic" },
  { id: "italo-byzantine", label: "Italo-Byzantine" },
  { id: "international-gothic", label: "International Gothic" },
  { id: "early-netherlandish", label: "Early Netherlandish" },
  { id: "northern-renaissance", label: "Northern Renaissance" },
];

export const mediums: Term[] = [
  { id: "panel-painting", label: "Panel painting" },
  { id: "canvas-painting", label: "Painting on canvas" },
  { id: "fresco", label: "Fresco" },
  { id: "manuscript", label: "Illuminated manuscript" },
  { id: "mosaic", label: "Mosaic" },
  { id: "stained-glass", label: "Stained glass" },
  { id: "sculpture", label: "Sculpture & carving" },
  { id: "textile", label: "Textile" },
];

export const palettes: (Term & { swatches: string[] })[] = [
  { id: "gold-and-earth", label: "Gold & Earth", swatches: ["#c58e38", "#8c461d", "#472c1f", "#e6cf9a"], intro: "Gold grounds, ochres and warm browns — the glow of gilded panels and mosaic." },
  { id: "ultramarine", label: "Ultramarine Blue", swatches: ["#1e2846", "#3c5aa6", "#c9a24b", "#e9e3d3"], intro: "Deep blues set against gold or pale grounds, as they appear in these digital images." },
  { id: "crimson-and-green", label: "Crimson & Green", swatches: ["#963d3a", "#3f5a35", "#2a1e18", "#d9c9a8"], intro: "Strong reds paired with greens in costume, hangings and grounds." },
  { id: "stone-and-ivory", label: "Stone & Ivory", swatches: ["#ebe7e6", "#c4b29b", "#968273", "#5e5f5c"], intro: "Quiet pale grounds, ivory, linen and stone, with restrained accents." },
  { id: "jewel-glow", label: "Jewel Glow", swatches: ["#2c3f8a", "#8a1f2b", "#d6a536", "#1d1114"], intro: "Saturated, luminous colour against darkness — glass and miniature at their most intense." },
];

export const themes: Term[] = [
  { id: "virgin-and-child", label: "Virgin and Child", intro: "Mary holding the infant Christ, among the most repeated images of the period." },
  { id: "angels", label: "Angels", intro: "Heavenly attendants, messengers and musicians." },
  { id: "passion", label: "The Passion", intro: "The suffering, death and mourning of Christ." },
  { id: "annunciation", label: "The Annunciation", intro: "The angel Gabriel announcing to Mary that she will bear Christ." },
  { id: "christ-in-majesty", label: "Christ", intro: "Images centred on the figure of Christ as ruler and judge." },
  { id: "adoration", label: "Adoration of the Magi", intro: "Kings from the East bringing gifts to the newborn Christ." },
  { id: "saints", label: "Saints", intro: "Holy figures identified by their attributes." },
  { id: "courtly-life", label: "Courtly Life", intro: "Feasts, fine dress, and the self-presentation of elites." },
  { id: "civic-life", label: "Civic & Everyday Life", intro: "Towns, trades, games and the ordinary world." },
  { id: "history-and-war", label: "History & War", intro: "Events narrated as recent history: oaths, campaigns and conquest." },
  { id: "animals", label: "Animals & Beasts", intro: "Real and imagined creatures, from horses to the unicorn." },
  { id: "portraiture", label: "Portraiture", intro: "Images of specific living people." },
  { id: "judgement-and-hell", label: "Judgement & Hell", intro: "Last Judgements, hellscapes and the fate of souls — Bosch's great subject." },
  { id: "folly-and-moralising", label: "Folly & Moralising", intro: "Fools, proverbs, vices and satire: painting as a mirror held up to human weakness." },
  { id: "peasant-life", label: "Peasant Life", intro: "Weddings, dances, harvests and games — Bruegel's village world." },
  { id: "landscape", label: "Landscape", intro: "Wide views of fields, mountains and winter, where the story often becomes small." },
];

export const vocab = { centuries, regions, styles, mediums, palettes, themes };

export function label(list: Term[], id: string) {
  return list.find((t) => t.id === id)?.label ?? id;
}
