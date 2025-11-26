import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class DatabaseSettingsDto {
  @ApiPropertyOptional({
    description: 'Default language',
    example: 'en',
  })
  @IsOptional()
  @IsString()
  defaultLanguage?: string;

  @ApiPropertyOptional({
    description: 'Timezone',
    example: 'Asia/Ho_Chi_Minh',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Date format',
    example: 'DD/MM/YYYY',
  })
  @IsOptional()
  @IsString()
  dateFormat?: string;
}

export class CreateDatabaseDto {
  @ApiProperty({
    description: 'Database name (slug, lowercase, no spaces)',
    example: 'my-ecommerce-db',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Name must be lowercase, alphanumeric with hyphens only',
  })
  name: string;

  @ApiProperty({
    description: 'Display name for the database',
    example: 'My E-commerce Database',
  })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiPropertyOptional({
    description: 'Database description',
    example: 'Main database for e-commerce platform',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Icon for the database',
    example: '🛒',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Database settings',
    type: DatabaseSettingsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DatabaseSettingsDto)
  settings?: DatabaseSettingsDto;

  @ApiPropertyOptional({
    description: 'Tags for categorization',
    example: ['production', 'e-commerce'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateDatabaseDto extends PartialType(CreateDatabaseDto) {
  @ApiPropertyOptional({
    description: 'Active status of the database',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class DatabaseResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'my-ecommerce-db' })
  name: string;

  @ApiProperty({ example: 'My E-commerce Database' })
  displayName: string;

  @ApiProperty({ example: 'Main database for e-commerce platform' })
  description?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  userId: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '🛒' })
  icon?: string;

  @ApiProperty({
    example: { defaultLanguage: 'en', timezone: 'Asia/Ho_Chi_Minh' },
  })
  settings?: DatabaseSettingsDto;

  @ApiProperty({ example: ['production', 'e-commerce'] })
  tags?: string[];

  @ApiProperty({ example: 5 })
  collectionsCount: number;

  @ApiProperty({ example: 1250 })
  dataCount: number;

  @ApiProperty({ example: '2023-12-01T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-12-01T10:30:00Z' })
  updatedAt: Date;
}

export class DatabaseListResponseDto {
  @ApiProperty({ type: [DatabaseResponseDto] })
  data: DatabaseResponseDto[];

  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}
