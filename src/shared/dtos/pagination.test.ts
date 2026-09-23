import { describe, expect, it } from "vitest";
import {
  orderDirs,
  OrderedPaginatedQueryDto,
} from "./order-paginated-query-dto";
import { PaginatedResultsDto, PER_PAGE } from "./pagingated-results-dto";

describe("pagination dtos", () => {
  it("defaults to a desc sort direction", () => {
    const query = new OrderedPaginatedQueryDto();

    expect(query.orderDir).toBe("desc");
    expect(query.page).toBe(1);
    expect(orderDirs).toEqual(["asc", "desc"]);
  });

  it("provides empty results by default", () => {
    const results = new PaginatedResultsDto<string>();

    expect(results.data).toEqual([]);
    expect(results.meta.total).toBe(0);
    expect(results.meta.currentPage).toBe(1);
  });

  it("exposes a positive per page value", () => {
    expect(PER_PAGE).toBeGreaterThan(0);
  });
});
