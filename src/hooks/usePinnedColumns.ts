import { useLocalStorage } from "./useLocalStorage";

export function usePinnedColumns(
  name: string,
  defaultValue: Set<string> = new Set(),
) {
  const [pinnedColumns, setPinnedColumns] = useLocalStorage(
    `${name}PinnedColumns`,
    defaultValue,
    {
      onGet: (value) => {
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

  return { pinnedColumns, setPinnedColumns };
}
