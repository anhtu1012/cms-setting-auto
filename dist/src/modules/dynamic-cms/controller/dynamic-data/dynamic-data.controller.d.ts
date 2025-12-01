import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { DynamicDataService } from './dynamic-data.service';
export declare class DynamicDataController {
    private readonly dynamicDataService;
    constructor(dynamicDataService: DynamicDataService);
    create(databaseId: string, collectionName: string, data: Record<string, any>, req: any): Promise<import("../../schemas/dynamic-data.schema").DynamicData>;
    findAll(databaseId: string, collectionName: string, paginationDto: PaginationDto, req: any): Promise<import("../../../../common/dto/pagination.dto").PaginationResponse<import("../../schemas/dynamic-data.schema").DynamicData>>;
    query(databaseId: string, collectionName: string, body: {
        filter: Record<string, any>;
        sort?: Record<string, 1 | -1>;
        limit?: number;
        skip?: number;
    }): Promise<import("../../schemas/dynamic-data.schema").DynamicData[]>;
    count(databaseId: string, collectionName: string): Promise<number>;
    findOne(databaseId: string, collectionName: string, id: string, req: any): Promise<import("../../schemas/dynamic-data.schema").DynamicData>;
    update(databaseId: string, collectionName: string, id: string, data: Record<string, any>, req: any): Promise<import("../../schemas/dynamic-data.schema").DynamicData>;
    replace(databaseId: string, collectionName: string, id: string, data: Record<string, any>, req: any): Promise<any>;
    softDelete(databaseId: string, collectionName: string, id: string, req: any): Promise<import("../../schemas/dynamic-data.schema").DynamicData>;
    hardDelete(databaseId: string, collectionName: string, id: string, req: any): Promise<import("../../schemas/dynamic-data.schema").DynamicData>;
    restore(databaseId: string, collectionName: string, id: string, req: any): Promise<import("../../schemas/dynamic-data.schema").DynamicData>;
}
