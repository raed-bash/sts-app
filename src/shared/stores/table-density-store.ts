import { useSyncExternalStore } from "react";
import type { TableDensity } from "@/shared/components/custom/table/constants/table-density";
import { LocalStorageHelper } from "@/shared/utils/local-storage-helper";

const TABLE_DENSITY_STORAGE_KEY = "table-density";

const isTableDensity = (value: string | null): value is TableDensity =>
  ["compact", "comfortable", "roomy"].includes(value as string);

const getInitialDensity = (): TableDensity => {
  const stored = LocalStorageHelper.getItem(TABLE_DENSITY_STORAGE_KEY);

  return isTableDensity(stored) ? stored : "comfortable";
};

let density: TableDensity = getInitialDensity();

const listeners = new Set<() => void>();

const emit = () => {
  for (const listener of listeners) listener();
};

const handleStorageEvent = (event: StorageEvent) => {
  if (event.key !== TABLE_DENSITY_STORAGE_KEY) return;

  density = getInitialDensity();

  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  window.addEventListener("storage", handleStorageEvent);

  return () => {
    listeners.delete(listener);

    window.removeEventListener("storage", handleStorageEvent);
  };
};

const getSnapshot = (): TableDensity => density;

export function setTableDensity(value: TableDensity) {
  if (!isTableDensity(value)) return;

  density = value;

  LocalStorageHelper.setItem(TABLE_DENSITY_STORAGE_KEY, value);

  emit();
}

export function useTableDensity(): [TableDensity, typeof setTableDensity] {
  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return [value, setTableDensity];
}
