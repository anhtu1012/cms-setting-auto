import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Model } from 'mongoose';
import { Database } from '../../modules/dynamic-cms/schemas/database.schema';
export declare class DatabaseOwnershipGuard implements CanActivate {
    private databaseModel;
    constructor(databaseModel: Model<Database>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
