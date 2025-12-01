import { Document, Types } from 'mongoose';
import { FieldDefinition } from '../interfaces/field-types.interface';
export type CollectionSchemaDocument = CollectionSchemaModel & Document;
export declare class CollectionSchemaModel {
    databaseId: Types.ObjectId;
    userId: Types.ObjectId;
    name: string;
    displayName: string;
    description?: string;
    icon?: string;
    fields: FieldDefinition[];
    timestamps: boolean;
    softDelete: boolean;
    enableApi: boolean;
    apiPath?: string;
    permissions?: {
        create?: string[];
        read?: string[];
        update?: string[];
        delete?: string[];
    };
    createdBy?: string;
    updatedBy?: string;
    version: number;
    dataCount?: number;
}
export declare const CollectionSchemaSchema: import("mongoose").Schema<CollectionSchemaModel, import("mongoose").Model<CollectionSchemaModel, any, any, any, Document<unknown, any, CollectionSchemaModel, any, {}> & CollectionSchemaModel & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CollectionSchemaModel, Document<unknown, {}, import("mongoose").FlatRecord<CollectionSchemaModel>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<CollectionSchemaModel> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
