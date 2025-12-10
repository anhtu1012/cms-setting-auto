import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TierConfig, TierConfigDocument } from './schemas/tier-config.schema';
import {
  CreateTierConfigDto,
  UpdateTierConfigDto,
} from './dto/tier-config.dto';

/**
 * Service quản lý cấu hình Tier động
 */
@Injectable()
export class TierConfigService {
  // Cache để tránh query database nhiều lần
  private tierCache = new Map<string, TierConfig>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 phút

  constructor(
    @InjectModel(TierConfig.name)
    private tierConfigModel: Model<TierConfigDocument>,
  ) {
    // Khởi tạo cache khi service start
    this.refreshCache();
  }

  /**
   * Lấy tất cả tier configs
   */
  async getAllTiers(includeInactive = false): Promise<TierConfig[]> {
    const query = includeInactive ? {} : { isActive: true };
    return this.tierConfigModel.find(query).sort({ displayOrder: 1 }).exec();
  }

  /**
   * Lấy tier config theo code
   */
  async getTierByCode(tierCode: string): Promise<TierConfig> {
    // Kiểm tra cache trước
    const cached = this.getCachedTier(tierCode);
    if (cached) {
      return cached;
    }

    const tier = await this.tierConfigModel
      .findOne({ tierCode, isActive: true })
      .exec();

    if (!tier) {
      throw new NotFoundException(`Tier '${tierCode}' not found`);
    }

    // Lưu vào cache
    this.setCachedTier(tierCode, tier);
    return tier;
  }

  /**
   * Lấy tier limits (chỉ các thông tin giới hạn)
   */
  async getTierLimits(tierCode: string) {
    const tier = await this.getTierByCode(tierCode);
    return {
      maxDatabases: tier.maxDatabases,
      maxDataPerCollection: tier.maxDataPerCollection,
      maxCollectionsPerDatabase: tier.maxCollectionsPerDatabase,
      maxStorageGB: tier.maxStorageGB,
      maxApiCallsPerDay: tier.maxApiCallsPerDay,
    };
  }

  /**
   * Tạo tier mới
   */
  async createTier(createDto: CreateTierConfigDto): Promise<TierConfig> {
    // Kiểm tra tierCode đã tồn tại chưa
    const existing = await this.tierConfigModel
      .findOne({ tierCode: createDto.tierCode })
      .exec();

    if (existing) {
      throw new ConflictException(
        `Tier '${createDto.tierCode}' already exists`,
      );
    }

    const tier = new this.tierConfigModel(createDto);
    const saved = await tier.save();

    // Clear cache để refresh
    this.clearCache();

    return saved;
  }

  /**
   * Cập nhật tier
   */
  async updateTier(
    tierCode: string,
    updateDto: UpdateTierConfigDto,
  ): Promise<TierConfig> {
    const tier = await this.tierConfigModel
      .findOneAndUpdate({ tierCode }, updateDto, { new: true })
      .exec();

    if (!tier) {
      throw new NotFoundException(`Tier '${tierCode}' not found`);
    }

    // Clear cache
    this.clearCache();

    return tier;
  }

  /**
   * Xóa tier (soft delete bằng cách set isActive = false)
   */
  async deleteTier(tierCode: string): Promise<void> {
    const result = await this.tierConfigModel
      .updateOne({ tierCode }, { isActive: false })
      .exec();

    if (result.modifiedCount === 0) {
      throw new NotFoundException(`Tier '${tierCode}' not found`);
    }

    // Clear cache
    this.clearCache();
  }

  /**
   * Hard delete tier (cẩn thận!)
   */
  async hardDeleteTier(tierCode: string): Promise<void> {
    const result = await this.tierConfigModel.deleteOne({ tierCode }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Tier '${tierCode}' not found`);
    }

    // Clear cache
    this.clearCache();
  }

  /**
   * Kiểm tra giá trị có phải unlimited không
   */
  isUnlimited(limit: number): boolean {
    return limit === -1;
  }

  /**
   * Seed default tiers vào database
   */
  async seedDefaultTiers(): Promise<void> {
    const defaultTiers: CreateTierConfigDto[] = [
      {
        tierCode: 'free',
        tierName: 'Free',
        description: 'Gói miễn phí cho người dùng mới',
        maxDatabases: 2,
        maxDataPerCollection: 100,
        maxCollectionsPerDatabase: 5,
        maxStorageGB: 1,
        maxApiCallsPerDay: 1000,
        price: 0,
        currency: 'USD',
        isActive: true,
        displayOrder: 0,
      },
      {
        tierCode: 'basic',
        tierName: 'Basic',
        description: 'Gói cơ bản cho dự án nhỏ',
        maxDatabases: 5,
        maxDataPerCollection: 1000,
        maxCollectionsPerDatabase: 20,
        maxStorageGB: 5,
        maxApiCallsPerDay: 10000,
        price: 9.99,
        currency: 'USD',
        isActive: true,
        displayOrder: 1,
      },
      {
        tierCode: 'premium',
        tierName: 'Premium',
        description: 'Gói cao cấp cho doanh nghiệp vừa',
        maxDatabases: 20,
        maxDataPerCollection: 10000,
        maxCollectionsPerDatabase: 100,
        maxStorageGB: 50,
        maxApiCallsPerDay: 100000,
        price: 49.99,
        currency: 'USD',
        isActive: true,
        displayOrder: 2,
      },
      {
        tierCode: 'enterprise',
        tierName: 'Enterprise',
        description: 'Gói không giới hạn cho doanh nghiệp lớn',
        maxDatabases: -1,
        maxDataPerCollection: -1,
        maxCollectionsPerDatabase: -1,
        maxStorageGB: -1,
        maxApiCallsPerDay: -1,
        price: 199.99,
        currency: 'USD',
        isActive: true,
        displayOrder: 3,
      },
    ];

    for (const tierDto of defaultTiers) {
      const existing = await this.tierConfigModel
        .findOne({ tierCode: tierDto.tierCode })
        .exec();

      if (!existing) {
        await this.tierConfigModel.create(tierDto);
      }
    }

    // Refresh cache
    this.clearCache();
  }

  /**
   * Cache management
   */
  private getCachedTier(tierCode: string): TierConfig | null {
    const expiry = this.cacheExpiry.get(tierCode);
    if (expiry && Date.now() < expiry) {
      return this.tierCache.get(tierCode) || null;
    }
    return null;
  }

  private setCachedTier(tierCode: string, tier: TierConfig): void {
    this.tierCache.set(tierCode, tier);
    this.cacheExpiry.set(tierCode, Date.now() + this.CACHE_TTL);
  }

  private clearCache(): void {
    this.tierCache.clear();
    this.cacheExpiry.clear();
    // Refresh cache sau khi clear
    this.refreshCache();
  }

  private async refreshCache(): Promise<void> {
    try {
      const tiers = await this.tierConfigModel.find({ isActive: true }).exec();
      for (const tier of tiers) {
        this.setCachedTier(tier.tierCode, tier);
      }
    } catch (error) {
      // Ignore errors during cache refresh
      console.error('Failed to refresh tier cache:', error);
    }
  }
}
