import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  userName: string;

  @ApiProperty({
    example: 'password123',
    minLength: 6,
    description: 'User password',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    enum: ['admin', 'user', 'editor'],
    default: 'user',
    description: 'User role',
  })
  @IsOptional()
  @IsEnum(['admin', 'user', 'editor'])
  role?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'johndoe', description: 'Username' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  userName?: string;

  @ApiPropertyOptional({ example: 'John', description: 'User first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'User last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    enum: ['admin', 'user', 'editor'],
    description: 'User role',
  })
  @IsOptional()
  @IsEnum(['admin', 'user', 'editor'])
  role?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: true, description: 'User active status' })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 100, description: 'User points' })
  @IsOptional()
  @IsNumber()
  points?: number;

  @ApiPropertyOptional({ example: 500.5, description: 'Wallet balance' })
  @IsOptional()
  @IsNumber()
  walletBalance?: number;
}
