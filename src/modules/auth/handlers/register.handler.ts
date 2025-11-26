import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { RegisterRequestDto } from '../dto/auth-request.dto';

@Injectable()
export class RegisterHandler {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async execute(registerDto: RegisterRequestDto) {
    // Check if user exists
    const existingUser = await this.userModel
      .findOne({
        $or: [{ email: registerDto.email }, { userName: registerDto.userName }],
      })
      .exec();

    if (existingUser) {
      if (existingUser.email === registerDto.email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.userName === registerDto.userName) {
        throw new ConflictException('Username already exists');
      }
    }

    // Hash password
    const hashedPassword = await this.hashPassword(registerDto.password);

    // Create user
    const newUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
      points: 0,
      walletBalance: 0,
      walletTransactions: [],
      pointsHistory: [],
    });

    const savedUser = await newUser.save();

    return {
      message: 'User registered successfully',
      userProfile: {
        id: savedUser._id.toString(),
        email: savedUser.email,
        userName: savedUser.userName,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        isActive: savedUser.isActive,
        avatar: savedUser.avatar,
        points: savedUser.points,
        walletBalance: savedUser.walletBalance,
        lastLogin: savedUser.lastLogin,
      },
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
