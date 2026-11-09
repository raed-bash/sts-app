import { useLocalStorage } from "@/hooks/useLocalStorage";

const onStore = (value: boolean) => String(value);
const onGet = (value: string | null) => value === "true";

/** Per-page "Show deleted" preference; off by default. */
export function useShowDeleted(key: string) {
  return useLocalStorage<boolean>(`${key}ShowDeleted`, false, {
    onStore,
    onGet,
  });
}
