import {
  OrderedPaginatedQueryDto,
  type OrderDir,
  type OrderedQueryDto,
} from "@/shared/dtos/order-paginated-query-dto";
import type { QuestionDto } from "./question.dto";
import type { QuestionType } from "@/constants/question-type";
import type { DefaultSortStatuses } from "@/hooks";

export const questionOrderAttributes: (keyof QuestionDto)[] = [
  "id",
  "text",
  "type",
  "createdAt",
  "updatedAt",
] as const;

export type QuestionOrderAttributes = (typeof questionOrderAttributes)[number];

export interface QueryQuestionInput {
  page?: number;
  perPage?: number;
  text?: string;
  type?: QuestionType;
  testIds?: number[];
  fromCreatedAt?: Date | string;
  toCreatedAt?: Date | string;
  fromUpdatedAt?: Date | string;
  toUpdatedAt?: Date | string;
  isDeleted?: boolean | string;
  fromDeletedAt?: Date | string;
  toDeletedAt?: Date | string;
  isNotAttached?: boolean | string;
  sorts?: DefaultSortStatuses<QuestionOrderAttributes>;
}

export class QueryQuestionDto
  extends OrderedPaginatedQueryDto
  implements OrderedQueryDto
{
  text?: string;

  type?: QuestionType;

  testIds?: number[];

  fromCreatedAt?: Date;

  toCreatedAt?: Date;

  fromUpdatedAt?: Date;

  toUpdatedAt?: Date;

  isDeleted?: boolean = true;

  fromDeletedAt?: Date;

  toDeletedAt?: Date;

  isNotAttached?: boolean;

  orderBy?: QuestionOrderAttributes = "id";

  page: number = 1;

  constructor(query: Partial<QueryQuestionInput>) {
    super();

    Object.assign(this, query);

    if (query.sorts && Object.keys(query.sorts).length > 0) {
      const [orderBy, orderDir] = Object.entries(query.sorts)[0] as [
        QuestionOrderAttributes,
        OrderDir,
      ];

      this.orderBy = orderBy;

      this.orderDir = orderDir;
    }
  }
}