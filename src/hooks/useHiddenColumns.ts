import { useLocalStorage } from "./useLocalStorage";

export function useHiddenColumns(
  name: string,
  defaultValue: Set<string> = new Set(),
) {
  const [hiddenColumns, setHiddenColumns] = useLocalStorage(
    `${name}HiddenColumns.v2`,
    defaultValue,
    {
      onGet: (value) => {
        if (!value) return defaultValue; // nothing stored yet
        try {
          return new Set<string>(JSON.parse(value));
        } catch {
          return defaultValue;
        }
      },
      onStore: (value: Set<string>) => {
        return JSON.stringify([...value]);
      },
    },
  );

  return { hiddenColumns, setHiddenColumns };
}
