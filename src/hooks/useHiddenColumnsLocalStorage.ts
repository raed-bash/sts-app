import useLocalStorage from "./useLocalStorage";

export default function useHiddenColumnsLocalStorage(
  name: string,
  defaultValue: Set<string> = new Set()
) {
  const [hiddenColumns, setHiddenColumns] = useLocalStorage(
    name,
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
    }
  );

  return { hiddenColumns, setHiddenColumns };
}
