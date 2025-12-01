import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PaginationDto, PaginationResponse } from '../../common/dto/pagination.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(paginationDto: PaginationDto): Promise<PaginationResponse<User>>;
    findOne(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
    remove(id: string): Promise<User | null>;
}
