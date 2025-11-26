import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  LoginRequestDto,
  RegisterRequestDto,
  RefreshTokenRequestDto,
} from './dto/auth-request.dto';
import { LoginHandler } from './handlers/login.handler';
import { RegisterHandler } from './handlers/register.handler';
import { RefreshTokenHandler } from './handlers/refresh-token.handler';
import { LogoutHandler } from './handlers/logout.handler';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private loginHandler: LoginHandler,
    private registerHandler: RegisterHandler,
    private refreshTokenHandler: RefreshTokenHandler,
    private logoutHandler: LogoutHandler,
  ) {}

  async login(loginDto: LoginRequestDto) {
    // Find user by email or username
    const user = await this.userModel
      .findOne({
        $or: [
          { email: loginDto.emailOrUsername },
          { userName: loginDto.emailOrUsername },
        ],
      })
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await this.loginHandler.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    return this.loginHandler.execute(user);
  }

  async register(registerDto: RegisterRequestDto) {
    return this.registerHandler.execute(registerDto);
  }

  async refreshToken(refreshTokenDto: RefreshTokenRequestDto) {
    return this.refreshTokenHandler.execute(refreshTokenDto.refreshToken);
  }

  async logout(refreshToken: string) {
    return this.logoutHandler.execute(refreshToken);
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }
}
