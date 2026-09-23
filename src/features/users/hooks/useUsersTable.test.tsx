import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useUsersTable } from "./useUsersTable";

const data = [
  {
    id: 1,
    username: "basha",
    status: "ACTIVE" as const,
    role: "STUDENT" as const,
  },
];

const paginated = {
  meta: { total: 1, lastPage: 1, currentPage: 1, perPage: 10, next: null },
  data,
};

vi.mock("../api/get-users.api", () => ({
  useUsers: ({ queryConfig }: { queryConfig: { enabled: boolean } }) => ({
    data: queryConfig.enabled ? paginated : undefined,
    isPending: false,
    isFetching: false,
  }),
  useUsersInfinite: () => ({
    data,
    isPending: false,
    isFetching: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
  }),
}));

describe("useUsersTable", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  it("exposes the table props fed by the paginated query", async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUsersTable(), { wrapper });

    await waitFor(() => {
      expect(result.current.tableProps.data.rows).toEqual(data);
    });

    expect(result.current.tableProps.loading.loading).toBe(false);
    expect(result.current.tableProps.loading.scLoading).toBe(false);
    expect(result.current.tableProps.pagination.loadMore!.hasMore).toBe(true);
  });
});
