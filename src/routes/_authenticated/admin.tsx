import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Artwork } from "@/data/artworks";
import { rowToArtwork, artworkToRow, type ArtworkRow } from "@/lib/artwork-row";
import { styles, regions, themes, mediums, centuries } from "@/data/vocabularies";
import { makers } from "@/data/makers";
import { PageHeader } from "@/components/atlas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Manage works — Medieval Atlas" },
      { name: "description", content: "Add, edit and remove catalogue works." },
      { property: "og:title", content: "Manage works — Medieval Atlas" },
      { property: "og:description", content: "Catalogue administration." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Row = ArtworkRow & { status: string };

/** Resize in the browser to the two stored variants (long edge 1920 and 1100), never upscaling. */
async function makeVariants(file: File) {
  const bmp = await createImageBitmap(file);
  const variant = async (max: number) => {
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("Could not encode image"))), "image/webp", 0.82));
    return { blob, w, h };
  };
  return { display: await variant(1920), thumbnail: await variant(1100) };
}

function slugify(s: string) {
  return s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
}

function Admin() {
  const navigate = useNavigate();
  const router = useRouter();
  const qc = useQueryClient();
  const role = useQuery({
    queryKey: ["admin-role"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data, error } = await supabase.rpc("has_role", { _user_id: u.user!.id, _role: "admin" });
      if (error) throw error;
      return { isAdmin: !!data, email: u.user?.email ?? "" };
    },
  });
  const rows = useQuery({
    queryKey: ["admin-artworks"],
    enabled: !!role.data?.isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("artworks").select("*").order("sort_order");
      if (error) throw error;
      return data as Row[];
    },
  });
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [filter, setFilter] = useState("");

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  async function refreshAll() {
    await qc.invalidateQueries();
    await router.invalidate();
  }
  async function remove(r: Row) {
    if (!confirm(`Delete “${r.title}”? This removes the record and its images.`)) return;
    const { error } = await supabase.from("artworks").delete().eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    await supabase.storage.from("artworks").remove([`${r.id}/display.webp`, `${r.id}/thumbnail.webp`]);
    toast.success("Deleted");
    refreshAll();
  }

  if (role.isLoading) return <p className="py-20">Checking permissions…</p>;
  if (!role.data?.isAdmin)
    return (
      <>
        <PageHeader eyebrow="Administration" title="Not an administrator">Signed in as {role.data?.email}. This account can view the site but cannot change the catalogue.</PageHeader>
        <button onClick={signOut} className="mt-6 rounded-lg border border-border px-4 py-2 text-sm">Sign out</button>
      </>
    );

  const list = (rows.data ?? []).filter((r) => !filter || `${r.title} ${r.maker_display} ${r.id}`.toLowerCase().includes(filter.toLowerCase()));
  return (
    <>
      <PageHeader eyebrow="Administration" title="Manage works">
        {rows.data?.length ?? "…"} records. Signed in as {role.data.email}.
      </PageHeader>
      <div className="glass sticky top-16 z-30 my-6 flex flex-wrap items-center gap-3 rounded-xl p-3">
        <input placeholder="Search title, maker or id" value={filter} onChange={(e) => setFilter(e.target.value)} className="min-w-60 flex-1 rounded-lg border border-input bg-card px-3 py-1.5 text-sm" />
        <button onClick={() => setEditing("new")} className="rounded-lg bg-primary px-4 py-1.5 text-sm text-primary-foreground">+ New work</button>
        <button onClick={signOut} className="rounded-lg border border-border px-4 py-1.5 text-sm">Sign out</button>
      </div>
      {editing && <Editor row={editing === "new" ? null : editing} allRows={rows.data ?? []} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refreshAll(); }} />}
      <ul className="divide-y divide-border">
        {list.map((r) => (
          <li key={r.id} className="flex items-center gap-4 py-3">
            <img src={r.thumbnail_url || r.image_url} alt="" className="h-16 w-16 rounded-md bg-muted object-contain" loading="lazy" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-lg">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.id} · {r.maker_display} · {styles.find((s) => s.id === r.category)?.label ?? r.category} · order {r.sort_order}</p>
            </div>
            <span className={cn("rounded-full px-2 py-0.5 text-xs", r.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>{r.status}</span>
            <button onClick={() => setEditing(r)} className="rounded-lg border border-border px-3 py-1 text-xs hover:border-primary">Edit</button>
            <button onClick={() => remove(r)} className="rounded-lg border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground">Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

function Editor({ row, allRows, onClose, onSaved }: { row: Row | null; allRows: Row[]; onClose: () => void; onSaved: () => void }) {
  const base: Artwork = row
    ? rowToArtwork(row)
    : ({
        id: `art-${String(Math.max(0, ...allRows.map((r) => Number(r.id.slice(4)) || 0)) + 1).padStart(3, "0")}`,
        slug: "", title: "", dateLabel: "", yearStart: null, yearEnd: null, centuryIds: [], styleIds: ["early-netherlandish"], regionIds: ["low-countries"],
        makerIds: [], makerDisplay: "", mediumIds: ["panel-painting"], paletteIds: [], representativeColours: [], themeIds: [], institution: "",
        introduction: "", visualAnalysis: "", sources: [], verificationStatus: "partial",
        image: { display: "", thumbnail: "", alt: "", credit: "", rightsLabel: "Public domain" },
      } as Artwork);
  const [a, setA] = useState<Artwork>(base);
  const [status, setStatus] = useState<"published" | "draft">((row?.status as "published" | "draft") ?? "draft");
  const [sortOrder, setSortOrder] = useState(row?.sort_order ?? Math.max(0, ...allRows.map((r) => r.sort_order)) + 1);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (p: Partial<Artwork>) => setA((x) => ({ ...x, ...p }));
  const setImg = (p: Partial<Artwork["image"]>) => setA((x) => ({ ...x, image: { ...x.image, ...p } }));
  const toggle = (key: "themeIds" | "regionIds" | "mediumIds" | "makerIds", id: string) =>
    set({ [key]: a[key].includes(id) ? a[key].filter((x) => x !== id) : [...a[key], id] } as Partial<Artwork>);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!a.title.trim()) { toast.error("Title is required"); return; }
    if (!file && !a.image.display) { toast.error("Upload an image"); return; }
    setBusy(true);
    try {
      const rec: Artwork = { ...a, slug: a.slug || slugify(`${a.makerDisplay.split(" ").pop() ?? ""} ${a.title}`) };
      if (rec.yearStart != null && !rec.centuryIds.length) {
        const c = centuries.find((c) => rec.yearStart! >= c.start && rec.yearStart! <= c.end);
        if (c) rec.centuryIds = [c.id];
      }
      if (!rec.image.alt) rec.image.alt = rec.title;
      if (file) {
        const v = await makeVariants(file);
        const bucket = supabase.storage.from("artworks");
        for (const [name, b] of [["display.webp", v.display], ["thumbnail.webp", v.thumbnail]] as const) {
          const { error } = await bucket.upload(`${rec.id}/${name}`, b.blob, { upsert: true, contentType: "image/webp", cacheControl: "3600" });
          if (error) throw error;
        }
        const bust = `?v=${Date.now()}`; // new upload replaces old cached file
        rec.image = { ...rec.image, display: `/media/${rec.id}/display.webp${bust}`, thumbnail: `/media/${rec.id}/thumbnail.webp${bust}`, width: v.display.w, height: v.display.h };
      }
      const payload = artworkToRow(rec, sortOrder, status);
      const { error } = row ? await supabase.from("artworks").update(payload).eq("id", row.id) : await supabase.from("artworks").insert(payload);
      if (error) throw error;
      toast.success(row ? "Saved" : "Created");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full rounded-lg border border-input bg-card px-3 py-1.5 text-sm";
  const pills = (key: "themeIds" | "regionIds" | "mediumIds" | "makerIds", terms: { id: string; label: string }[]) => (
    <div className="flex flex-wrap gap-1.5">
      {terms.map((t) => (
        <button key={t.id} type="button" onClick={() => toggle(key, t.id)} className={cn("rounded-full border px-2.5 py-0.5 text-xs", a[key].includes(t.id) ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{t.label}</button>
      ))}
    </div>
  );
  return (
    <form onSubmit={save} className="glass mb-8 grid gap-4 rounded-xl p-6 md:grid-cols-2">
      <h2 className="text-2xl md:col-span-2">{row ? `Edit ${row.id}` : `New work (${a.id})`}</h2>
      <label className="text-sm">Title<input className={input} value={a.title} onChange={(e) => set({ title: e.target.value })} required /></label>
      <label className="text-sm">Slug (URL)<input className={input} value={a.slug} placeholder="auto from maker + title" onChange={(e) => set({ slug: slugify(e.target.value) })} /></label>
      <label className="text-sm md:col-span-2">Description<textarea className={input} rows={3} value={a.introduction} onChange={(e) => set({ introduction: e.target.value })} /></label>
      <label className="text-sm md:col-span-2">Visual analysis<textarea className={input} rows={3} value={a.visualAnalysis} onChange={(e) => set({ visualAnalysis: e.target.value })} /></label>
      <label className="text-sm">Category (style)
        <select className={input} value={a.styleIds[0]} onChange={(e) => set({ styleIds: [e.target.value] })}>{styles.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
      </label>
      <label className="text-sm">Maker as displayed<input className={input} value={a.makerDisplay} onChange={(e) => set({ makerDisplay: e.target.value })} /></label>
      <label className="text-sm">Date label<input className={input} value={a.dateLabel} placeholder="c. 1565" onChange={(e) => set({ dateLabel: e.target.value })} /></label>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <label>Year from<input type="number" className={input} value={a.yearStart ?? ""} onChange={(e) => set({ yearStart: e.target.value ? Number(e.target.value) : null, centuryIds: [] })} /></label>
        <label>Year to<input type="number" className={input} value={a.yearEnd ?? ""} onChange={(e) => set({ yearEnd: e.target.value ? Number(e.target.value) : null })} /></label>
      </div>
      <label className="text-sm">Institution<input className={input} value={a.institution} onChange={(e) => set({ institution: e.target.value })} /></label>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <label>Sort order<input type="number" className={input} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></label>
        <label>Status<select className={input} value={status} onChange={(e) => setStatus(e.target.value as "published" | "draft")}><option value="published">Published</option><option value="draft">Draft (hidden)</option></select></label>
      </div>
      <div className="text-sm md:col-span-2"><p className="mb-1">Makers</p>{pills("makerIds", makers.map((m) => ({ id: m.id, label: m.name })))}</div>
      <div className="text-sm"><p className="mb-1">Regions</p>{pills("regionIds", regions)}</div>
      <div className="text-sm"><p className="mb-1">Medium</p>{pills("mediumIds", mediums)}</div>
      <div className="text-sm md:col-span-2"><p className="mb-1">Themes</p>{pills("themeIds", themes)}</div>
      <label className="text-sm">Image credit<input className={input} value={a.image.credit} onChange={(e) => setImg({ credit: e.target.value })} /></label>
      <label className="text-sm">Rights<input className={input} value={a.image.rightsLabel} onChange={(e) => setImg({ rightsLabel: e.target.value })} /></label>
      <label className="text-sm">Source file page (URL)<input className={input} value={a.image.sourceFilePage ?? ""} onChange={(e) => setImg({ sourceFilePage: e.target.value })} /></label>
      <label className="text-sm">Alt text<input className={input} value={a.image.alt} onChange={(e) => setImg({ alt: e.target.value })} /></label>
      <div className="text-sm md:col-span-2">
        <p className="mb-1">Image {a.image.width ? `(current ${a.image.width}×${a.image.height})` : ""}</p>
        <div className="flex items-center gap-4">
          {(file || a.image.thumbnail) && <img src={file ? URL.createObjectURL(file) : a.image.thumbnail} alt="" className="h-24 w-24 rounded-md bg-muted object-contain" />}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Stored as 1920px and 1100px WebP versions; smaller images are never enlarged.</p>
      </div>
      <div className="flex gap-3 md:col-span-2">
        <button disabled={busy} className="rounded-lg bg-primary px-5 py-2 text-sm text-primary-foreground disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
        <button type="button" onClick={onClose} className="rounded-lg border border-border px-5 py-2 text-sm">Cancel</button>
      </div>
    </form>
  );
}
