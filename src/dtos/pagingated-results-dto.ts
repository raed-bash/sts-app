export class PaginatedMetadata {
  total!: number;

  lastPage!: number;

  currentPage!: number;

  perPage!: number;

  prev?: number;

  next?: number;
}

export const PER_PAGE = 10;

export class PaginatedQueryDto {
  page: number = 1;

  perPage?: number = PER_PAGE;
}

export class PaginatedResultsDto<T> {
  data: T[] = [];

  meta: PaginatedMetadata = {
    currentPage: 1,
    lastPage: 0,
    perPage: PER_PAGE,
    total: 0,
  };
}
