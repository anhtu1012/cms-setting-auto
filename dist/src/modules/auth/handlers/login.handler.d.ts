import { JwtService } from '@nestjs/jwt';
export declare class LoginHandler {
    private jwtService;
    constructor(jwtService: JwtService);
    execute(user: any): Promise<{
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
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
