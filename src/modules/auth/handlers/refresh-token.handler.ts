import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BlacklistedToken,
  BlacklistedTokenDocument,
} from '../schemas/blacklisted-token.schema';

@Injectable()
export class RefreshTokenHandler {
  constructor(
    private jwtService: JwtService,
    @InjectModel(BlacklistedToken.name)
    private blacklistedModel: Model<BlacklistedTokenDocument>,
  ) {}

  async execute(refreshToken: string) {
    // Check if token is blacklisted
    const found = await this.blacklistedModel
      .findOne({ token: refreshToken })
      .exec();
    if (found) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);

      const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60; // 31536000

      const newAccessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.email,
          userName: payload.userName,
          role: payload.role,
        },
        { expiresIn: ONE_YEAR_SECONDS },
      );

      const newRefreshToken = this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.email,
          userName: payload.userName,
          role: payload.role,
        },
        { expiresIn: ONE_YEAR_SECONDS },
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: ONE_YEAR_SECONDS,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
