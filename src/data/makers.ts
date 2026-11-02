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
  { id: "robert-campin", name: "Robert Campin", kind: "named", lifeDates: "c. 1375–1444", note: "Tournai painter often identified with the Master of Flémalle." },
  { id: "dieric-bouts", name: "Dieric Bouts", kind: "named", lifeDates: "c. 1415–1475" },
  { id: "hans-memling", name: "Hans Memling", kind: "named", lifeDates: "c. 1430–1494" },
  { id: "hugo-van-der-goes", name: "Hugo van der Goes", kind: "named", lifeDates: "c. 1440–1482" },
  { id: "hieronymus-bosch", name: "Hieronymus Bosch", kind: "named", lifeDates: "c. 1450–1516", note: "Worked in 's-Hertogenbosch; attribution of many panels is debated, and only securely attributed records are included." },
  { id: "gerard-david", name: "Gerard David", kind: "named", lifeDates: "c. 1460–1523" },
  { id: "joachim-patinir", name: "Joachim Patinir", kind: "named", lifeDates: "c. 1480–1524" },
  { id: "pieter-bruegel", name: "Pieter Bruegel the Elder", kind: "named", lifeDates: "c. 1525–1569" },
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
