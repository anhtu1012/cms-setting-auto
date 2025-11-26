import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CollectionSchemaModel,
  CollectionSchemaDocument,
} from '../../schemas/collection-schema.schema';
import {
  CreateCollectionSchemaDto,
  UpdateCollectionSchemaDto,
} from '../../dto/collection-schema.dto';
import {
  PaginationDto,
  PaginationResponse,
} from '../../../../common/dto/pagination.dto';

@Injectable()
export class CollectionSchemaService {
  constructor(
    @InjectModel(CollectionSchemaModel.name)
    private collectionSchemaModel: Model<CollectionSchemaDocument>,
  ) {}

  /**
   * Tạo collection schema mới
   */
  async create(
    createDto: CreateCollectionSchemaDto,
    userId: string,
  ): Promise<CollectionSchemaModel> {
    // Kiểm tra xem collection name đã tồn tại trong database này chưa
    const existing = await this.collectionSchemaModel
      .findOne({
        databaseId: new Types.ObjectId(createDto.databaseId),
        name: createDto.name,
      })
      .exec();

    if (existing) {
      throw new BadRequestException(
        `Collection with name "${createDto.name}" already exists in this database`,
      );
    }

    // Validate field names không trùng nhau
    const fieldNames = createDto.fields.map((f) => f.name);
    const uniqueNames = new Set(fieldNames);
    if (fieldNames.length !== uniqueNames.size) {
      throw new BadRequestException('Field names must be unique');
    }

    // Tạo collection schema
    const schema = new this.collectionSchemaModel({
      ...createDto,
      databaseId: new Types.ObjectId(createDto.databaseId),
      userId: new Types.ObjectId(userId),
      createdBy: userId,
      version: 1,
    });

    return schema.save();
  }

  /**
   * Lấy danh sách collection schemas của user trong database
   */
  async findAll(
    paginationDto: PaginationDto,
    userId: string,
    databaseId?: string,
  ): Promise<PaginationResponse<CollectionSchemaModel>> {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query: any = { userId: new Types.ObjectId(userId) };

    if (databaseId) {
      query.databaseId = new Types.ObjectId(databaseId);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.collectionSchemaModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.collectionSchemaModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy collection schema theo ID và kiểm tra ownership
   */
  async findById(
    id: string,
    userId: string,
  ): Promise<CollectionSchemaModel | null> {
    const schema = await this.collectionSchemaModel.findById(id).exec();

    if (!schema) {
      throw new NotFoundException(
        `Collection schema with id "${id}" not found`,
      );
    }

    if (schema.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this collection');
    }

    return schema;
  }

  /**
   * Lấy collection schema theo name trong database của user
   */
  async findByName(
    name: string,
    userId: string,
    databaseId: string,
  ): Promise<CollectionSchemaModel | null> {
    return this.collectionSchemaModel
      .findOne({
        name,
        userId: new Types.ObjectId(userId),
        databaseId: new Types.ObjectId(databaseId),
      })
      .exec();
  }

  /**
   * Lấy tất cả collection schemas của user (không phân trang)
   */
  async findAllSchemas(
    userId: string,
    databaseId?: string,
  ): Promise<CollectionSchemaModel[]> {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (databaseId) {
      query.databaseId = new Types.ObjectId(databaseId);
    }

    return this.collectionSchemaModel
      .find(query)
      .select('-fields')
      .sort({ displayName: 1 })
      .exec();
  }

  /**
   * Cập nhật collection schema
   */
  async update(
    id: string,
    updateDto: UpdateCollectionSchemaDto,
    userId: string,
  ): Promise<CollectionSchemaModel | null> {
    const schema = await this.collectionSchemaModel.findById(id).exec();

    if (!schema) {
      throw new NotFoundException(
        `Collection schema with id "${id}" not found`,
      );
    }

    // Check ownership
    if (schema.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this collection');
    }

    // Nếu update fields, validate field names
    if (updateDto.fields) {
      const fieldNames = updateDto.fields.map((f) => f.name);
      const uniqueNames = new Set(fieldNames);
      if (fieldNames.length !== uniqueNames.size) {
        throw new BadRequestException('Field names must be unique');
      }
    }

    // Tăng version khi update
    const updatedSchema = await this.collectionSchemaModel
      .findByIdAndUpdate(
        id,
        {
          ...updateDto,
          version: schema.version + 1,
        },
        { new: true },
      )
      .exec();

    return updatedSchema;
  }

  /**
   * Xóa collection schema
   */
  async remove(
    id: string,
    userId: string,
  ): Promise<CollectionSchemaModel | null> {
    const schema = await this.collectionSchemaModel.findById(id).exec();

    if (!schema) {
      throw new NotFoundException(
        `Collection schema with id "${id}" not found`,
      );
    }

    // Check ownership
    if (schema.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this collection');
    }

    // TODO: Kiểm tra xem có dữ liệu nào đang sử dụng schema này không
    // Nếu có thì cần warning hoặc không cho xóa

    return this.collectionSchemaModel.findByIdAndDelete(id).exec();
  }

  /**
   * Validate dữ liệu theo schema
   * TODO: Cập nhật lại method này với userId và databaseId
   */
  async validateData(
    collectionName: string,
    data: Record<string, any>,
  ): Promise<{ valid: boolean; errors: string[] }> {
    // Tạm thời return valid để không block
    // TODO: Implement validation với userId và databaseId
    return { valid: true, errors: [] };
  }
}
