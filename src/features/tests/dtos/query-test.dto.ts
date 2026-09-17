import {
  OrderedPaginatedQueryDto,
  type OrderDir,
  type OrderedQueryDto,
} from "@/shared/dtos/order-paginated-query-dto";
import type { TestDto } from "./test.dto";
import type { DefaultSortStatuses } from "@/hooks";

export const testOrderAttributes: (keyof TestDto)[] = [
  "id",
  "name",
  "createdAt",
  "updatedAt",
] as const;

export type TestOrderAttributes = (typeof testOrderAttributes)[number];

export interface QueryTestInput {
  page?: number;
  perPage?: number;
  name?: string;
  subjectIds?: number[];
  fromCreatedAt?: Date | string;
  toCreatedAt?: Date | string;
  fromUpdatedAt?: Date | string;
  toUpdatedAt?: Date | string;
  isDeleted?: boolean | string;
  fromDeletedAt?: Date | string;
  toDeletedAt?: Date | string;
  isNotAttached?: boolean | string;
  sorts?: DefaultSortStatuses<TestOrderAttributes>;
}

export class QueryTestDto
  extends OrderedPaginatedQueryDto
  implements OrderedQueryDto
{
  name?: string;

  subjectIds?: number[];

  fromCreatedAt?: Date;

  toCreatedAt?: Date;

  fromUpdatedAt?: Date;

  toUpdatedAt?: Date;

  isDeleted?: boolean = true;

  fromDeletedAt?: Date;

  toDeletedAt?: Date;

  isNotAttached?: boolean;

  orderBy?: TestOrderAttributes = "id";

  page: number = 1;

  constructor(query: Partial<QueryTestInput>) {
    super();

    Object.assign(this, query);

    if (query.sorts && Object.keys(query.sorts).length > 0) {
      const [orderBy, orderDir] = Object.entries(query.sorts)[0] as [
        TestOrderAttributes,
        OrderDir,
      ];

      this.orderBy = orderBy;

      this.orderDir = orderDir;
    }
  }
}