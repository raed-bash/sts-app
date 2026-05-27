export class PaginatedMetadata {
  total!: number;

  lastPage!: number;

  currentPage!: number;

  perPage!: number;

  prev?: number;

  next?: number;
}

export class PaginatedQueryDto {
  page: number = 1;

  perPage?: number = 10;
}

export class PaginatedResultsDto<T> {
  data: T[] = [];

  meta: PaginatedMetadata = {
    currentPage: 1,
    lastPage: 0,
    perPage: 10,
    total: 0,
  };
}
