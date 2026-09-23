import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  renderHook,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useSelectApi, type QueryFn } from "./useSelectApi";
import { PER_PAGE } from "@/shared/dtos/pagingated-results-dto";

type Item = { id: number; name: string };

function meta(overrides: Record<string, unknown> = {}) {
  return {
    total: 2,
    lastPage: 1,
    currentPage: 1,
    perPage: PER_PAGE,
    ...overrides,
  };
}

describe("useSelectApi", () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => React.JSX.Element;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  function List({ queryFn }: { queryFn: QueryFn<Item> }) {
    const { data, listBoxProps } = useSelectApi({
      queryFn,
      queryKey: ["options"],
    });

    const flat = data?.pages.flatMap((page) => page.data) ?? [];

    return (
      <div>
        <ul data-testid="items">
          {flat.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
        <div data-testid="list" {...listBoxProps} />
      </div>
    );
  }

  it("fetches the first page and auto-loads the next through the ref", async () => {
    const queryFn = vi
      .fn<QueryFn<Item>>()
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "a" }],
        meta: meta({ next: 2, lastPage: 2, currentPage: 1 }),
      })
      .mockResolvedValueOnce({
        data: [{ id: 2, name: "b" }],
        meta: meta({ currentPage: 2, lastPage: 2 }),
      });

    render(<List queryFn={queryFn} />, { wrapper });

    await screen.findByText("b");

    expect(queryFn).toHaveBeenCalledTimes(2);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    expect(queryFn).toHaveBeenCalledWith(
      { page: 1, perPage: PER_PAGE },
      expect.any(AbortSignal),
    );
  });

  it("fetches the next page when scroll reaches the end", async () => {
    const queryFn = vi
      .fn<QueryFn<Item>>()
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "a" }],
        meta: meta({ next: 2, lastPage: 2 }),
      })
      .mockResolvedValueOnce({
        data: [{ id: 2, name: "b" }],
        meta: meta({ currentPage: 2, lastPage: 2 }),
      });

    const { result } = renderHook(
      () => useSelectApi({ queryFn, queryKey: ["options"] }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    act(() => {
      result.current.listBoxProps.onScroll({
        currentTarget: { scrollTop: 90, clientHeight: 100, scrollHeight: 100 },
      } as unknown as React.UIEvent<HTMLDivElement, UIEvent>);
    });

    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(2);
    });

    expect(result.current.data?.pages.flatMap((page) => page.data)).toEqual([
      { id: 1, name: "a" },
      { id: 2, name: "b" },
    ]);
  });
});
