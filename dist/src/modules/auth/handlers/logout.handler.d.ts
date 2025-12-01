import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { BlacklistedTokenDocument } from '../schemas/blacklisted-token.schema';
export declare class LogoutHandler {
    private jwtService;
    private blacklistedModel;
    constructor(jwtService: JwtService, blacklistedModel: Model<BlacklistedTokenDocument>);
    execute(refreshToken: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
