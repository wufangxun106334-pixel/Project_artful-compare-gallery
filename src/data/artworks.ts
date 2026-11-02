export type Artwork = {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  dateLabel: string;
  yearStart: number | null;
  yearEnd: number | null;
  dateNote?: string;
  centuryIds: string[];
  styleIds: string[];
  regionIds: string[];
  creationPlaceLabel?: string;
  culturalContext?: string;
  makerIds: string[];
  makerDisplay: string;
  attributionNote?: string;
  mediumIds: string[];
  materials?: string[];
  dimensions?: string;
  paletteIds: string[];
  representativeColours: string[];
  paletteMethod?: string;
  themeIds: string[];
  institution: string;
  accessionNumber?: string;
  introduction: string;
  visualAnalysis: string;
  interpretation?: string;
  image: {
    original?: string;
    display: string;
    thumbnail: string;
    width?: number;
    height?: number;
    alt: string;
    credit: string;
    rightsLabel: string;
    rightsUrl?: string;
    sourceFilePage?: string;
    originalDownloadUrl?: string;
  };
  sources: { url: string; title: string; accessedAt?: string }[];
  verificationStatus: "verified" | "partial" | "placeholder";
};

// Configurable image host: change this base to move assets without touching components.
export const ASSET_BASE = "/artworks";
const PALETTE_METHOD = "Median-cut quantisation of the downsampled digital image (6 colours, top 5 by area). Includes frames and background; not a pigment analysis.";
const ACCESSED = "2026-11-02";
const PD = { rightsLabel: "Public domain", rightsUrl: "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia" };

function img(id: string, file: string, w: number, h: number, alt: string, credit: string, rights = PD) {
  const page = "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(file.replace(/ /g, "_"));
  return {
    display: `${ASSET_BASE}/${id}/display.webp`,
    thumbnail: `${ASSET_BASE}/${id}/thumbnail.webp`,
    width: w,
    height: h,
    alt,
    credit,
    ...rights,
    sourceFilePage: page,
    originalDownloadUrl: page,
  };
}
const commons = (file: string) => ({
  url: "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(file.replace(/ /g, "_")),
  title: "Wikimedia Commons file record",
  accessedAt: ACCESSED,
});
const wiki = (article: string) => ({
  url: "https://en.wikipedia.org/wiki/" + encodeURIComponent(article.replace(/ /g, "_")),
  title: `Wikipedia: ${article}`,
  accessedAt: ACCESSED,
});

