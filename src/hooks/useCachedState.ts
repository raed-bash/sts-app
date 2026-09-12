import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type SetData<T> = (value: T) => void;

export function useCachedState<T>(
  name: string,
  defaultData: T | (() => T),
): readonly [T, SetData<T>] {
  const queryClient = useQueryClient();

  const { data } = useQuery<T>({
    queryKey: [name],
    queryFn: (c) => {
      const data = c.client.getQueryData<T>([name]);

      if (data) {
        return data;
      }
      // This will only run if no cached/initial data exists
      return typeof defaultData === "function"
        ? (defaultData as () => T)()
        : defaultData;
    },
    initialData:
      typeof defaultData === "function"
        ? (defaultData as () => T)()
        : defaultData,
  });

  const { mutate: setData } = useMutation<T, Error, T>({
    mutationFn: async (newValue: T) => newValue,
    onSuccess: (newValue) => {
      queryClient.setQueryData<T>([name], newValue);
    },
  });

  return [data as T, setData] as const;
}
