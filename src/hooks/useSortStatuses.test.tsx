import { describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useSortStatuses } from "./useSortStatuses";

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe("useSortStatuses", () => {
  it("swaps to a single active status when not multi", () => {
    const { result } = renderHook(
      () =>
        useSortStatuses(
          "t",
          { colA: "desc" },
          { multi: false, caching: false },
        ),
      { wrapper },
    );

    act(() => {
      result.current.handleSortChange("colB", "asc");
    });

    expect(result.current.sortStatuses).toEqual({ colB: "asc" });
  });

  it("accumulates statuses when multi is enabled", () => {
    const { result } = renderHook(
      () => useSortStatuses("t", {}, { multi: true, caching: false }),
      { wrapper },
    );

    act(() => {
      result.current.handleSortChange("colA", "desc");
    });

    act(() => {
      result.current.handleSortChange("colB", "asc");
    });

    expect(result.current.sortStatuses).toEqual({ colA: "desc", colB: "asc" });
  });

  it("stores statuses in the react-query cache when caching", async () => {
    const { result } = renderHook(() => useSortStatuses("grid"), { wrapper });

    act(() => {
      result.current.handleSortChange("name", "asc");
    });

    await waitFor(() => {
      expect(result.current.sortStatuses).toEqual({ name: "asc" });
    });
  });
});
