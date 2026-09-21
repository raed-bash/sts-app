export const settingsQueryKeys = {
  all: ["settings"] as const,
  list: () => [...settingsQueryKeys.all, "list"] as const,
  byKey: (key: string) => [...settingsQueryKeys.all, key] as const,
};