export const artworks: Artwork[] = [
  {
    id: "art-001", slug: "cimabue-santa-trinita-maesta", title: "Maestà of Santa Trinita", originalTitle: "Maestà di Santa Trinita",
    dateLabel: "c. 1280–1300", yearStart: 1280, yearEnd: 1300, dateNote: "Proposed dates vary within the late 13th century.",
    centuryIds: ["c13"], styleIds: ["italo-byzantine", "gothic"], regionIds: ["italy"], creationPlaceLabel: "Florence", culturalContext: "Tuscan altarpiece for the church of Santa Trinita",
    makerIds: ["cimabue"], makerDisplay: "Cimabue", mediumIds: ["panel-painting"], materials: ["Tempera", "Gold leaf", "Wood panel"], dimensions: "385 × 223 cm",
    paletteIds: ["gold-and-earth"], representativeColours: ["#8c461d", "#472c1f", "#c58e38", "#b47428", "#9e662a"], paletteMethod: PALETTE_METHOD,
    themeIds: ["virgin-and-child", "angels"], institution: "Uffizi Galleries, Florence",
    introduction: "A towering altarpiece showing the enthroned Virgin and Child, flanked by tiers of angels, with prophets in arches below the throne.",
    visualAnalysis: "The throne is built up in stacked, tilted planes. Angels are arranged symmetrically in vertical columns, their wings overlapping. A gold ground surrounds the figures, and Mary's dark blue mantle is edged with fine gold lines.",
    interpretation: "Often discussed as a bridge between Byzantine icon conventions and the more spatial painting of Giotto's generation.",
    image: img("art-001", "Cimabue - Maestà di Santa Trinita - Google Art Project.jpg", 1920, 3438, "Tall gold-ground altarpiece: the Virgin enthroned holding the Christ Child, surrounded by eight angels, with four prophets beneath the throne.", "Cimabue, via Google Arts & Culture / Wikimedia Commons"),
    sources: [commons("Cimabue - Maestà di Santa Trinita - Google Art Project.jpg"), wiki("Santa Trinita Maestà")], verificationStatus: "partial",
  },
  {
    id: "art-002", slug: "giotto-lamentation", title: "The Lamentation (The Mourning of Christ)", originalTitle: "Compianto sul Cristo morto",
    dateLabel: "c. 1304–1306", yearStart: 1304, yearEnd: 1306,
    centuryIds: ["c14"], styleIds: ["gothic"], regionIds: ["italy"], creationPlaceLabel: "Padua", culturalContext: "Fresco cycle commissioned by Enrico Scrovegni",
    makerIds: ["giotto"], makerDisplay: "Giotto di Bondone", mediumIds: ["fresco"], materials: ["Fresco on plaster"], dimensions: "c. 200 × 185 cm",
    paletteIds: ["ultramarine", "stone-and-ivory"], representativeColours: ["#5d403e", "#8d8a83", "#826d5b", "#576986", "#b0a99e"], paletteMethod: PALETTE_METHOD,
    themeIds: ["passion", "angels"], institution: "Scrovegni Chapel, Padua (in situ)",
    introduction: "One of the scenes from the life of Christ that cover the walls of the Scrovegni (Arena) Chapel: mourners gather around Christ's body after the Crucifixion.",
    visualAnalysis: "A rocky ridge runs diagonally from upper right down towards the dead Christ at lower left, leading the eye to his head. Two figures in the foreground are seen from behind. Small angels in the blue sky twist in varied poses.",
    interpretation: "Frequently cited for its emotional intensity and the weight given to individual figures.",
    image: img("art-002", "Giotto - Scrovegni - -36- - Lamentation (The Mourning of Christ) adj.jpg", 1000, 925, "Fresco of mourners around the dead Christ beneath a blue sky filled with grieving angels; a bare tree stands on a ridge at upper right.", "Giotto, via Web Gallery of Art / Wikimedia Commons"),
    sources: [commons("Giotto - Scrovegni - -36- - Lamentation (The Mourning of Christ) adj.jpg"), wiki("Scrovegni Chapel")], verificationStatus: "partial",
  },
  {
    id: "art-003", slug: "wilton-diptych-right-panel", title: "The Wilton Diptych (right-hand panel)",
    dateLabel: "c. 1395–1399", yearStart: 1395, yearEnd: 1399,
    centuryIds: ["c14"], styleIds: ["international-gothic"], regionIds: ["england", "france"], creationPlaceLabel: "Not recorded (England or France)", culturalContext: "Private devotional object associated with Richard II of England",
    makerIds: ["anon-wilton"], makerDisplay: "Unknown painter, English or French", attributionNote: "The National Gallery catalogues the work as by an English or French artist.",
    mediumIds: ["panel-painting"], materials: ["Egg tempera", "Gold", "Oak panel"], dimensions: "Each panel c. 53 × 37 cm",
    paletteIds: ["ultramarine", "gold-and-earth"], representativeColours: ["#111d45", "#534f46", "#716448", "#1e2846", "#343541"], paletteMethod: PALETTE_METHOD,
    themeIds: ["virgin-and-child", "angels"], institution: "The National Gallery, London", accessionNumber: "NG4451",
    introduction: "The right wing of a small portable diptych. The Virgin holds the Christ Child, surrounded by angels; the left wing shows Richard II presented by saints.",
    visualAnalysis: "Eleven angels in blue robes crowd closely around the Virgin against a tooled gold ground. Many wear badges with a white hart. The flowered meadow at their feet is rendered as a flat carpet of small plants.",
    interpretation: "The white hart badges are usually read as Richard II's personal emblem, linking the heavenly court to the king.",
    image: img("art-003", "Wilton diptych; right-hand panel.jpg", 1497, 2326, "Small gold-ground panel: the Virgin in a blue mantle holds the Child, surrounded by angels in blue robes on a flowered meadow.", "The National Gallery, London / Wikimedia Commons"),
    sources: [commons("Wilton diptych; right-hand panel.jpg"), wiki("Wilton Diptych"), { url: "https://www.nationalgallery.org.uk/paintings/english-or-french-the-wilton-diptych", title: "The National Gallery: The Wilton Diptych", accessedAt: ACCESSED }],
    verificationStatus: "partial",
  },
  {
    id: "art-004", slug: "tres-riches-heures-january", title: "January, from the Très Riches Heures du duc de Berry", originalTitle: "Les Très Riches Heures du duc de Berry — Janvier",
    dateLabel: "c. 1412–1416", yearStart: 1412, yearEnd: 1416, dateNote: "The calendar miniatures were begun by the Limbourg brothers; the manuscript was completed later by other artists.",
    centuryIds: ["c15"], styleIds: ["international-gothic"], regionIds: ["france"], creationPlaceLabel: "France (court of Jean, duc de Berry)", culturalContext: "Book of hours made for a royal prince",
    makerIds: ["limbourg-brothers"], makerDisplay: "Limbourg brothers", attributionNote: "Attribution of individual calendar pages among the brothers is debated.",
    mediumIds: ["manuscript"], materials: ["Pigments", "Gold", "Vellum"], dimensions: "Page c. 29 × 21 cm",
    paletteIds: ["ultramarine", "jewel-glow"], representativeColours: ["#8b674a", "#525e7f", "#a19171", "#d9d4c1", "#cac4b2"], paletteMethod: PALETTE_METHOD,
    themeIds: ["courtly-life", "animals"], institution: "Musée Condé, Chantilly", accessionNumber: "Ms. 65, fol. 1v",
    introduction: "The January page of the calendar shows the duc de Berry at a New Year feast, receiving guests in front of a tapestry of battle scenes.",
    visualAnalysis: "The duke, in blue, sits at the right before a red-and-gold fire screen. Courtiers crowd the left in brightly coloured robes. A blue semicircle at the top holds the zodiac signs and the sun's chariot.",
    image: img("art-004", "Les Très Riches Heures du duc de Berry Janvier.jpg", 1333, 2062, "Manuscript page of a crowded banquet: the duke in blue at a table laden with dishes, courtiers at left, a battle tapestry behind and a zodiac arc above.", "Musée Condé / R-G Ojéda, RMN, via Wikimedia Commons"),
    sources: [commons("Les Très Riches Heures du duc de Berry Janvier.jpg"), wiki("Très Riches Heures du Duc de Berry")], verificationStatus: "partial",
  },
  {
    id: "art-005", slug: "van-eyck-arnolfini-portrait", title: "The Arnolfini Portrait",
    dateLabel: "1434", yearStart: 1434, yearEnd: 1434, dateNote: "Dated 1434 on the painting.",
    centuryIds: ["c15"], styleIds: ["early-netherlandish"], regionIds: ["low-countries"], creationPlaceLabel: "Bruges", culturalContext: "Portrait of an Italian merchant family resident in Bruges",
    makerIds: ["jan-van-eyck"], makerDisplay: "Jan van Eyck", attributionNote: "Signed on the wall above the mirror.",
    mediumIds: ["panel-painting"], materials: ["Oil", "Oak panel"], dimensions: "82.2 × 60 cm",
    paletteIds: ["crimson-and-green"], representativeColours: ["#1b1a14", "#282918", "#3e2a1f", "#31211a", "#5f5639"], paletteMethod: PALETTE_METHOD,
    themeIds: ["portraiture", "animals"], institution: "The National Gallery, London", accessionNumber: "NG186",
    introduction: "A man and a woman stand in a furnished room, usually identified as a member of the Arnolfini family and his wife.",
    visualAnalysis: "Light from the window at left falls across the woman's green dress and the red bed hangings. A convex mirror at the centre reflects the room and two further figures in the doorway. A small dog stands in the foreground.",
    interpretation: "The identity of the sitters and the meaning of the scene remain debated; it is not securely a record of a wedding.",
    image: img("art-005", "Van Eyck - Arnolfini Portrait.jpg", 1920, 2627, "A man in a dark fur-trimmed robe and a woman in a green dress stand hand in hand in a room with a red bed, a brass chandelier and a round mirror.", "The National Gallery, London / Wikimedia Commons"),
    sources: [commons("Van Eyck - Arnolfini Portrait.jpg"), wiki("Arnolfini Portrait"), { url: "https://www.nationalgallery.org.uk/paintings/jan-van-eyck-the-arnolfini-portrait", title: "The National Gallery: The Arnolfini Portrait", accessedAt: ACCESSED }],
    verificationStatus: "partial",
  },
  {
    id: "art-006", slug: "bayeux-tapestry-harolds-oath", title: "Harold's Oath, scene from the Bayeux Tapestry", originalTitle: "Harold sacramentum fecit Willelmo duci",
    dateLabel: "c. 1070s", yearStart: 1066, yearEnd: 1082, dateNote: "Made after the Norman Conquest of 1066; exact date not recorded.",
    centuryIds: ["c11"], styleIds: ["romanesque"], regionIds: ["england"], creationPlaceLabel: "Probably England", culturalContext: "Anglo-Norman narrative embroidery",
    makerIds: ["anon-bayeux"], makerDisplay: "Unknown embroiderers", mediumIds: ["textile"], materials: ["Wool embroidery", "Linen"], dimensions: "Whole embroidery c. 68 m long, c. 50 cm high",
    paletteIds: ["stone-and-ivory"], representativeColours: ["#604d4a", "#ebe7e6", "#dcd1ca", "#968273", "#f1eeee"], paletteMethod: PALETTE_METHOD,
    themeIds: ["history-and-war"], institution: "Bayeux Museum, Bayeux",
    introduction: "In this scene Harold swears an oath to Duke William, touching two reliquaries. The Latin inscription above reads “Harold made an oath to Duke William”.",
    visualAnalysis: "The figures stand on an unworked linen ground, outlined and filled with coloured wool. Decorative borders run above and below with animals and patterns. Text is stitched directly into the scene.",
    interpretation: "The oath is central to the Norman justification of William's claim to the English throne.",
    image: img("art-006", "Bayeux Tapestry scene23 Harold sacramentum fecit Willelmo duci.jpg", 1920, 1311, "Embroidered scene on pale linen: Harold stands between two reliquaries with hands outstretched while William sits enthroned at left; Latin text above.", "Photograph by Myrabella, via Wikimedia Commons"),
    sources: [commons("Bayeux Tapestry scene23 Harold sacramentum fecit Willelmo duci.jpg"), wiki("Bayeux Tapestry")], verificationStatus: "partial",
  },
  {
    id: "art-007", slug: "hagia-sophia-deesis-christ", title: "Christ Pantocrator, from the Deësis mosaic",
    dateLabel: "Probably after 1261", yearStart: 1261, yearEnd: 1300, dateNote: "Usually dated after the Byzantine recovery of Constantinople in 1261; not recorded precisely.",
    centuryIds: ["c13"], styleIds: ["byzantine"], regionIds: ["byzantium"], creationPlaceLabel: "Constantinople (Istanbul)", culturalContext: "Byzantine church mosaic, south gallery of Hagia Sophia",
    makerIds: ["anon-hagia-sophia"], makerDisplay: "Unknown Byzantine mosaicists", mediumIds: ["mosaic"], materials: ["Glass and stone tesserae", "Gold tesserae"],
    paletteIds: ["gold-and-earth"], representativeColours: ["#b69452", "#676159", "#c5ad7c", "#d4c9bd", "#9b8b6c"], paletteMethod: PALETTE_METHOD,
    themeIds: ["christ-in-majesty"], institution: "Hagia Sophia, Istanbul (in situ)",
    introduction: "The central figure of a Deësis — Christ flanked by the Virgin and John the Baptist, who intercede for humanity. Only the upper part of the mosaic survives.",
    visualAnalysis: "Very small tesserae model the face with soft gradations of tone. Christ raises his right hand in blessing and holds a book. The gold ground has lost areas below, exposing plaster.",
    image: img("art-007", "Christ Pantocrator Deesis mosaic Hagia Sophia.jpg", 1920, 2437, "Mosaic of Christ with a cross-inscribed halo, raising one hand in blessing and holding a jewelled book, against a gold ground.", "Photograph by Myrabella, via Wikimedia Commons"),
    sources: [commons("Christ Pantocrator Deesis mosaic Hagia Sophia.jpg"), wiki("Hagia Sophia")], verificationStatus: "partial",
  },
  {
    id: "art-008", slug: "chartres-belle-verriere", title: "Notre-Dame de la Belle Verrière",
    dateLabel: "c. 1180, with surround c. 1215–1225", yearStart: 1180, yearEnd: 1225, dateNote: "The central Virgin and Child survives from the earlier cathedral; the surrounding angels were added later.",
    centuryIds: ["c12", "c13"], styleIds: ["romanesque", "gothic"], regionIds: ["france"], creationPlaceLabel: "Chartres", culturalContext: "Cathedral window",
    makerIds: ["anon-chartres"], makerDisplay: "Unknown glaziers of Chartres", mediumIds: ["stained-glass"], materials: ["Coloured glass", "Lead", "Paint"],
    paletteIds: ["jewel-glow", "ultramarine"], representativeColours: ["#2d191c", "#1d1114", "#4c4465", "#43191f", "#412937"], paletteMethod: PALETTE_METHOD,
    themeIds: ["virgin-and-child", "angels"], institution: "Chartres Cathedral (in situ)",
    introduction: "A celebrated window in which the crowned Virgin, holding the Christ Child, sits enthroned in luminous blue glass, framed by angels.",
    visualAnalysis: "A pale-blue Virgin stands out from a red ground in the central panels. Smaller angel panels step down each side. Lead lines outline the figures, and black paint draws the faces and folds.",
    image: img("art-008", "Chartres - cathédrale - ND de la belle verrière.JPG", 1378, 3416, "Tall stained-glass window: the crowned Virgin in blue holds the Child on her lap, against red glass, surrounded by panels of angels.", "Photograph by Eusebius, via Wikimedia Commons"),
    sources: [commons("Chartres - cathédrale - ND de la belle verrière.JPG"), wiki("Chartres Cathedral")], verificationStatus: "partial",
  },
  {
    id: "art-009", slug: "lewis-chessmen", title: "The Lewis Chessmen",
    dateLabel: "c. 1150–1200", yearStart: 1150, yearEnd: 1200,
    centuryIds: ["c12"], styleIds: ["romanesque"], regionIds: ["scandinavia"], creationPlaceLabel: "Probably Norway (possibly Trondheim)", culturalContext: "Norse gaming pieces, found on the Isle of Lewis, Scotland, in 1831",
    makerIds: ["anon-lewis"], makerDisplay: "Unknown carvers", mediumIds: ["sculpture"], materials: ["Walrus ivory", "Whale tooth"],
    paletteIds: ["stone-and-ivory"], representativeColours: ["#5e5f5c", "#9d8b7a", "#394047", "#c4b29b", "#eddfbf"], paletteMethod: PALETTE_METHOD,
    themeIds: ["civic-life"], institution: "The British Museum, London (also National Museum of Scotland)", accessionNumber: "Not recorded here (multiple objects)",
    introduction: "A group of chess pieces — kings, queens, bishops, knights and warders — carved from walrus ivory. This photograph shows pieces displayed at the British Museum.",
    visualAnalysis: "Compact figures sit or stand on low bases, with large heads and wide eyes. Queens rest a cheek on one hand. Some warders bite the tops of their shields.",
    image: img("art-009", "Lewis Chessmen, British Museum.jpg", 1920, 1543, "Display of small carved ivory chess figures — seated kings and queens, bishops and standing warders with shields.", "Photograph by APK, via Wikimedia Commons", { rightsLabel: "CC BY 4.0", rightsUrl: "https://creativecommons.org/licenses/by/4.0" }),
    sources: [commons("Lewis Chessmen, British Museum.jpg"), wiki("Lewis chessmen")], verificationStatus: "partial",
  },
  {
    id: "art-010", slug: "van-der-weyden-descent-from-the-cross", title: "The Descent from the Cross", originalTitle: "El Descendimiento",
    dateLabel: "c. 1435, before 1443", yearStart: 1435, yearEnd: 1443,
    centuryIds: ["c15"], styleIds: ["early-netherlandish"], regionIds: ["low-countries"], creationPlaceLabel: "Brabant (for a chapel in Leuven)", culturalContext: "Altarpiece commissioned by the Leuven Guild of Crossbowmen",
    makerIds: ["rogier-van-der-weyden"], makerDisplay: "Rogier van der Weyden", mediumIds: ["panel-painting"], materials: ["Oil", "Oak panel"], dimensions: "204.5 × 261.5 cm",
    paletteIds: ["ultramarine", "gold-and-earth"], representativeColours: ["#333131", "#7e7057", "#5e4d38", "#e8e8e8", "#5a3729"], paletteMethod: PALETTE_METHOD,
    themeIds: ["passion"], institution: "Museo Nacional del Prado, Madrid", accessionNumber: "P002825",
    introduction: "Christ's body is lowered from the cross while the Virgin collapses in grief. Ten figures fill a shallow gilded box like painted sculpture.",
    visualAnalysis: "The Virgin's fainting body repeats the curve of Christ's body above her. Figures are pressed into a shallow space against a gold background. Tears are painted on several faces.",
    image: img("art-010", "Weyden-descendimiento-prado-Ca-1435.jpg", 1920, 1524, "Wide panel of mourners lowering the pale body of Christ from the cross; the Virgin in blue swoons in the foreground against a gold ground.", "Museo Nacional del Prado / Wikimedia Commons"),
    sources: [commons("Weyden-descendimiento-prado-Ca-1435.jpg"), wiki("The Descent from the Cross (van der Weyden)")], verificationStatus: "partial",
  },
  {
    id: "art-011", slug: "simone-martini-annunciation", title: "Annunciation with Saint Margaret and Saint Ansanus",
    dateLabel: "1333", yearStart: 1333, yearEnd: 1333, dateNote: "Signed and dated 1333.",
    centuryIds: ["c14"], styleIds: ["gothic"], regionIds: ["italy"], creationPlaceLabel: "Siena", culturalContext: "Altarpiece for Siena Cathedral",
    makerIds: ["simone-martini", "lippo-memmi"], makerDisplay: "Simone Martini and Lippo Memmi", attributionNote: "The side saints are usually attributed to Lippo Memmi.",
    mediumIds: ["panel-painting"], materials: ["Tempera", "Gold leaf", "Wood panel"], dimensions: "c. 184 × 210 cm (central panel)",
    paletteIds: ["gold-and-earth"], representativeColours: ["#d8ad6c", "#fffdfe", "#6b4632", "#a97c4d", "#c48c53"], paletteMethod: PALETTE_METHOD,
    themeIds: ["annunciation", "angels", "saints"], institution: "Uffizi Galleries, Florence",
    introduction: "Gabriel kneels before Mary, his words of greeting raised in gold letters between them. Two saints stand in the side panels.",
    visualAnalysis: "The gold ground is densely tooled. Mary recoils, drawing her blue mantle close. Gabriel's plaid cloak still seems to flutter behind him. A vase of lilies stands between them.",
    image: img("art-011", "Simone Martini and Lippo Memmi - The Annunciation and Two Saints - WGA15010.jpg", 844, 720, "Gothic gold altarpiece: the kneeling angel Gabriel faces the seated Virgin who turns away, with a saint in each side panel.", "Web Gallery of Art / Wikimedia Commons"),
    sources: [commons("Simone Martini and Lippo Memmi - The Annunciation and Two Saints - WGA15010.jpg"), wiki("Annunciation with St. Margaret and St. Ansanus")], verificationStatus: "partial",
  },
  {
    id: "art-012", slug: "theotokos-of-vladimir", title: "The Virgin of Vladimir",
    dateLabel: "First half of the 12th century", yearStart: 1101, yearEnd: 1150, dateNote: "Brought to Kyiv around 1131; parts have been repainted several times.",
    centuryIds: ["c12"], styleIds: ["byzantine"], regionIds: ["byzantium"], creationPlaceLabel: "Constantinople", culturalContext: "Byzantine icon later venerated in Rus'",
    makerIds: ["anon-vladimir"], makerDisplay: "Unknown Constantinopolitan icon painter", mediumIds: ["panel-painting"], materials: ["Tempera", "Wood panel"], dimensions: "c. 104 × 69 cm",
    paletteIds: ["gold-and-earth"], representativeColours: ["#36302c", "#78675b", "#65524a", "#8b795e", "#968a70"], paletteMethod: PALETTE_METHOD,
    themeIds: ["virgin-and-child"], institution: "State Tretyakov Gallery, Moscow",
    introduction: "An icon of the tender type, in which the Christ Child presses his cheek against his mother's face.",
    visualAnalysis: "The faces are the best-preserved, original areas; much of the surrounding paint is later. Mary's eyes look outward rather than at the child. The child's arm reaches around her neck.",
    image: img("art-012", "Virgin of Vladimir.jpg", 1920, 2796, "Icon of the Virgin in a dark mantle pressing her face against the Christ Child, who embraces her neck, on a worn gold ground.", "Photograph by Michel Bakni, via Wikimedia Commons"),
    sources: [commons("Virgin of Vladimir.jpg"), wiki("Theotokos of Vladimir")], verificationStatus: "partial",
  },
  {
    id: "art-013", slug: "lorenzetti-effects-of-good-government-city", title: "Effects of Good Government in the City",
    originalTitle: "Effetti del Buon Governo in città",
    dateLabel: "1338–1339", yearStart: 1338, yearEnd: 1339,
    centuryIds: ["c14"], styleIds: ["gothic"], regionIds: ["italy"], creationPlaceLabel: "Siena", culturalContext: "Civic fresco cycle in the Sala dei Nove",
    makerIds: ["ambrogio-lorenzetti"], makerDisplay: "Ambrogio Lorenzetti", mediumIds: ["fresco"], materials: ["Fresco on plaster"],
    paletteIds: ["stone-and-ivory", "gold-and-earth"], representativeColours: ["#78644e", "#4c4034", "#95795e", "#9b8974", "#7e776b"], paletteMethod: PALETTE_METHOD,
    themeIds: ["civic-life"], institution: "Palazzo Pubblico, Siena (in situ)",
    introduction: "Part of a fresco cycle for Siena's governing council. A peaceful, busy city is shown under well-ordered rule.",
    visualAnalysis: "Buildings in pink, cream and grey crowd the upper half. In the street below, dancers form a ring, merchants work in open shops and builders stand on a roof. The scene continues on the right into the countryside.",
    image: img("art-013", "Ambrogio Lorenzetti - Effects of Good Government in the city - Google Art Project.jpg", 1920, 925, "Wide fresco of a crowded medieval city: towers and houses above, dancers, traders and builders in the streets below.", "Google Arts & Culture / Wikimedia Commons"),
    sources: [commons("Ambrogio Lorenzetti - Effects of Good Government in the city - Google Art Project.jpg"), wiki("The Allegory of Good and Bad Government")], verificationStatus: "partial",
  },
  {
    id: "art-014", slug: "gentile-da-fabriano-adoration-of-the-magi", title: "Adoration of the Magi (Strozzi Altarpiece)", originalTitle: "Adorazione dei Magi",
    dateLabel: "1423", yearStart: 1423, yearEnd: 1423, dateNote: "Signed and dated 1423.",
    centuryIds: ["c15"], styleIds: ["international-gothic"], regionIds: ["italy"], creationPlaceLabel: "Florence", culturalContext: "Altarpiece commissioned by Palla Strozzi",
    makerIds: ["gentile-da-fabriano"], makerDisplay: "Gentile da Fabriano", mediumIds: ["panel-painting"], materials: ["Tempera", "Gold leaf", "Wood panel"], dimensions: "c. 303 × 282 cm",
    paletteIds: ["gold-and-earth"], representativeColours: ["#704b2c", "#392f25", "#84643e", "#b38851", "#a0713e"], paletteMethod: PALETTE_METHOD,
    themeIds: ["adoration", "virgin-and-child", "courtly-life", "animals"], institution: "Uffizi Galleries, Florence",
    introduction: "The three kings arrive with a vast, splendid retinue of horses, hunting animals and courtiers to kneel before the Child.",
    visualAnalysis: "Raised gilding makes the crowns, spurs and brocades physically stand out from the surface. The procession winds from distant hills at the top down to the foreground. Animals including horses, dogs and monkeys are scattered through the crowd.",
    image: img("art-014", "Gentile da fabriano, adorazione dei magi.jpg", 1920, 1215, "Ornate gold altarpiece: richly dressed kings kneel before the Virgin and Child, followed by a long procession of horses and courtiers.", "Gentile da Fabriano, via Wikimedia Commons"),
    sources: [commons("Gentile da fabriano, adorazione dei magi.jpg"), wiki("Adoration of the Magi (Gentile da Fabriano)")], verificationStatus: "partial",
  },
  {
    id: "art-015", slug: "lady-and-the-unicorn-mon-seul-desir", title: "The Lady and the Unicorn: “À mon seul désir”", originalTitle: "La Dame à la licorne — À mon seul désir",
    dateLabel: "c. 1500", yearStart: 1490, yearEnd: 1510, dateNote: "Approximate; usually dated around 1500.",
    centuryIds: ["c15", "c16"], styleIds: ["gothic"], regionIds: ["france", "low-countries"], creationPlaceLabel: "Designed probably in Paris; woven probably in the Southern Netherlands", culturalContext: "Set of six tapestries for an elite household",
    makerIds: ["anon-cluny-tapestry"], makerDisplay: "Unknown designer and weavers", mediumIds: ["textile"], materials: ["Wool", "Silk"],
    paletteIds: ["crimson-and-green"], representativeColours: ["#4f4345", "#98544b", "#8c827d", "#856a64", "#963d3a"], paletteMethod: PALETTE_METHOD,
    themeIds: ["courtly-life", "animals"], institution: "Musée de Cluny – Musée national du Moyen Âge, Paris",
    introduction: "The sixth tapestry of a famous set. A lady stands before a tent inscribed “À mon seul désir”, flanked by a lion and a unicorn.",
    visualAnalysis: "Figures float on a red ground densely scattered with flowers, small animals and plants (millefleurs). A blue tent dotted with gold frames the lady. The lion and unicorn hold up banners and hold open the tent flaps.",
    interpretation: "The meaning of the motto and of this tapestry in relation to the five senses shown in the others is debated.",
    image: img("art-015", "(Toulouse) Mon seul désir (La Dame à la licorne) - Musée de Cluny Paris.jpg", 1920, 1550, "Tapestry on a red flower-strewn ground: a lady in front of a blue tent, a lion on the left and a unicorn on the right holding banners.", "Photograph by Didier Descouens, via Wikimedia Commons"),
    sources: [commons("(Toulouse) Mon seul désir (La Dame à la licorne) - Musée de Cluny Paris.jpg"), wiki("The Lady and the Unicorn")], verificationStatus: "partial",
  },
];
