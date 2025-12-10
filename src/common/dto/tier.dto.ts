import { IsEnum, IsOptional, IsString, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountTier } from '../enums/tier.enum';

/**
 * DTO cho việc nâng cấp tier
 */
export class UpgradeTierDto {
  @ApiProperty({
    description: 'User ID to upgrade',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  userId: string;

  @ApiProperty({
    description: 'New tier level',
    enum: AccountTier,
    example: AccountTier.PREMIUM,
  })
  @IsEnum(AccountTier)
  newTier: AccountTier;

  @ApiPropertyOptional({
    description: 'Reason for upgrade',
    example: 'Payment via Stripe - Order #12345',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

/**
 * Response DTO cho tier info
 */
export class TierInfoResponseDto {
  @ApiProperty({ enum: AccountTier })
  tier: AccountTier;

  @ApiProperty({
    description: 'Tier limits',
    example: {
      maxDatabases: 2,
      maxDataPerCollection: 100,
      maxCollectionsPerDatabase: 5,
      maxStorageGB: 1,
      maxApiCallsPerDay: 1000,
    },
  })
  limits: {
    maxDatabases: number;
    maxDataPerCollection: number;
    maxCollectionsPerDatabase: number;
    maxStorageGB: number;
    maxApiCallsPerDay: number;
  };

  @ApiProperty({
    description: 'Current usage statistics',
    example: {
      databases: 1,
      apiCallsToday: 45,
    },
  })
  usage: {
    databases: number;
    apiCallsToday: number;
  };
}

/**
 * Response DTO cho limit check
 */
export class LimitCheckResponseDto {
  @ApiProperty({ description: 'Whether action is allowed' })
  allowed: boolean;

  @ApiPropertyOptional({ description: 'Reason if not allowed' })
  reason?: string;

  @ApiProperty({ description: 'Current count' })
  current: number;

  @ApiProperty({ description: 'Maximum limit' })
  limit: number;
}

/**
 * Response DTO cho data usage
 */
export class DataUsageResponseDto {
  @ApiProperty({ description: 'Collection name' })
  collection: string;

  @ApiProperty({ description: 'Current data count' })
  count: number;

  @ApiProperty({ description: 'Maximum limit' })
  limit: number;

  @ApiProperty({ description: 'Usage percentage' })
  percentage: number;
}
