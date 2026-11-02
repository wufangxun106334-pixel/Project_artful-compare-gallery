# Medieval Atlas — content guide

Catalogue files: `src/data/artworks.ts`, `makers.ts`, `vocabularies.ts`, `collections.ts`.
Images: `public/artworks/<id>/display.webp` (≤1920px) and `thumbnail.webp` (≤600px). Change `ASSET_BASE` in `artworks.ts` to move hosting.
Source register: `sources/source-register.csv`.

## Add one artwork
1. Find a Commons file (or museum open-access image); confirm its licence on the file page.
2. Download a ~1600px version, save `display.webp` and `thumbnail.webp` under `public/artworks/art-0NN/`.
3. Add a record to `artworks.ts` using only vocabulary IDs. Use `null` years and omit fields when unknown — the UI shows "Not recorded". Set `verificationStatus` honestly (`placeholder` records are hidden).
4. Add a line to `sources/source-register.csv`.
5. Run `bunx vitest run` — tests check IDs, vocabularies and membership.

## Add one curated collection
Add an entry to `collections.ts` with a `perspective`, `slug`, `coverArtworkId` and either
`membership: { type: "rule", criteria: { regions: ["italy"], themes: ["angels"] } }` or
`membership: { type: "explicit", artworkIds: [...] }`. Optional `orderedArtworkIds` sets the sequence. Counts are derived automatically.
