import { useCallback, useState } from "react";
import { LocalStorageHelper } from "src/utils/LocalStorageHelper";

export default function useLocalStorage<T>(
  name: string,
  defaultValue: T,
  { onStore, onGet } = {
    onStore: (value: T) => value as string,
    onGet: (value: string) => value as T,
  }
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const oldValue = onGet(LocalStorageHelper.getItem(name));

    if (oldValue) {
      return oldValue;
    } else {
      LocalStorageHelper.setItem(name, onStore(defaultValue));

      return defaultValue;
    }
  });

  const handleSetValue = useCallback(
    (newValue: T) => {
      LocalStorageHelper.setItem(name, onStore(newValue));

      setValue(newValue);
    },
    [name, onStore]
  );

  return [value, handleSetValue];
}
