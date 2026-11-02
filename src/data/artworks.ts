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

// Artwork records live in the database (artworks table); images live in the "artworks" storage bucket
// and are served same-origin through /media/<id>/<file> (src/routes/media.$.ts).
export const ASSET_BASE = "/media";
