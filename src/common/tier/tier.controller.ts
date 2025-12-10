import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TierService } from './tier.service';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import {
  UpgradeTierDto,
  TierInfoResponseDto,
  LimitCheckResponseDto,
  DataUsageResponseDto,
} from '../dto/tier.dto';
import { TIER_ROUTES } from '../constants/api-routes.constants';

@ApiTags('Tier Management')
@Controller(TIER_ROUTES.BASE)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TierController {
  constructor(private readonly tierService: TierService) {}

  @Get('info')
  @ApiOperation({ summary: 'Get current user tier information and limits' })
  @ApiResponse({
    status: 200,
    description: 'Tier information retrieved successfully',
    type: TierInfoResponseDto,
  })
  async getTierInfo(@Request() req): Promise<TierInfoResponseDto> {
    return this.tierService.getUserTierInfo(req.user.userId);
  }

  @Get('check-database-limit')
  @ApiOperation({ summary: 'Check if user can create more databases' })
  @ApiResponse({
    status: 200,
    description: 'Database limit check result',
    type: LimitCheckResponseDto,
  })
  async checkDatabaseLimit(@Request() req): Promise<LimitCheckResponseDto> {
    return this.tierService.canCreateDatabase(req.user.userId);
  }

  @Get('check-data-limit/:databaseId/:collectionName')
  @ApiOperation({
    summary: 'Check if user can create more data in a collection',
  })
  @ApiResponse({
    status: 200,
    description: 'Data limit check result',
    type: LimitCheckResponseDto,
  })
  async checkDataLimit(
    @Param('databaseId') databaseId: string,
    @Param('collectionName') collectionName: string,
    @Request() req,
  ): Promise<LimitCheckResponseDto> {
    return this.tierService.canCreateData(
      req.user.userId,
      databaseId,
      collectionName,
    );
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get data usage statistics for all databases' })
  @ApiResponse({
    status: 200,
    description: 'All databases usage statistics retrieved successfully',
  })
  async getAllDataUsage(@Request() req) {
    return this.tierService.getAllDataUsage(req.user.userId);
  }

  @Get('usage/:databaseId')
  @ApiOperation({
    summary: 'Get data usage statistics by collection for a specific database',
  })
  @ApiResponse({
    status: 200,
    description: 'Data usage statistics retrieved successfully',
    type: [DataUsageResponseDto],
  })
  async getDataUsage(
    @Param('databaseId') databaseId: string,
    @Request() req,
  ): Promise<DataUsageResponseDto[]> {
    return this.tierService.getDataUsageByCollection(
      req.user.userId,
      databaseId,
    );
  }

  @Post('upgrade')
  @ApiOperation({ summary: 'Upgrade user tier (admin only for now)' })
  @ApiResponse({
    status: 200,
    description: 'Tier upgraded successfully',
  })
  async upgradeTier(@Body() upgradeTierDto: UpgradeTierDto) {
    return this.tierService.upgradeTier(
      upgradeTierDto.userId,
      upgradeTierDto.newTier,
      upgradeTierDto.reason,
    );
  }
}
