import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../modules/users/schemas/user.schema';
import {
  Database,
  DatabaseDocument,
} from '../../modules/dynamic-cms/schemas/database.schema';
import {
  DynamicData,
  DynamicDataDocument,
} from '../../modules/dynamic-cms/schemas/dynamic-data.schema';
import { ROUTE_PATTERNS } from '../constants/api-routes.constants';
import { TierConfigService } from '../tier/tier-config.service';

/**
 * Guard để kiểm tra giới hạn theo tier của user
 * Áp dụng cho:
 * - Giới hạn tạo database
 * - Giới hạn tạo data trong collection (single, bulk, replace-all)
 */
@Injectable()
export class TierLimitsGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Database.name) private databaseModel: Model<DatabaseDocument>,
    @InjectModel(DynamicData.name)
    private dynamicDataModel: Model<DynamicDataDocument>,
    private tierConfigService: TierConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }

    // Lấy thông tin user và tier
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const tierLimits = await this.tierConfigService.getTierLimits(user.tier);
    const method = request.method;
    const path = request.route?.path;

    // Kiểm tra giới hạn dựa trên endpoint
    if (this.isDatabaseCreation(method, path)) {
      await this.checkDatabaseLimit(user, tierLimits);
    } else if (this.isDataCreation(method, path, request)) {
      await this.checkDataLimit(user, tierLimits, request);
    } else if (this.isBulkCreation(method, path)) {
      await this.checkBulkDataLimit(user, tierLimits, request);
    } else if (this.isReplaceAll(method, path)) {
      await this.checkReplaceAllLimit(user, tierLimits, request);
    }

    return true;
  }

  /**
   * Kiểm tra xem có phải là tạo database không
   */
  private isDatabaseCreation(method: string, path: string): boolean {
    return method === 'POST' && path === ROUTE_PATTERNS.DATABASE_CREATE;
  }

  /**
   * Kiểm tra xem có phải là tạo data không
   */
  private isDataCreation(method: string, path: string, request: any): boolean {
    // POST /v1/:databaseId/:collectionName (không phải bulk hoặc replace-all)
    return (
      method === 'POST' &&
      (path === ROUTE_PATTERNS.DATA_CREATE_V1 ||
        path === ROUTE_PATTERNS.DATA_CREATE) &&
      !path.includes('bulk') &&
      !path.includes('replace-all')
    );
  }

  /**
   * Kiểm tra xem có phải là bulk create không
   */
  private isBulkCreation(method: string, path: string): boolean {
    return (
      method === 'POST' &&
      (path === ROUTE_PATTERNS.DATA_BULK_CREATE_V1 ||
        path === ROUTE_PATTERNS.DATA_BULK_CREATE)
    );
  }

  /**
   * Kiểm tra xem có phải là replace-all không
   */
  private isReplaceAll(method: string, path: string): boolean {
    return (
      method === 'PUT' &&
      (path === ROUTE_PATTERNS.DATA_REPLACE_ALL_V1 ||
        path === ROUTE_PATTERNS.DATA_REPLACE_ALL)
    );
  }

  /**
   * Kiểm tra giới hạn tạo database
   */
  private async checkDatabaseLimit(
    user: UserDocument,
    tierLimits: any,
  ): Promise<void> {
    // Nếu unlimited thì bỏ qua
    if (this.tierConfigService.isUnlimited(tierLimits.maxDatabases)) {
      return;
    }

    // Đếm số database hiện tại của user
    const currentCount = await this.databaseModel
      .countDocuments({
        userId: user._id,
        isActive: true,
      })
      .exec();

    if (currentCount >= tierLimits.maxDatabases) {
      throw new ForbiddenException(
        `You have reached the maximum number of databases (${tierLimits.maxDatabases}) for your ${user.tier} tier. Please upgrade your account or delete unused databases.`,
      );
    }
  }

  /**
   * Kiểm tra giới hạn tạo data trong collection
   */
  private async checkDataLimit(
    user: UserDocument,
    tierLimits: any,
    request: any,
  ): Promise<void> {
    // Nếu unlimited thì bỏ qua
    if (this.tierConfigService.isUnlimited(tierLimits.maxDataPerCollection)) {
      return;
    }

    const databaseId = request.params.databaseId;
    const collectionName = request.params.collectionName;

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(databaseId)) {
      throw new BadRequestException(
        `Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`,
      );
    }

    // Kiểm tra database có thuộc về user không
    const database = await this.databaseModel
      .findOne({
        _id: databaseId,
        userId: user._id,
      })
      .exec();

    if (!database) {
      throw new ForbiddenException(
        'Database not found or you do not have access',
      );
    }

    // Đếm số data hiện tại trong collection
    const currentCount = await this.dynamicDataModel
      .countDocuments({
        databaseId: databaseId,
        _collection: collectionName,
      })
      .exec();

    if (currentCount >= tierLimits.maxDataPerCollection) {
      throw new ForbiddenException(
        `You have reached the maximum number of data (${tierLimits.maxDataPerCollection}) per collection for your ${user.tier} tier. Please upgrade your account or delete unused data.`,
      );
    }
  }

  /**
   * Kiểm tra giới hạn tạo bulk data
   */
  private async checkBulkDataLimit(
    user: UserDocument,
    tierLimits: any,
    request: any,
  ): Promise<void> {
    // Nếu unlimited thì bỏ qua
    if (this.tierConfigService.isUnlimited(tierLimits.maxDataPerCollection)) {
      return;
    }

    const databaseId = request.params.databaseId;
    const collectionName = request.params.collectionName;
    const dataArray = request.body;

    if (!Array.isArray(dataArray)) {
      throw new BadRequestException('Body must be an array');
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(databaseId)) {
      throw new BadRequestException(
        `Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`,
      );
    }

    // Kiểm tra database có thuộc về user không
    const database = await this.databaseModel
      .findOne({
        _id: databaseId,
        userId: user._id,
      })
      .exec();

    if (!database) {
      throw new ForbiddenException(
        'Database not found or you do not have access',
      );
    }

    // Đếm số data hiện tại trong collection
    const currentCount = await this.dynamicDataModel
      .countDocuments({
        databaseId: databaseId,
        _collection: collectionName,
      })
      .exec();

    // Kiểm tra nếu thêm bulk data có vượt giới hạn không
    const newTotal = currentCount + dataArray.length;

    if (newTotal > tierLimits.maxDataPerCollection) {
      throw new ForbiddenException(
        `Cannot create ${dataArray.length} items. Current: ${currentCount}, Limit: ${tierLimits.maxDataPerCollection} for your ${user.tier} tier. You can add maximum ${tierLimits.maxDataPerCollection - currentCount} more items.`,
      );
    }
  }

  /**
   * Kiểm tra giới hạn replace-all
   */
  private async checkReplaceAllLimit(
    user: UserDocument,
    tierLimits: any,
    request: any,
  ): Promise<void> {
    // Nếu unlimited thì bỏ qua
    if (this.tierConfigService.isUnlimited(tierLimits.maxDataPerCollection)) {
      return;
    }

    const databaseId = request.params.databaseId;
    const collectionName = request.params.collectionName;
    const dataArray = request.body;

    if (!Array.isArray(dataArray)) {
      throw new BadRequestException('Body must be an array');
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(databaseId)) {
      throw new BadRequestException(
        `Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`,
      );
    }

    // Kiểm tra database có thuộc về user không
    const database = await this.databaseModel
      .findOne({
        _id: databaseId,
        userId: user._id,
      })
      .exec();

    if (!database) {
      throw new ForbiddenException(
        'Database not found or you do not have access',
      );
    }

    // Kiểm tra số lượng data mới có vượt giới hạn không
    if (dataArray.length > tierLimits.maxDataPerCollection) {
      throw new ForbiddenException(
        `Cannot replace with ${dataArray.length} items. Maximum data per collection is ${tierLimits.maxDataPerCollection} for your ${user.tier} tier.`,
      );
    }
  }
}
