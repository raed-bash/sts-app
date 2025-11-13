import useLocalStorage from "./useLocalStorage";

export default function useHiddenColumnsLocalStorage(name, defaultValue) {
  const [hiddenColumns, setHiddenColumns] = useLocalStorage(
    name,
    defaultValue,
    {
      onGet: (value) => {
        if (value) {
          try {
            return new Set(JSON.parse(value));
          } catch {
            return defaultValue;
          }
        }
      },
      onStore: (value) => {
        if (value) {
          return JSON.stringify([...value]);
        }
      },
    }
  );

  return { hiddenColumns, setHiddenColumns };
}
