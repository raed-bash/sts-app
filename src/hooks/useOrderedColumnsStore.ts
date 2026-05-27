import useLocalStorage from "./useLocalStorage";

export default function useOrderedColumnsStore<T extends string>(
  name: string,
  defaultValue: T[] = []
) {
  const [orderedColumns, setOrderedColumns] = useLocalStorage<T[]>(
    name,
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
    }
  );

  return { orderedColumns, setOrderedColumns };
}
