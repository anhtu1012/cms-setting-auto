export declare class PaginationDto {
    page?: number;
    limit?: number;
    search?: string;
}
export declare class PaginationResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
