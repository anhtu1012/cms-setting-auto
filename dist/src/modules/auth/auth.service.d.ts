import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginRequestDto, RegisterRequestDto, RefreshTokenRequestDto } from './dto/auth-request.dto';
import { LoginHandler } from './handlers/login.handler';
import { RegisterHandler } from './handlers/register.handler';
import { RefreshTokenHandler } from './handlers/refresh-token.handler';
import { LogoutHandler } from './handlers/logout.handler';
export declare class AuthService {
    private userModel;
    private loginHandler;
    private registerHandler;
    private refreshTokenHandler;
    private logoutHandler;
    constructor(userModel: Model<UserDocument>, loginHandler: LoginHandler, registerHandler: RegisterHandler, refreshTokenHandler: RefreshTokenHandler, logoutHandler: LogoutHandler);
    login(loginDto: LoginRequestDto): Promise<{
        accessToken: string;
        refreshToken: string;
        userProfile: {
            id: any;
            email: any;
            userName: any;
            firstName: any;
            lastName: any;
            role: any;
            isActive: any;
            avatar: any;
            points: any;
            walletBalance: any;
            lastLogin: any;
        };
        expiresIn: number;
    }>;
    register(registerDto: RegisterRequestDto): Promise<{
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
    refreshToken(refreshTokenDto: RefreshTokenRequestDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    logout(refreshToken: string): Promise<{
        success: boolean;
        message: string;
    }>;
    validateUser(userId: string): Promise<User | null>;
}
