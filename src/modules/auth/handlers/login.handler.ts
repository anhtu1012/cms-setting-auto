import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class LoginHandler {
  constructor(private jwtService: JwtService) {}

  async execute(user: any) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      userName: user.userName,
      role: user.role,
    };

    // Set tokens to expire in 1 year (seconds)
    const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60; // 31536000

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: ONE_YEAR_SECONDS,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: ONE_YEAR_SECONDS,
    });

    return {
      accessToken,
      refreshToken,
      userProfile: {
        id: user._id.toString(),
        email: user.email,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        avatar: user.avatar,
        points: user.points,
        walletBalance: user.walletBalance,
        lastLogin: user.lastLogin,
      },
      expiresIn: ONE_YEAR_SECONDS,
    };
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
