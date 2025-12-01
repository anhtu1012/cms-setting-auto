export declare class DatabaseSettingsDto {
    defaultLanguage?: string;
    timezone?: string;
    dateFormat?: string;
}
export declare class CreateDatabaseDto {
    name: string;
    displayName: string;
    description?: string;
    icon?: string;
    settings?: DatabaseSettingsDto;
    tags?: string[];
}
declare const UpdateDatabaseDto_base: import("@nestjs/common").Type<Partial<CreateDatabaseDto>>;
export declare class UpdateDatabaseDto extends UpdateDatabaseDto_base {
    isActive?: boolean;
}
export declare class DatabaseResponseDto {
    id: string;
    name: string;
    displayName: string;
    description?: string;
    userId: string;
    isActive: boolean;
    icon?: string;
    settings?: DatabaseSettingsDto;
    tags?: string[];
    collectionsCount: number;
    dataCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DatabaseListResponseDto {
    data: DatabaseResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export {};
