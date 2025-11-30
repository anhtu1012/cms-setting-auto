import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Database } from '../../modules/dynamic-cms/schemas/database.schema';

/**
 * Guard để kiểm tra user có quyền truy cập vào database hay không
 * Yêu cầu: JWT Guard phải chạy trước để có req.user
 * Header: x-database-id phải có giá trị
 */
@Injectable()
export class DatabaseOwnershipGuard implements CanActivate {
  constructor(
    @InjectModel(Database.name)
    private databaseModel: Model<Database>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const databaseId = request.headers['x-database-id'];

    // Kiểm tra có user từ JWT guard không
    if (!user || !user.userId) {
      throw new ForbiddenException('User authentication required');
    }

    // Kiểm tra có databaseId trong header không
    if (!databaseId) {
      throw new BadRequestException(
        'Database ID is required in header x-database-id',
      );
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(databaseId)) {
      throw new BadRequestException('Invalid Database ID format');
    }

    // Kiểm tra database có tồn tại và thuộc về user không
    const database = await this.databaseModel
      .findOne({
        _id: new Types.ObjectId(databaseId),
        userId: new Types.ObjectId(user.userId),
        isActive: true,
      })
      .exec();

    if (!database) {
      throw new ForbiddenException(
        'Database not found or you do not have access to this database',
      );
    }

    // Lưu database vào request để sử dụng sau này nếu cần
    request.database = database;

    return true;
  }
}
