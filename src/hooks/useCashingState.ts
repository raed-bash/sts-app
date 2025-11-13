import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
/**
 *
 * @param {string} queryKey
 * @param {any} defaultData
 * @returns {[any, function]}
 */
export default function useCashingState(queryKey, defaultData) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: () => data,
    initialData: () =>
      typeof defaultData === "function" ? defaultData() : defaultData,
  });

  const { mutate } = useMutation({
    mutationFn: (newValue) => newValue,
    onSuccess: (newValue) => queryClient.setQueryData([queryKey], newValue),
  });

  return [data, mutate];
}
