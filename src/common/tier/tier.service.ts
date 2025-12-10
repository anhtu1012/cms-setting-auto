import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../modules/users/schemas/user.schema';
import {
  getTierLimits,
  isUnlimited,
  AccountTier,
  TierLimits,
} from '../enums/tier.enum';
import {
  Database,
  DatabaseDocument,
} from '../../modules/dynamic-cms/schemas/database.schema';
import {
  DynamicData,
  DynamicDataDocument,
} from '../../modules/dynamic-cms/schemas/dynamic-data.schema';

/**
 * Service để kiểm tra và quản lý giới hạn theo tier
 */
@Injectable()
export class TierService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Database.name) private databaseModel: Model<DatabaseDocument>,
    @InjectModel(DynamicData.name)
    private dynamicDataModel: Model<DynamicDataDocument>,
  ) {}

  /**
   * Lấy thông tin tier và usage của user
   */
  async getUserTierInfo(userId: string): Promise<{
    tier: AccountTier;
    limits: TierLimits;
    usage: {
      databases: number;
      apiCallsToday: number;
    };
  }> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    const tierLimits = getTierLimits(user.tier);
    const databaseCount = await this.databaseModel
      .countDocuments({
        userId: user._id,
        isActive: true,
      })
      .exec();

    return {
      tier: user.tier,
      limits: tierLimits,
      usage: {
        databases: databaseCount,
        apiCallsToday: user.apiCallsToday || 0,
      },
    };
  }

  /**
   * Kiểm tra xem user có thể tạo database mới không
   */
  async canCreateDatabase(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    current: number;
    limit: number;
  }> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      return {
        allowed: false,
        reason: 'User not found',
        current: 0,
        limit: 0,
      };
    }

    const tierLimits = getTierLimits(user.tier);

    // Nếu unlimited
    if (isUnlimited(tierLimits.maxDatabases)) {
      return {
        allowed: true,
        current: -1,
        limit: -1,
      };
    }

    const currentCount = await this.databaseModel
      .countDocuments({
        userId: user._id,
        isActive: true,
      })
      .exec();

    const allowed = currentCount < tierLimits.maxDatabases;

    return {
      allowed,
      reason: allowed
        ? undefined
        : `Maximum databases reached (${tierLimits.maxDatabases}) for ${user.tier} tier`,
      current: currentCount,
      limit: tierLimits.maxDatabases,
    };
  }

  /**
   * Kiểm tra xem user có thể tạo data mới trong collection không
   */
  async canCreateData(
    userId: string,
    databaseId: string,
    collectionName: string,
  ): Promise<{
    allowed: boolean;
    reason?: string;
    current: number;
    limit: number;
  }> {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(databaseId)) {
      throw new BadRequestException(
        `Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`,
      );
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      return {
        allowed: false,
        reason: 'User not found',
        current: 0,
        limit: 0,
      };
    }

    const tierLimits = getTierLimits(user.tier);

    // Nếu unlimited
    if (isUnlimited(tierLimits.maxDataPerCollection)) {
      return {
        allowed: true,
        current: -1,
        limit: -1,
      };
    }

    // Kiểm tra database có thuộc về user không
    const database = await this.databaseModel
      .findOne({
        _id: databaseId,
        userId: user._id,
      })
      .exec();

    if (!database) {
      return {
        allowed: false,
        reason: 'Database not found or access denied',
        current: 0,
        limit: tierLimits.maxDataPerCollection,
      };
    }

    // Đếm số data hiện tại
    const currentCount = await this.dynamicDataModel
      .countDocuments({
        databaseId: databaseId,
        _collection: collectionName,
      })
      .exec();

    const allowed = currentCount < tierLimits.maxDataPerCollection;

    return {
      allowed,
      reason: allowed
        ? undefined
        : `Maximum data per collection reached (${tierLimits.maxDataPerCollection}) for ${user.tier} tier`,
      current: currentCount,
      limit: tierLimits.maxDataPerCollection,
    };
  }

  /**
   * Nâng cấp tier cho user
   */
  async upgradeTier(
    userId: string,
    newTier: AccountTier,
    reason?: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    // Lưu lịch sử
    if (user.tier !== newTier) {
      user.tierHistory.push({
        tier: user.tier,
        startDate:
          user.tierStartDate ||
          // createdAt may not be present on the typed document, fall back to cast or ObjectId timestamp
          ((user as any).createdAt ??
            (user._id as Types.ObjectId).getTimestamp()),
        endDate: new Date(),
        upgradeReason: reason,
      });
    }

    user.tier = newTier;
    user.tierStartDate = new Date();

    // Set expiry date (1 năm cho các tier trả phí)
    if (newTier !== AccountTier.FREE) {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      user.tierExpiryDate = expiryDate;
    }

    return await user.save();
  }

  /**
   * Lấy thống kê sử dụng data của TẤT CẢ databases của user
   */
  async getAllDataUsage(userId: string): Promise<
    Array<{
      databaseId: string;
      databaseName: string;
      totalCollections: number;
      totalData: number;
      collections: Array<{
        collection: string;
        count: number;
      }>;
    }>
  > {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    // Lấy tất cả databases của user
    const databases = await this.databaseModel
      .find({ userId: new Types.ObjectId(userId) })
      .exec();

    const result = [];

    for (const db of databases) {
      // Đếm data theo collection cho từng database
      const collections = await this.dynamicDataModel
        .aggregate([
          {
            $match: {
              databaseId: db._id.toString(),
            },
          },
          {
            $group: {
              _id: '$_collection',
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
        ])
        .exec();

      const totalData = collections.reduce((sum, col) => sum + col.count, 0);

      result.push({
        databaseId: db._id.toString(),
        databaseName: db.name,
        totalCollections: collections.length,
        totalData: totalData,
        collections: collections.map((col) => ({
          collection: col._id,
          count: col.count,
        })),
      });
    }

    return result;
  }

  /**
   * Lấy thống kê sử dụng data của user theo collection
   */
  async getDataUsageByCollection(
    userId: string,
    databaseId: string,
  ): Promise<
    Array<{
      collection: string;
      count: number;
      limit: number;
      percentage: number;
    }>
  > {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(databaseId)) {
      throw new BadRequestException(
        `Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`,
      );
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    // Kiểm tra database có thuộc về user không
    const database = await this.databaseModel
      .findOne({
        _id: new Types.ObjectId(databaseId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!database) {
      throw new ForbiddenException(
        `Database not found or you don't have permission to access it`,
      );
    }

    const tierLimits = getTierLimits(user.tier);

    // Lấy danh sách collections và đếm data
    const collections = await this.dynamicDataModel
      .aggregate([
        {
          $match: {
            databaseId: databaseId,
          },
        },
        {
          $group: {
            _id: '$_collection',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ])
      .exec();

    return collections.map((col) => {
      const limit = tierLimits.maxDataPerCollection;
      const percentage = isUnlimited(limit) ? 0 : (col.count / limit) * 100;

      return {
        collection: col._id,
        count: col.count,
        limit: limit,
        percentage: Math.round(percentage * 100) / 100,
      };
    });
  }

  /**
   * Reset API call counter (chạy hàng ngày)
   */
  async resetDailyApiCalls(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.userModel
      .updateMany(
        {
          $or: [
            { lastApiCallReset: { $lt: today } },
            { lastApiCallReset: null },
          ],
        },
        {
          $set: {
            apiCallsToday: 0,
            lastApiCallReset: new Date(),
          },
        },
      )
      .exec();
  }

  /**
   * Tăng API call counter
   */
  async incrementApiCalls(userId: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $inc: { apiCallsToday: 1 },
      })
      .exec();
  }
}
