import { Document, Types } from 'mongoose';
export type DatabaseDocument = Database & Document;
export declare class Database {
    name: string;
    displayName: string;
    description?: string;
    userId: Types.ObjectId;
    isActive: boolean;
    icon?: string;
    settings?: {
        defaultLanguage?: string;
        timezone?: string;
        dateFormat?: string;
    };
    tags?: string[];
    collectionsCount?: number;
    dataCount?: number;
    createdBy?: string;
    updatedBy?: string;
}
export declare const DatabaseSchema: import("mongoose").Schema<Database, import("mongoose").Model<Database, any, any, any, Document<unknown, any, Database, any, {}> & Database & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Database, Document<unknown, {}, import("mongoose").FlatRecord<Database>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Database> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
