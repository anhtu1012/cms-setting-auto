import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    email: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    avatar?: string;
    lastLogin?: Date;
    points: number;
    walletBalance: number;
    walletTransactions: Array<{
        date: Date;
        amount: number;
        type: string;
        description: string;
    }>;
    pointsHistory: Array<{
        date: Date;
        points: number;
        reason: string;
    }>;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
