import { describe, expect, it } from "vitest";
import { keepPreviousData } from "@tanstack/react-query";
import { queryClient } from "./react-query";

describe("queryClient", () => {
  it("keeps previous data and avoids automatic refetches", () => {
    const queries = queryClient.getDefaultOptions().queries;

    expect(queries?.retry).toBe(false);
    expect(queries?.refetchOnWindowFocus).toBe(false);
    expect(queries?.staleTime).toBe(60_000);
    expect(queries?.placeholderData).toBe(keepPreviousData);
  });
});
