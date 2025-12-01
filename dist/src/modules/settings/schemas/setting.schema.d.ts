import { Document } from 'mongoose';
export type SettingDocument = Setting & Document;
export declare class Setting {
    key: string;
    value: any;
    description?: string;
    category: string;
    isPublic: boolean;
    isSystem: boolean;
}
export declare const SettingSchema: import("mongoose").Schema<Setting, import("mongoose").Model<Setting, any, any, any, Document<unknown, any, Setting, any, {}> & Setting & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Setting, Document<unknown, {}, import("mongoose").FlatRecord<Setting>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Setting> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
