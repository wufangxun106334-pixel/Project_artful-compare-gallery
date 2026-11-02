import { useLocation, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

/** Back control shown on every page except home; falls back to home when there is no history. */
export function BackButton() {
  const router = useRouter();
  const { pathname } = useLocation();
  if (pathname === "/") return null;
  return (
    <div className="pt-5">
      <button
        type="button"
        onClick={() => (window.history.length > 1 ? router.history.back() : router.navigate({ to: "/" }))}
        className="glass glass-hover inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back
      </button>
    </div>
  );
}
