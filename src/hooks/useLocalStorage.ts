import { useCallback, useState } from "react";
import { LocalStorageHelper } from "src/utils/LocalStorageHelper";

export default function useLocalStorage(
  name,
  defaultValue,
  { onStore = (value) => value, onGet = (value) => value }
) {
  const [value, setValue] = useState(() => {
    const oldValue = onGet(LocalStorageHelper.getItem(name));

    if (oldValue) {
      return oldValue;
    } else {
      LocalStorageHelper.setItem(name, onStore(defaultValue));

      return defaultValue;
    }
  });

  const handleSetValue = useCallback(
    (newValue) => {
      LocalStorageHelper.setItem(name, onStore(newValue));

      setValue(newValue);
    },
    [name, onStore]
  );

  return [value, handleSetValue];
}
