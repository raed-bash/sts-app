import { describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import { QueryUserDto } from "../dtos/query-user.dto";
import {
  getUsers,
  getUsersInfiniteQueryOptions,
  getUsersQueryOptions,
} from "./get-users.api";

const paginated = {
  meta: { total: 2, lastPage: 1, currentPage: 1, perPage: 10, next: null },
  data: [{ id: 1, username: "basha", status: "ACTIVE", role: "STUDENT" }],
} as unknown as PaginatedResultsDto<Record<string, unknown>>;

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(async () => ({ data: null })),
  },
}));

const getMock = vi.mocked(api.get);

describe("getUsers api", () => {
  it("maps the query into request params and returns the payload", async () => {
    getMock.mockResolvedValueOnce({ data: paginated });

    const query = new QueryUserDto({ username: "ba", page: 2 });

    const result = await getUsers(query, new AbortController().signal);

    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith("users", {
      params: query,
      signal: expect.any(AbortSignal),
    });
    expect(result).toBe(paginated);
  });

  it("builds paginated query options bound to the query", () => {
    const query = new QueryUserDto({ page: 1 });

    const options = getUsersQueryOptions(query);

    expect(options.queryKey).toEqual(["users", "list", query]);
    expect(options.queryFn).toEqual(expect.any(Function));
  });

  it("builds infinite options with an initial page and a next-page resolver", () => {
    const query = new QueryUserDto({ page: 1 });

    const options = getUsersInfiniteQueryOptions(query);

    expect(options.queryKey).toEqual(["users", "infinite-list", query]);
    expect(options.initialPageParam).toBe(1);

    const getNextPageParam = options.getNextPageParam as unknown as (lastPage: {
      meta: { next: number | null };
    }) => number | null | undefined;

    expect(getNextPageParam({ meta: { next: 2 } })).toBe(2);
    expect(getNextPageParam({ meta: { next: null } })).toBeNull();
  });
});
