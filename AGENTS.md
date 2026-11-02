<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Catalogue is static TypeScript in src/data; all membership, counts, related works and explorer results go through the single query engine in src/lib/catalogue.ts so they always agree.
- Explorer state lives in URL search params (src/lib/url-criteria.ts) so queries are shareable; bookmarks/compare tray use localStorage via src/lib/storage.ts (useSyncExternalStore, SSR-safe).
- Artwork images are local optimised webp files under public/artworks/<id>/; content workflow is in docs/content-guide.md.
