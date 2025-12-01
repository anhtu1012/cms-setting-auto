import { CreateCollectionSchemaDto, UpdateCollectionSchemaDto } from '../../dto/collection-schema.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { CollectionSchemaService } from './collection-schema.service';
export declare class CollectionSchemaController {
    private readonly collectionSchemaService;
    constructor(collectionSchemaService: CollectionSchemaService);
    create(createDto: CreateCollectionSchemaDto, databaseId: string, req: any): Promise<import("../../schemas/collection-schema.schema").CollectionSchemaModel>;
    findAll(paginationDto: PaginationDto, databaseId: string, req: any): Promise<import("../../../../common/dto/pagination.dto").PaginationResponse<import("../../schemas/collection-schema.schema").CollectionSchemaModel>>;
    findAllSchemas(paginationDto: PaginationDto, databaseId: string, req: any): Promise<import("../../../../common/dto/pagination.dto").PaginationResponse<import("../../schemas/collection-schema.schema").CollectionSchemaModel>>;
    findByName(name: string, databaseId: string, req: any): Promise<import("../../schemas/collection-schema.schema").CollectionSchemaModel>;
    findOne(id: string, req: any): Promise<import("../../schemas/collection-schema.schema").CollectionSchemaModel>;
    update(id: string, updateDto: UpdateCollectionSchemaDto, req: any): Promise<import("../../schemas/collection-schema.schema").CollectionSchemaModel>;
    remove(id: string, req: any): Promise<import("../../schemas/collection-schema.schema").CollectionSchemaModel>;
    validateData(collectionName: string, databaseId: string, data: Record<string, any>, req: any): Promise<import("../../../../common/dto/validation.dto").ValidationResponse>;
}
