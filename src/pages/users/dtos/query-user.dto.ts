import {
  OrderedPaginatedQueryDto,
  type OrderDir,
  type OrderedQueryDto,
} from "src/dtos/order-paginated-query-dto";
import type { UserDto } from "./user.dto";
import type { UserStatus } from "src/constants/user-status";
import type { UserRole } from "src/constants/user-role";
import type { DefaultSorts } from "src/hooks/useSorts";

export const userOrderAttributes: (keyof UserDto)[] = [
  "id",
  "username",
  "status",
  "role",
  "createdAt",
  "updatedAt",
  "deletedAt",
] as const;

export type UserOrderAttributes = (typeof userOrderAttributes)[number];

export interface QueryUserInput {
  page?: number;
  username?: string;
  status?: UserStatus;
  role?: UserRole;
  fromCreatedAt?: Date | string;
  toCreatedAt?: Date | string;
  fromUpdatedAt?: Date | string;
  toUpdatedAt?: Date | string;
  isDeleted?: boolean | string;
  fromDeletedAt?: Date | string;
  toDeletedAt?: Date | string;
  sorts?: DefaultSorts<UserOrderAttributes>;
}

export class QueryUserDto
  extends OrderedPaginatedQueryDto
  implements OrderedQueryDto
{
  username?: string;

  status?: UserStatus;

  role?: UserRole;

  fromCreatedAt?: Date;

  toCreatedAt?: Date;

  fromUpdatedAt?: Date;

  toUpdatedAt?: Date;

  isDeleted?: boolean = false;

  fromDeletedAt?: Date;

  toDeletedAt?: Date;

  orderBy?: UserOrderAttributes = "id";

  page: number = 1;

  constructor(query: Partial<QueryUserInput>) {
    super();

    Object.assign(this, query);

    if (query.sorts && Object.keys(query.sorts).length > 0) {
      const [orderBy, orderDir] = Object.entries(query.sorts)[0] as [
        UserOrderAttributes,
        OrderDir,
      ];

      this.orderBy = orderBy;

      this.orderDir = orderDir;
    }
  }
}
