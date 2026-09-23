import { useCallback, useState } from "react";
import { LocalStorageHelper } from "@/shared/utils";

type UseLocalStorageOptions<T> = {
  onStore: (value: T) => string;
  onGet: (value: string) => T;
};

const DEFAULT_OPTIONS: UseLocalStorageOptions<unknown> = {
  onStore: (value) => value as string,
  onGet: (value) => value as unknown,
};

export function useLocalStorage<T>(
  name: string,
  defaultValue: T,
  options?: UseLocalStorageOptions<T>,
): [T, (value: T) => void] {
  const { onStore, onGet } =
    options ?? (DEFAULT_OPTIONS as UseLocalStorageOptions<T>);

  const [storedValue, setStoredValue] = useState<T>(() => {
    const oldValue = onGet(LocalStorageHelper.getItem(name));

    if (oldValue) {
      return oldValue;
    } else {
      LocalStorageHelper.setItem(name, onStore(defaultValue));

      return defaultValue;
    }
  });

  const setValue = useCallback(
    (newValue: T) => {
      LocalStorageHelper.setItem(name, onStore(newValue));

      setStoredValue(newValue);
    },
    [name, onStore],
  );

  return [storedValue, setValue];
}
