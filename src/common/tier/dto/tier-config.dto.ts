import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTierConfigDto {
  @ApiProperty({ example: 'premium', description: 'Mã tier (unique)' })
  @IsString()
  tierCode: string;

  @ApiProperty({ example: 'Premium', description: 'Tên tier' })
  @IsString()
  tierName: string;

  @ApiPropertyOptional({ description: 'Mô tả tier' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 20,
    description: 'Số lượng database tối đa (-1 = unlimited)',
  })
  @IsNumber()
  maxDatabases: number;

  @ApiProperty({
    example: 10000,
    description: 'Số data tối đa mỗi collection (-1 = unlimited)',
  })
  @IsNumber()
  maxDataPerCollection: number;

  @ApiProperty({
    example: 100,
    description: 'Số collection tối đa mỗi database (-1 = unlimited)',
  })
  @IsNumber()
  maxCollectionsPerDatabase: number;

  @ApiProperty({
    example: 50,
    description: 'Dung lượng lưu trữ tối đa GB (-1 = unlimited)',
  })
  @IsNumber()
  maxStorageGB: number;

  @ApiProperty({
    example: 100000,
    description: 'Số API calls tối đa mỗi ngày (-1 = unlimited)',
  })
  @IsNumber()
  maxApiCallsPerDay: number;

  @ApiPropertyOptional({ example: 29.99, description: 'Giá tier' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 'USD', description: 'Đơn vị tiền tệ' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ example: true, description: 'Tier có active không' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1, description: 'Thứ tự hiển thị' })
  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Metadata tùy chỉnh' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateTierConfigDto {
  @ApiPropertyOptional({ example: 'Premium Plus', description: 'Tên tier' })
  @IsString()
  @IsOptional()
  tierName?: string;

  @ApiPropertyOptional({ description: 'Mô tả tier' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 30, description: 'Số lượng database tối đa' })
  @IsNumber()
  @IsOptional()
  maxDatabases?: number;

  @ApiPropertyOptional({
    example: 20000,
    description: 'Số data tối đa mỗi collection',
  })
  @IsNumber()
  @IsOptional()
  maxDataPerCollection?: number;

  @ApiPropertyOptional({
    example: 150,
    description: 'Số collection tối đa mỗi database',
  })
  @IsNumber()
  @IsOptional()
  maxCollectionsPerDatabase?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Dung lượng lưu trữ tối đa GB',
  })
  @IsNumber()
  @IsOptional()
  maxStorageGB?: number;

  @ApiPropertyOptional({
    example: 200000,
    description: 'Số API calls tối đa mỗi ngày',
  })
  @IsNumber()
  @IsOptional()
  maxApiCallsPerDay?: number;

  @ApiPropertyOptional({ example: 39.99, description: 'Giá tier' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 'USD', description: 'Đơn vị tiền tệ' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ example: true, description: 'Tier có active không' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 2, description: 'Thứ tự hiển thị' })
  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Metadata tùy chỉnh' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class TierLimitsResponseDto {
  @ApiProperty()
  tierCode: string;

  @ApiProperty()
  tierName: string;

  @ApiProperty()
  maxDatabases: number;

  @ApiProperty()
  maxDataPerCollection: number;

  @ApiProperty()
  maxCollectionsPerDatabase: number;

  @ApiProperty()
  maxStorageGB: number;

  @ApiProperty()
  maxApiCallsPerDay: number;
}
