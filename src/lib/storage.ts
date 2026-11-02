import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
const cache: Record<string, string[]> = {};
const EMPTY: string[] = [];

function read(key: string): string[] {
  if (cache[key]) return cache[key];
  try {
    const v = JSON.parse(window.localStorage.getItem(key) || "[]");
    cache[key] = Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    cache[key] = [];
  }
  return cache[key];
}
function write(key: string, v: string[]) {
  cache[key] = v;
  try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage unavailable: keep in memory */ }
  listeners.forEach((l) => l());
}
export const storageAvailable = () => {
  try { const k = "__ma"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return true; } catch { return false; }
};

function useList(key: string) {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => read(key),
    () => EMPTY,
  );
}

export function useBookmarks() {
  const list = useList("ma.bookmarks");
  return {
    list,
    has: (id: string) => list.includes(id),
    toggle: (id: string) => write("ma.bookmarks", list.includes(id) ? list.filter((x) => x !== id) : [...list, id]),
    remove: (id: string) => write("ma.bookmarks", list.filter((x) => x !== id)),
    clear: () => write("ma.bookmarks", []),
  };
}

/** Compare tray: max two works; adding a third replaces the oldest. */
export function useCompare() {
  const list = useList("ma.compare");
  return {
    list,
    has: (id: string) => list.includes(id),
    toggle: (id: string) => write("ma.compare", list.includes(id) ? list.filter((x) => x !== id) : [...list, id].slice(-2)),
    clear: () => write("ma.compare", []),
  };
}
