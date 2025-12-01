import { DatabaseService } from './database.service';
import { CreateDatabaseDto, UpdateDatabaseDto, DatabaseResponseDto, DatabaseListResponseDto } from '../../dto/database.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
export declare class DatabaseController {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(createDatabaseDto: CreateDatabaseDto, req: any): Promise<DatabaseResponseDto>;
    findAll(paginationDto: PaginationDto, req: any): Promise<DatabaseListResponseDto>;
    findOne(id: string, req: any): Promise<DatabaseResponseDto>;
    update(id: string, updateDatabaseDto: UpdateDatabaseDto, req: any): Promise<DatabaseResponseDto>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    permanentDelete(id: string, req: any): Promise<{
        message: string;
    }>;
}
