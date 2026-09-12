import { useLocalStorage } from "./useLocalStorage";

export function useOrderedColumns(name: string, defaultValue: string[] = []) {
  const [orderedColumns, setOrderedColumns] = useLocalStorage<string[]>(
    `${name}Order`,
    defaultValue,
    {
      onGet: (value) => {
        try {
          return JSON.parse(value);
        } catch {
          return defaultValue;
        }
      },
      onStore: (value) => {
        return JSON.stringify([...value]);
      },
    },
  );

  return { orderedColumns, setOrderedColumns };
}
