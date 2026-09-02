import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Updater<T> = (value: T) => void;

export default function useCachingState<T>(
  queryKey: string,
  defaultData: T | (() => T),
): readonly [T, Updater<T>] {
  const queryClient = useQueryClient();

  const { data } = useQuery<T>({
    queryKey: [queryKey],
    queryFn: (c) => {
      const data = c.client.getQueryData<T>([queryKey]);

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

  const { mutate } = useMutation<T, Error, T>({
    mutationFn: async (newValue: T) => newValue,
    onSuccess: (newValue) => {
      queryClient.setQueryData<T>([queryKey], newValue);
    },
  });

  return [data as T, mutate] as const;
}
