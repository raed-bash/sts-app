import { PaginatedQueryDto } from "./pagingated-results-dto";

export const orderDirs = ["asc", "desc"] as const;

export type OrderDir = (typeof orderDirs)[number];

export class OrderedPaginatedQueryDto extends PaginatedQueryDto {
  orderDir?: OrderDir = "desc";
}

export interface OrderedQueryDto {
  orderBy?: string;

  orderDir?: OrderDir;
}
