import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/atlas";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin sign in — Medieval Atlas" },
      { name: "description", content: "Sign in to manage the Medieval Atlas catalogue." },
      { property: "og:title", content: "Admin sign in — Medieval Atlas" },
      { property: "og:description", content: "Catalogue administration sign-in." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin" });
        else toast.success("Check your email to confirm your account, then sign in.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full rounded-lg border border-input bg-card px-3 py-2";
  return (
    <>
      <PageHeader eyebrow="Administration" title={mode === "signin" ? "Sign in" : "Create the admin account"}>
        Only administrators can add, edit or delete works. The first account created becomes the administrator.
      </PageHeader>
      <form onSubmit={submit} className="glass my-10 max-w-md space-y-4 rounded-xl p-6">
        <label className="block text-sm">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} autoComplete="email" /></label>
        <label className="block text-sm">Password<input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={input} autoComplete={mode === "signin" ? "current-password" : "new-password"} /></label>
        <button disabled={busy} className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50">{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full text-xs text-primary underline">
          {mode === "signin" ? "No account yet? Create one" : "Already have an account? Sign in"}
        </button>
      </form>
    </>
  );
}
