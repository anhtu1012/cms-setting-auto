import { Model } from 'mongoose';
import { DynamicData, DynamicDataDocument } from '../../schemas/dynamic-data.schema';
import { CollectionSchemaService } from '../collection-schema/collection-schema.service';
import { PaginationDto, PaginationResponse } from '../../../../common/dto/pagination.dto';
export declare class DynamicDataService {
    private dynamicDataModel;
    private collectionSchemaService;
    constructor(dynamicDataModel: Model<DynamicDataDocument>, collectionSchemaService: CollectionSchemaService);
    private transformDocument;
    private transformDocuments;
    create(collectionName: string, databaseId: string, data: Record<string, any>, userId: string | null): Promise<DynamicData>;
    findAll(collectionName: string, userId: string | null, databaseId: string, paginationDto: PaginationDto, filter?: Record<string, any>): Promise<PaginationResponse<DynamicData>>;
    findById(collectionName: string, id: string, userId: string | null, databaseId: string): Promise<DynamicData | null>;
    update(collectionName: string, id: string, databaseId: string, data: Record<string, any>, userId: string | null): Promise<DynamicData | null>;
    replace(collectionName: string, id: string, databaseId: string, data: Record<string, any>, userId: string | null): Promise<any>;
    softDelete(collectionName: string, id: string, userId: string | null, databaseId: string): Promise<DynamicData | null>;
    hardDelete(collectionName: string, id: string, userId: string | null, databaseId: string): Promise<DynamicData | null>;
    restore(collectionName: string, id: string, userId: string | null, databaseId: string): Promise<DynamicData | null>;
    query(collectionName: string, queryFilter: Record<string, any>, options?: {
        sort?: Record<string, 1 | -1>;
        limit?: number;
        skip?: number;
    }): Promise<DynamicData[]>;
    count(collectionName: string, filter?: Record<string, any>): Promise<number>;
}
