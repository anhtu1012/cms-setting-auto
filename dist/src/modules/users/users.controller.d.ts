import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./schemas/user.schema").User>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/dto/pagination.dto").PaginationResponse<import("./schemas/user.schema").User>>;
    findOne(id: string): Promise<import("./schemas/user.schema").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./schemas/user.schema").User>;
    remove(id: string): Promise<import("./schemas/user.schema").User>;
}
