import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BlacklistedToken,
  BlacklistedTokenDocument,
} from '../schemas/blacklisted-token.schema';

@Injectable()
export class LogoutHandler {
  constructor(
    private jwtService: JwtService,
    @InjectModel(BlacklistedToken.name)
    private blacklistedModel: Model<BlacklistedTokenDocument>,
  ) {}

  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    // Try to decode token to determine expiry
    try {
      const payload: any = this.jwtService.verify(refreshToken, {
        ignoreExpiration: true,
      });

      // Calculate expiry date from exp claim if present
      const expiresAt = payload?.exp
        ? new Date(payload.exp * 1000)
        : new Date(Date.now() + 7 * 24 * 3600 * 1000);

      // Store in blacklist (upsert to avoid duplicates)
      await this.blacklistedModel
        .updateOne(
          { token: refreshToken },
          { token: refreshToken, expiresAt },
          { upsert: true },
        )
        .exec();

      return { success: true, message: 'Logged out successfully' };
    } catch (err) {
      // If token invalid, still respond success so callers can clear local tokens
      await this.blacklistedModel
        .updateOne(
          { token: refreshToken },
          {
            token: refreshToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          },
          { upsert: true },
        )
        .exec();
      return { success: true, message: 'Logged out successfully' };
    }
  }
}
