import {
  OrderedPaginatedQueryDto,
  type OrderDir,
  type OrderedQueryDto,
} from "@/shared/dtos/order-paginated-query-dto";
import type { AnswerDto } from "./answer.dto";
import type { DefaultSortStatuses } from "@/hooks";

export const answerOrderAttributes: (keyof AnswerDto)[] = [
  "id",
  "text",
  "correctIndex",
  "isCorrect",
  "order",
] as const;

export type AnswerOrderAttributes = (typeof answerOrderAttributes)[number];

export interface QueryAnswerInput {
  page?: number;
  text?: string;
  questionId?: number;
  orderBy?: AnswerOrderAttributes;
  orderDir?: OrderDir;
  sorts?: DefaultSortStatuses<AnswerOrderAttributes>;
}

export class QueryAnswerDto
  extends OrderedPaginatedQueryDto
  implements OrderedQueryDto
{
  text?: string;

  questionId?: number;

  orderBy?: AnswerOrderAttributes = "id";

  page: number = 1;

  constructor(query: Partial<QueryAnswerInput>) {
    super();

    Object.assign(this, query);

    if (query.sorts && Object.keys(query.sorts).length > 0) {
      const [orderBy, orderDir] = Object.entries(query.sorts)[0] as [
        AnswerOrderAttributes,
        OrderDir,
      ];

      this.orderBy = orderBy;

      this.orderDir = orderDir;
    }
  }
}
