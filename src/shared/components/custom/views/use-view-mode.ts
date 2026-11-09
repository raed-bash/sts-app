import { useLocalStorage } from "@/hooks/useLocalStorage";

export type ViewMode = "cards" | "table";

const onStore = (value: ViewMode) => value;

/** Remembers, per page, whether the user prefers cards or the table. */
export function useViewMode(key: string, fallback: ViewMode = "cards") {
  return useLocalStorage<ViewMode>(`${key}ViewMode`, fallback, {
    onStore,
    onGet: (value) =>
      value === "cards" || value === "table" ? value : fallback,
  });
}
