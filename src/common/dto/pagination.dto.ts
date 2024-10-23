export class PaginationReceivedDto {
  page: number;
  limit: number;
}

export class PaginatorDto<T> {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  data: T[];
}
