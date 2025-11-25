export class PaginationDto {
  page?: number = 1;
  limit?: number = 10;
  search?: string;
}

export class PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
