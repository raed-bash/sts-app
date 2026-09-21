import {
  OrderedPaginatedQueryDto,
  type OrderDir,
  type OrderedQueryDto,
} from "@/shared/dtos/order-paginated-query-dto";
import type { TestSessionDto } from "./test-session.dto";
import type { TestSessionStatus } from "@/constants/test-session-status";
import type { DefaultSortStatuses } from "@/hooks";

export const testSessionOrderAttributes: (keyof TestSessionDto)[] = [
  "id",
  "status",
  "startDate",
  "finishDate",
  "updatedAt",
  "deletedAt",
] as const;

export type TestSessionOrderAttributes =
  (typeof testSessionOrderAttributes)[number];

export interface QueryTestSessionInput {
  page?: number;
  perPage?: number;
  status?: TestSessionStatus;
  testId?: number;
  fromStartDate?: Date | string;
  toStartDate?: Date | string;
  fromFinishDate?: Date | string;
  toFinishDate?: Date | string;
  isDeleted?: boolean | string;
  sorts?: DefaultSortStatuses<TestSessionOrderAttributes>;
}

export class QueryTestSessionDto
  extends OrderedPaginatedQueryDto
  implements OrderedQueryDto
{
  status?: TestSessionStatus;

  testId?: number;

  fromStartDate?: Date;

  toStartDate?: Date;

  fromFinishDate?: Date;

  toFinishDate?: Date;

  isDeleted?: boolean = false;

  orderBy?: TestSessionOrderAttributes = "id";

  page: number = 1;

  constructor(query: Partial<QueryTestSessionInput>) {
    super();

    Object.assign(this, query);

    if (query.sorts && Object.keys(query.sorts).length > 0) {
      const [orderBy, orderDir] = Object.entries(query.sorts)[0] as [
        TestSessionOrderAttributes,
        OrderDir,
      ];

      this.orderBy = orderBy;

      this.orderDir = orderDir;
    }
  }
}
