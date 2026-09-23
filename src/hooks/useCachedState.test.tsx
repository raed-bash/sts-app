import { describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useCachedState } from "./useCachedState";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

describe("useCachedState", () => {
  it("returns the initial value", () => {
    const queryClient = createQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCachedState("count", 1), {
      wrapper,
    });

    expect(result.current[0]).toBe(1);
  });

  it("stores the updated value in the query cache", async () => {
    const queryClient = createQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCachedState("count", 1), {
      wrapper,
    });

    act(() => {
      result.current[1](2);
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(["count"])).toBe(2);
    });
  });

  it("extends to other consumers using the same key", async () => {
    const queryClient = createQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const first = renderHook(() => useCachedState("count", 1), { wrapper });

    act(() => {
      first.result.current[1](5);
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(["count"])).toBe(5);
    });

    const second = renderHook(() => useCachedState("count", 1), { wrapper });

    expect(second.result.current[0]).toBe(5);
  });

  it("evaluates a function default lazily", () => {
    const queryClient = createQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCachedState("value", () => 42), {
      wrapper,
    });

    expect(result.current[0]).toBe(42);
  });

  it("isolates values under different keys", () => {
    const queryClient = createQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const first = renderHook(() => useCachedState("first", 1), { wrapper });
    const second = renderHook(() => useCachedState("second", 2), { wrapper });

    expect(first.result.current[0]).toBe(1);
    expect(second.result.current[0]).toBe(2);
  });
});
