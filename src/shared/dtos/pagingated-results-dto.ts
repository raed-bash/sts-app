const VITE_PER_PAGE = import.meta.env.VITE_PER_PAGE;

export const PER_PAGE = !isNaN(VITE_PER_PAGE) ? parseInt(VITE_PER_PAGE) : 10;

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
