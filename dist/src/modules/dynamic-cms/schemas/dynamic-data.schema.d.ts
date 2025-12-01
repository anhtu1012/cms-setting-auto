import { Document, Types } from 'mongoose';
export type DynamicDataDocument = DynamicData & Document;
export declare class DynamicData {
    userId?: Types.ObjectId;
    databaseId: Types.ObjectId;
    _collection: string;
    _data: Record<string, any>;
    deletedAt?: Date | null;
    createdBy?: string;
    updatedBy?: string;
}
export declare const DynamicDataSchema: import("mongoose").Schema<DynamicData, import("mongoose").Model<DynamicData, any, any, any, Document<unknown, any, DynamicData, any, {}> & DynamicData & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DynamicData, Document<unknown, {}, import("mongoose").FlatRecord<DynamicData>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<DynamicData> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
