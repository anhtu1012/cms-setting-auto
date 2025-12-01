import { Model } from 'mongoose';
import { DatabaseDocument } from '../../schemas/database.schema';
import { CreateDatabaseDto, UpdateDatabaseDto, DatabaseResponseDto } from '../../dto/database.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
export declare class DatabaseService {
    private databaseModel;
    constructor(databaseModel: Model<DatabaseDocument>);
    create(createDatabaseDto: CreateDatabaseDto, userId: string): Promise<DatabaseResponseDto>;
    findAllByUser(userId: string, paginationDto: PaginationDto): Promise<any>;
    findOne(id: string, userId: string): Promise<DatabaseResponseDto>;
    update(id: string, updateDatabaseDto: UpdateDatabaseDto, userId: string): Promise<DatabaseResponseDto>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    permanentDelete(id: string, userId: string): Promise<{
        message: string;
    }>;
    updateCounts(databaseId: string, collectionsCount?: number, dataCount?: number): Promise<void>;
    private toResponseDto;
}
