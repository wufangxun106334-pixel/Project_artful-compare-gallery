import { useState } from "react";
import { ZoomIn, ZoomOut, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";

export function ZoomDialog({ open, onOpenChange, src, alt, title }: { open: boolean; onOpenChange: (o: boolean) => void; src: string; alt: string; title: string }) {
  const [z, setZ] = useState(1);
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setZ(1); }}>
      <DialogContent className="flex h-[92vh] max-w-[96vw] flex-col gap-3 border-none bg-ink p-3 text-ink-foreground sm:rounded-none [&>button:last-child]:hidden">
        <div className="flex items-center gap-2">
          <DialogTitle className="mr-auto truncate font-serif text-xl font-normal">{title}</DialogTitle>
          <button onClick={() => setZ((v) => Math.max(1, v - 0.5))} disabled={z <= 1} aria-label="Zoom out" className="p-2 hover:text-accent disabled:opacity-40"><ZoomOut className="h-5 w-5" /></button>
          <span className="w-12 text-center text-xs tabular-nums">{Math.round(z * 100)}%</span>
          <button onClick={() => setZ((v) => Math.min(4, v + 0.5))} disabled={z >= 4} aria-label="Zoom in" className="p-2 hover:text-accent disabled:opacity-40"><ZoomIn className="h-5 w-5" /></button>
          <DialogClose aria-label="Close (Esc)" className="p-2 hover:text-accent"><X className="h-5 w-5" /></DialogClose>
        </div>
        <div className="flex-1 overflow-auto" tabIndex={0} aria-label="Zoomable image; scroll to pan">
          <img src={src} alt={alt} style={{ width: `${z * 100}%`, maxWidth: z === 1 ? "100%" : "none" }} className={z === 1 ? "mx-auto h-full w-auto object-contain" : "h-auto"} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
