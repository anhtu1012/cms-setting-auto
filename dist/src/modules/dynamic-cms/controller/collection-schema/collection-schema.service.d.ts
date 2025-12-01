import { Model } from 'mongoose';
import { CollectionSchemaModel, CollectionSchemaDocument } from '../../schemas/collection-schema.schema';
import { CreateCollectionSchemaDto, UpdateCollectionSchemaDto } from '../../dto/collection-schema.dto';
import { PaginationDto, PaginationResponse } from '../../../../common/dto/pagination.dto';
import { ValidationResponse } from '../../../../common/dto/validation.dto';
export declare class CollectionSchemaService {
    private collectionSchemaModel;
    constructor(collectionSchemaModel: Model<CollectionSchemaDocument>);
    create(createDto: CreateCollectionSchemaDto, userId: string): Promise<CollectionSchemaModel>;
    findAll(paginationDto: PaginationDto, userId: string, databaseId?: string): Promise<PaginationResponse<CollectionSchemaModel>>;
    findById(id: string, userId: string): Promise<CollectionSchemaModel | null>;
    findByName(name: string, userId: string, databaseId: string): Promise<CollectionSchemaModel | null>;
    findByNamePublic(name: string, databaseId: string): Promise<CollectionSchemaModel | null>;
    findAllSchemas(userId: string, databaseId?: string): Promise<CollectionSchemaModel[]>;
    update(id: string, updateDto: UpdateCollectionSchemaDto, userId: string): Promise<CollectionSchemaModel | null>;
    remove(id: string, userId: string): Promise<CollectionSchemaModel | null>;
    validateData(collectionName: string, userId: string | null, databaseId: string, data: Record<string, any>): Promise<ValidationResponse>;
    validateDataPublic(collectionName: string, databaseId: string, data: Record<string, any>): Promise<ValidationResponse>;
}
