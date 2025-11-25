import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSettingDto {
  @ApiProperty({
    example: 'site_name',
    description: 'Setting key (unique identifier)',
  })
  @IsString()
  key: string;

  @ApiProperty({
    example: { en: 'My Site', vi: 'Website của tôi' },
    description: 'Setting value (any type)',
  })
  value: any;

  @ApiPropertyOptional({
    example: 'Website name configuration',
    description: 'Setting description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: ['general', 'appearance', 'security', 'notification', 'integration'],
    default: 'general',
    description: 'Setting category',
  })
  @IsOptional()
  @IsEnum(['general', 'appearance', 'security', 'notification', 'integration'])
  category?: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Is setting publicly accessible',
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateSettingDto {
  @ApiPropertyOptional({
    example: { en: 'My Site', vi: 'Website của tôi' },
    description: 'Setting value (any type)',
  })
  @IsOptional()
  value?: any;

  @ApiPropertyOptional({
    example: 'Website name configuration',
    description: 'Setting description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: ['general', 'appearance', 'security', 'notification', 'integration'],
    description: 'Setting category',
  })
  @IsOptional()
  @IsEnum(['general', 'appearance', 'security', 'notification', 'integration'])
  category?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Is setting publicly accessible',
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
