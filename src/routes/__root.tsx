import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { useCompare, useBookmarks } from "@/lib/storage";
import { published, setCatalogue } from "@/lib/catalogue";
import { queryOptions } from "@tanstack/react-query";
import { listPublishedArtworks } from "@/lib/artworks.functions";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { BackButton } from "@/components/back-button";

export const catalogueQuery = queryOptions({ queryKey: ["catalogue"], queryFn: () => listPublishedArtworks(), staleTime: 60_000 });

function NotFoundComponent() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Not in the catalogue</p>
      <h1 className="mt-3 text-6xl">Page not found</h1>
      <p className="mt-4 text-muted-foreground">This artwork, collection or page doesn't exist — or its link has changed.</p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="bg-primary px-5 py-2.5 text-sm text-primary-foreground">Home</Link>
        <Link to="/explore" className="border border-foreground px-5 py-2.5 text-sm">Explore the catalogue</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. You can try again or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="bg-primary px-4 py-2 text-sm text-primary-foreground">Try again</button>
          <a href="/" className="border border-input px-4 py-2 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Medieval Atlas" },
      { name: "description", content: "Curated collections of medieval art from Europe and Byzantium, c. 1000–1570." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Uncial+Antiqua&family=IM+Fell+English:ital@0;1&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  // beforeLoad runs before any child loader, so artwork/collection loaders see the catalogue.
  beforeLoad: async ({ context }) => {
    setCatalogue(await context.queryClient.ensureQueryData(catalogueQuery));
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogueQuery),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

const nav = [
  { to: "/perspective/$id", id: "time", label: "Time" },
  { to: "/perspective/$id", id: "regions", label: "Regions" },
  { to: "/perspective/$id", id: "makers", label: "Makers" },
  { to: "/perspective/$id", id: "colour", label: "Colour" },
  { to: "/perspective/$id", id: "themes", label: "Themes" },
] as const;

function Header() {
  const compare = useCompare();
  const saved = useBookmarks();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 px-5 py-3 md:px-8">
        <Link to="/" className="font-display text-2xl text-primary">Medieval <span className="text-gold">Atlas</span></Link>
        <nav aria-label="Perspectives" className="order-3 flex w-full gap-5 overflow-x-auto text-sm md:order-none md:w-auto">
          {nav.map((n) => (
            <Link key={n.id} to={n.to} params={{ id: n.id }} className="whitespace-nowrap text-muted-foreground hover:text-foreground" activeProps={{ className: "text-primary" }}>{n.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-5 text-sm">
          <Link to="/works" className="hover:text-primary" activeProps={{ className: "text-primary" }}>All works</Link>
          <Link to="/explore" className="hover:text-primary" activeProps={{ className: "text-primary" }}>Intersections</Link>
          <Link to="/compare" className="hover:text-primary">Compare{compare.list.length ? ` (${compare.list.length})` : ""}</Link>
          <Link to="/saved" className="hover:text-primary">Saved{saved.list.length ? ` (${saved.list.length})` : ""}</Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-3xl text-accent">Medieval Atlas</p>
          <p className="mt-3 text-sm opacity-70">Selected art from Europe and Byzantium, approximately 1000–1570. {published.length} works published.</p>
        </div>
        <p className="text-sm opacity-70">An editorial selection — not a survey of every medieval tradition. Period labels and date boundaries are conventions, not universal facts.</p>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/about" className="hover:text-accent">Sources & methodology</Link>
          <Link to="/explore" className="hover:text-accent">Intersection explorer</Link>
          <Link to="/saved" className="hover:text-accent">Saved artworks</Link>
          <Link to="/admin" className="hover:text-accent">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  setCatalogue(Route.useLoaderData()); // hydrate the shared catalogue before children render
  const router = useRouter();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
    });
    return () => data.subscription.unsubscribe();
  }, [router]);
  return (
    <QueryClientProvider client={queryClient}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-card focus:px-3 focus:py-2">Skip to content</a>
      <Header />
      <main id="main" className="mx-auto max-w-7xl px-5 md:px-8">
        <BackButton />
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </QueryClientProvider>
  );
}
