import {
  OrderedPaginatedQueryDto,
  type OrderDir,
  type OrderedQueryDto,
} from "@/shared/dtos/order-paginated-query-dto";
import type { SubjectDto } from "./subject.dto";
import type { DefaultSortStatuses } from "@/hooks";

export const subjectOrderAttributes: (keyof SubjectDto)[] = [
  "id",
  "name",
  "createdAt",
  "updatedAt",
] as const;

export type SubjectOrderAttributes = (typeof subjectOrderAttributes)[number];

export interface QuerySubjectInput {
  page?: number;
  perPage?: number;
  name?: string;
  testIds?: number[];
  fromCreatedAt?: Date | string;
  toCreatedAt?: Date | string;
  fromUpdatedAt?: Date | string;
  toUpdatedAt?: Date | string;
  isDeleted?: boolean | string;
  fromDeletedAt?: Date | string;
  toDeletedAt?: Date | string;
  sorts?: DefaultSortStatuses<SubjectOrderAttributes>;
}

export class QuerySubjectDto
  extends OrderedPaginatedQueryDto
  implements OrderedQueryDto
{
  name?: string;

  testIds?: number[];

  fromCreatedAt?: Date;

  toCreatedAt?: Date;

  fromUpdatedAt?: Date;

  toUpdatedAt?: Date;

  isDeleted?: boolean = true;

  fromDeletedAt?: Date;

  toDeletedAt?: Date;

  orderBy?: SubjectOrderAttributes = "id";

  page: number = 1;

  constructor(query: Partial<QuerySubjectInput>) {
    super();

    Object.assign(this, query);

    if (query.sorts && Object.keys(query.sorts).length > 0) {
      const [orderBy, orderDir] = Object.entries(query.sorts)[0] as [
        SubjectOrderAttributes,
        OrderDir,
      ];

      this.orderBy = orderBy;

      this.orderDir = orderDir;
    }
  }
}
