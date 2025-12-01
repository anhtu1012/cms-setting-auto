import { Model } from 'mongoose';
import { UserDocument } from '../../users/schemas/user.schema';
import { RegisterRequestDto } from '../dto/auth-request.dto';
export declare class RegisterHandler {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    execute(registerDto: RegisterRequestDto): Promise<{
        message: string;
        userProfile: {
            id: string;
            email: string;
            userName: string;
            firstName: string;
            lastName: string;
            role: string;
            isActive: boolean;
            avatar: string;
            points: number;
            walletBalance: number;
            lastLogin: Date;
        };
    }>;
    private hashPassword;
}
