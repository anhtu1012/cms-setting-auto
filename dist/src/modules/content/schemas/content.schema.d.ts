import { Document, Types } from 'mongoose';
export type ContentDocument = Content & Document;
export declare class Content {
    title: string;
    slug: string;
    body: any;
    status: string;
    author: Types.ObjectId;
    tags: string[];
    excerpt?: string;
    featuredImage?: string;
    publishedAt?: Date;
    viewCount: number;
    metadata: Record<string, any>;
}
export declare const ContentSchema: import("mongoose").Schema<Content, import("mongoose").Model<Content, any, any, any, Document<unknown, any, Content, any, {}> & Content & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Content, Document<unknown, {}, import("mongoose").FlatRecord<Content>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Content> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
