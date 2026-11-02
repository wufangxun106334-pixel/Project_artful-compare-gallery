import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArtImage, PageHeader } from "@/components/atlas";
import { getArtwork } from "@/lib/catalogue";
import { useBookmarks, storageAvailable } from "@/lib/storage";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved artworks — Medieval Atlas" },
      { name: "description", content: "Artworks you have bookmarked in this browser." },
      { property: "og:title", content: "Saved artworks — Medieval Atlas" },
      { property: "og:description", content: "Your bookmarked medieval artworks." },
    ],
  }),
  component: Saved,
});

function Saved() {
  const b = useBookmarks();
  const [ok, setOk] = useState(true);
  useEffect(() => setOk(storageAvailable()), []);
  const items = b.list.map((id) => getArtwork(id)).filter((x) => !!x);
  return (
    <>
      <PageHeader eyebrow="Bookmarks" title="Saved artworks">
        Saved in this browser only — nothing is sent anywhere, and bookmarks won't appear on other devices.
        {!ok && <span className="mt-2 block text-destructive">Browser storage is unavailable, so bookmarks will be lost when you leave.</span>}
      </PageHeader>
      {items.length ? (
        <>
          <ul className="divide-y divide-border py-6">
            {items.map((a) => (
              <li key={a.id} className="flex items-center gap-5 py-4">
                <Link to="/artwork/$slug" params={{ slug: a.slug }} className="w-20 shrink-0"><ArtImage src={a.image.thumbnail} alt="" width={a.image.width} height={a.image.height} /></Link>
                <div className="flex-1">
                  <Link to="/artwork/$slug" params={{ slug: a.slug }} className="font-serif text-2xl hover:text-primary">{a.title}</Link>
                  <p className="text-sm text-muted-foreground">{a.makerDisplay} · {a.dateLabel}</p>
                </div>
                <button onClick={() => b.remove(a.id)} className="text-sm text-primary underline">Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={b.clear} className="border border-foreground px-4 py-2 text-sm">Clear all bookmarks</button>
        </>
      ) : (
        <p className="py-14 text-muted-foreground">Nothing saved yet. Use the bookmark button on any artwork. <Link to="/perspective/$id" params={{ id: "colour" }} className="text-primary">Start with Colour Stories →</Link></p>
      )}
    </>
  );
}
