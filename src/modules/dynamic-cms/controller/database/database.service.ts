import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Database, DatabaseDocument } from '../../schemas/database.schema';
import {
  CreateDatabaseDto,
  UpdateDatabaseDto,
  DatabaseResponseDto,
} from '../../dto/database.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(Database.name)
    private databaseModel: Model<DatabaseDocument>,
  ) {}

  /**
   * Tạo database mới cho user
   */
  async create(
    createDatabaseDto: CreateDatabaseDto,
    userId: string,
  ): Promise<DatabaseResponseDto> {
    // Check if database name already exists for this user
    const existing = await this.databaseModel
      .findOne({
        userId: new Types.ObjectId(userId),
        name: createDatabaseDto.name,
      })
      .exec();

    if (existing) {
      throw new ConflictException(
        `Database with name "${createDatabaseDto.name}" already exists`,
      );
    }

    const database = new this.databaseModel({
      ...createDatabaseDto,
      userId: new Types.ObjectId(userId),
      createdBy: userId,
    });

    const saved = await database.save();
    return this.toResponseDto(saved);
  }

  /**
   * Lấy tất cả databases của user với phân trang
   */
  async findAllByUser(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<any> {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query: any = { userId: new Types.ObjectId(userId) };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.databaseModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.databaseModel.countDocuments(query).exec(),
    ]);

    return {
      data: data.map((db) => this.toResponseDto(db)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy database theo ID và kiểm tra ownership
   */
  async findOne(id: string, userId: string): Promise<DatabaseResponseDto> {
    const database = await this.databaseModel.findById(id).exec();

    if (!database) {
      throw new NotFoundException(`Database with ID "${id}" not found`);
    }

    // Check ownership
    if (database.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this database');
    }

    return this.toResponseDto(database);
  }

  /**
   * Cập nhật database
   */
  async update(
    id: string,
    updateDatabaseDto: UpdateDatabaseDto,
    userId: string,
  ): Promise<DatabaseResponseDto> {
    const database = await this.databaseModel.findById(id).exec();

    if (!database) {
      throw new NotFoundException(`Database with ID "${id}" not found`);
    }

    // Check ownership
    if (database.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this database');
    }

    // Check name uniqueness if changing name
    if (updateDatabaseDto.name && updateDatabaseDto.name !== database.name) {
      const existing = await this.databaseModel
        .findOne({
          userId: new Types.ObjectId(userId),
          name: updateDatabaseDto.name,
          _id: { $ne: id },
        })
        .exec();

      if (existing) {
        throw new ConflictException(
          `Database with name "${updateDatabaseDto.name}" already exists`,
        );
      }
    }

    Object.assign(database, updateDatabaseDto);
    database.updatedBy = userId;
    const updated = await database.save();

    return this.toResponseDto(updated);
  }

  /**
   * Xóa database (soft delete - chỉ set isActive = false)
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const database = await this.databaseModel.findById(id).exec();

    if (!database) {
      throw new NotFoundException(`Database with ID "${id}" not found`);
    }

    // Check ownership
    if (database.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this database');
    }

    database.isActive = false;
    database.updatedBy = userId;
    await database.save();

    return { message: 'Database deactivated successfully' };
  }

  /**
   * Xóa database vĩnh viễn (hard delete)
   */
  async permanentDelete(
    id: string,
    userId: string,
  ): Promise<{ message: string }> {
    const database = await this.databaseModel.findById(id).exec();

    if (!database) {
      throw new NotFoundException(`Database with ID "${id}" not found`);
    }

    // Check ownership
    if (database.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this database');
    }

    await this.databaseModel.findByIdAndDelete(id).exec();

    return { message: 'Database permanently deleted' };
  }

  /**
   * Cập nhật số lượng collections và data
   */
  async updateCounts(
    databaseId: string,
    collectionsCount?: number,
    dataCount?: number,
  ): Promise<void> {
    const update: any = {};
    if (collectionsCount !== undefined)
      update.collectionsCount = collectionsCount;
    if (dataCount !== undefined) update.dataCount = dataCount;

    await this.databaseModel.findByIdAndUpdate(databaseId, update).exec();
  }

  /**
   * Convert document to response DTO
   */
  private toResponseDto(database: any): DatabaseResponseDto {
    return {
      id: database._id.toString(),
      name: database.name,
      displayName: database.displayName,
      description: database.description,
      userId: database.userId.toString(),
      isActive: database.isActive,
      icon: database.icon,
      settings: database.settings,
      tags: database.tags,
      collectionsCount: database.collectionsCount || 0,
      dataCount: database.dataCount || 0,
      createdAt: database.createdAt,
      updatedAt: database.updatedAt,
    };
  }
}
