import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { BlacklistedTokenDocument } from '../schemas/blacklisted-token.schema';
export declare class RefreshTokenHandler {
    private jwtService;
    private blacklistedModel;
    constructor(jwtService: JwtService, blacklistedModel: Model<BlacklistedTokenDocument>);
    execute(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
}
