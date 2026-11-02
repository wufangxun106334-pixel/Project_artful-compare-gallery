export type MakerKind = "named" | "conventional" | "workshop" | "anonymous";
export type Maker = { id: string; name: string; kind: MakerKind; lifeDates?: string; note?: string };

// Anonymous makers are recorded per object: "unknown" never implies one person.
export const makers: Maker[] = [
  { id: "cimabue", name: "Cimabue", kind: "named", lifeDates: "c. 1240–1302", note: "Florentine painter; 'Cimabue' is a nickname for Cenni di Pepo." },
  { id: "giotto", name: "Giotto di Bondone", kind: "named", lifeDates: "c. 1267–1337" },
  { id: "simone-martini", name: "Simone Martini", kind: "named", lifeDates: "c. 1284–1344" },
  { id: "lippo-memmi", name: "Lippo Memmi", kind: "named", lifeDates: "active 1317–1347" },
  { id: "ambrogio-lorenzetti", name: "Ambrogio Lorenzetti", kind: "named", lifeDates: "active 1319–1348" },
  { id: "gentile-da-fabriano", name: "Gentile da Fabriano", kind: "named", lifeDates: "c. 1370–1427" },
  { id: "jan-van-eyck", name: "Jan van Eyck", kind: "named", lifeDates: "c. 1390–1441" },
  { id: "rogier-van-der-weyden", name: "Rogier van der Weyden", kind: "named", lifeDates: "c. 1399–1464" },
  { id: "limbourg-brothers", name: "Limbourg brothers", kind: "workshop", note: "Herman, Paul and Johan Limbourg, working together; individual hands are debated." },
  { id: "anon-wilton", name: "Unknown painter (English or French)", kind: "anonymous" },
  { id: "anon-bayeux", name: "Unknown embroiderers", kind: "anonymous", note: "Probably made in England; the designers and embroiderers are not recorded." },
  { id: "anon-hagia-sophia", name: "Unknown Byzantine mosaicists", kind: "anonymous" },
  { id: "anon-chartres", name: "Unknown glaziers of Chartres", kind: "anonymous" },
  { id: "anon-lewis", name: "Unknown carvers", kind: "anonymous", note: "Probably made in Norway, possibly Trondheim." },
  { id: "anon-vladimir", name: "Unknown Constantinopolitan icon painter", kind: "anonymous" },
  { id: "anon-cluny-tapestry", name: "Unknown designer and weavers", kind: "anonymous", note: "Designed probably in Paris; woven probably in the Southern Netherlands." },
];

export const makerKindLabel: Record<MakerKind, string> = {
  named: "Named artist",
  conventional: "Conventional name",
  workshop: "Workshop / collaborative group",
  anonymous: "Unknown maker",
};
