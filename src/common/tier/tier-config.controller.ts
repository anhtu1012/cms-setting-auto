import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TierConfigService } from './tier-config.service';
import {
  CreateTierConfigDto,
  UpdateTierConfigDto,
} from './dto/tier-config.dto';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';

@ApiTags('Tier Configuration')
@Controller('v1/tier-config')
export class TierConfigController {
  constructor(private readonly tierConfigService: TierConfigService) {}

  /**
   * Lấy tất cả tier configs
   * Public API - không cần authentication
   */
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả tiers' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  async getAllTiers(@Query('includeInactive') includeInactive?: boolean) {
    return this.tierConfigService.getAllTiers(includeInactive === true);
  }

  /**
   * Lấy tier theo code
   */
  @Get(':tierCode')
  @ApiOperation({ summary: 'Lấy thông tin tier theo code' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tier' })
  async getTierByCode(@Param('tierCode') tierCode: string) {
    return this.tierConfigService.getTierByCode(tierCode);
  }

  /**
   * Lấy tier limits (chỉ limits, không bao gồm giá...)
   */
  @Get(':tierCode/limits')
  @ApiOperation({ summary: 'Lấy thông tin giới hạn của tier' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tier' })
  async getTierLimits(@Param('tierCode') tierCode: string) {
    return this.tierConfigService.getTierLimits(tierCode);
  }

  /**
   * Tạo tier mới
   * Chỉ admin mới có quyền tạo
   */
  @Post()
  @UseGuards(JwtAuthGuard) // Có thể thêm AdminGuard nếu cần
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo tier mới (Admin only)' })
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  @ApiResponse({ status: 409, description: 'Tier code đã tồn tại' })
  async createTier(@Body() createDto: CreateTierConfigDto) {
    return this.tierConfigService.createTier(createDto);
  }

  /**
   * Cập nhật tier
   * Chỉ admin mới có quyền update
   */
  @Put(':tierCode')
  @UseGuards(JwtAuthGuard) // Có thể thêm AdminGuard nếu cần
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật tier (Admin only)' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tier' })
  async updateTier(
    @Param('tierCode') tierCode: string,
    @Body() updateDto: UpdateTierConfigDto,
  ) {
    return this.tierConfigService.updateTier(tierCode, updateDto);
  }

  /**
   * Xóa tier (soft delete)
   * Chỉ admin mới có quyền xóa
   */
  @Delete(':tierCode')
  @UseGuards(JwtAuthGuard) // Có thể thêm AdminGuard nếu cần
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa tier - soft delete (Admin only)' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tier' })
  async deleteTier(@Param('tierCode') tierCode: string) {
    await this.tierConfigService.deleteTier(tierCode);
    return { message: `Tier '${tierCode}' has been deleted` };
  }

  /**
   * Hard delete tier (Cẩn thận!)
   * Chỉ admin mới có quyền
   */
  @Delete(':tierCode/hard')
  @UseGuards(JwtAuthGuard) // Có thể thêm AdminGuard nếu cần
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa vĩnh viễn tier (Admin only - Cẩn thận!)' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tier' })
  async hardDeleteTier(@Param('tierCode') tierCode: string) {
    await this.tierConfigService.hardDeleteTier(tierCode);
    return { message: `Tier '${tierCode}' has been permanently deleted` };
  }

  /**
   * Seed default tiers
   * Chỉ dùng lần đầu setup hoặc reset
   */
  @Post('seed/defaults')
  @UseGuards(JwtAuthGuard) // Có thể thêm AdminGuard nếu cần
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed default tiers vào database (Admin only)' })
  @ApiResponse({ status: 201, description: 'Seed thành công' })
  async seedDefaultTiers() {
    await this.tierConfigService.seedDefaultTiers();
    return { message: 'Default tiers have been seeded successfully' };
  }
}
