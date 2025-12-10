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
import { FieldType } from '../../interfaces/field-types.interface';
import {
  ValidationResponse,
  ValidationError,
  createValidationError,
  createValidationResponse,
} from '../../../../common/dto/validation.dto';

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
   * Lấy collection schema theo name trong database của user (có check ownership)
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
   * Lấy collection schema theo name trong database (không check ownership)
   * Dùng cho public API - chỉ cần databaseId
   */
  async findByNamePublic(
    name: string,
    databaseId: string,
  ): Promise<CollectionSchemaModel | null> {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(databaseId)) {
      throw new BadRequestException(
        `Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`,
      );
    }

    return this.collectionSchemaModel
      .findOne({
        name,
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
   */
  async validateData(
    collectionName: string,
    userId: string | null,
    databaseId: string,
    data: Record<string, any>,
  ): Promise<ValidationResponse> {
    const errors: ValidationError[] = [];

    // Lấy schema
    const schema = await this.findByName(collectionName, userId, databaseId);
    if (!schema) {
      throw new NotFoundException(
        `Collection schema "${collectionName}" not found`,
      );
    }

    // Danh sách các field tự động của hệ thống - không cần validate
    const systemFields = ['id', '_id', 'createdAt', 'updatedAt', '__v'];

    // Validate từng field
    for (const field of schema.fields) {
      // Bỏ qua các field hệ thống
      if (systemFields.includes(field.name)) {
        continue;
      }

      const value = data[field.name];
      const validation = field.validation || {};

      // Check required
      if (
        validation.required &&
        (value === undefined || value === null || value === '')
      ) {
        errors.push(
          createValidationError(
            field.name,
            `${field.label || field.name} is required`,
          ),
        );
        continue;
      }

      // Nếu không có value và không required thì skip validation type
      if (value === undefined || value === null) {
        continue;
      }

      // Validate type
      const actualType = typeof value;
      let isValidType = false;

      switch (field.type) {
        case FieldType.STRING:
        case FieldType.TEXT:
        case FieldType.TEXTAREA:
        case FieldType.EMAIL:
        case FieldType.URL:
        case FieldType.RICH_TEXT:
          isValidType = actualType === 'string';
          break;
        case FieldType.NUMBER:
          isValidType = actualType === 'number' && !isNaN(value);
          break;
        case FieldType.BOOLEAN:
        case FieldType.CHECKBOX:
          isValidType = actualType === 'boolean';
          break;
        case FieldType.DATE:
        case FieldType.DATETIME:
          isValidType = !isNaN(Date.parse(value));
          break;
        case FieldType.ARRAY:
        case FieldType.MULTI_SELECT:
          isValidType = Array.isArray(value);
          break;
        case FieldType.JSON:
          isValidType = actualType === 'object' && !Array.isArray(value);
          break;
        case FieldType.REFERENCE:
          // Reference có thể là ObjectId hoặc string
          isValidType =
            actualType === 'string' || Types.ObjectId.isValid(value);
          break;
        case FieldType.SELECT:
        case FieldType.RADIO:
          isValidType = actualType === 'string' || actualType === 'number';
          break;
        case FieldType.FILE:
        case FieldType.IMAGE:
          isValidType = actualType === 'string'; // URL string
          break;
        default:
          isValidType = true; // Unknown types pass
      }

      if (!isValidType) {
        errors.push(
          createValidationError(
            field.name,
            `${field.label || field.name} must be of type ${field.type}, got ${actualType}`,
          ),
        );
      }

      // Validate enum
      if (validation.enum && validation.enum.length > 0) {
        if (!validation.enum.includes(value)) {
          errors.push(
            createValidationError(
              field.name,
              `${field.label || field.name} must be one of: ${validation.enum.join(', ')}`,
            ),
          );
        }
      }

      // Validate min/max for numbers
      if (field.type === FieldType.NUMBER && typeof value === 'number') {
        if (validation.min !== undefined && value < validation.min) {
          errors.push(
            createValidationError(
              field.name,
              `${field.label || field.name} must be at least ${validation.min}`,
            ),
          );
        }
        if (validation.max !== undefined && value > validation.max) {
          errors.push(
            createValidationError(
              field.name,
              `${field.label || field.name} must be at most ${validation.max}`,
            ),
          );
        }
      }

      // Validate minLength/maxLength for strings
      if (
        (field.type === FieldType.STRING ||
          field.type === FieldType.TEXT ||
          field.type === FieldType.TEXTAREA) &&
        typeof value === 'string'
      ) {
        if (
          validation.minLength !== undefined &&
          value.length < validation.minLength
        ) {
          errors.push(
            createValidationError(
              field.name,
              `${field.label || field.name} must be at least ${validation.minLength} characters`,
            ),
          );
        }
        if (
          validation.maxLength !== undefined &&
          value.length > validation.maxLength
        ) {
          errors.push(
            createValidationError(
              field.name,
              `${field.label || field.name} must be at most ${validation.maxLength} characters`,
            ),
          );
        }
      }

      // Validate pattern (regex)
      if (validation.pattern && typeof value === 'string') {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value)) {
          errors.push(
            createValidationError(
              field.name,
              `${field.label || field.name} does not match the required pattern`,
            ),
          );
        }
      }

      // TODO: Validate unique
      // Cần inject DynamicDataModel để check uniqueness trong database
    }

    return createValidationResponse(errors);
  }

  /**
   * Validate dữ liệu theo schema (public - không check ownership)
   * Dùng cho dynamic-data public API
   */
  async validateDataPublic(
    collectionName: string,
    databaseId: string,
    data: Record<string, any>,
  ): Promise<ValidationResponse> {
    const errors: ValidationError[] = [];

    // Lấy schema (không check ownership)
    const schema = await this.findByNamePublic(collectionName, databaseId);
    if (!schema) {
      throw new NotFoundException(
        `Collection schema "${collectionName}" not found`,
      );
    }

    // Danh sách các field tự động của hệ thống - không cần validate
    const systemFields = ['id', '_id', 'createdAt', 'updatedAt', '__v'];

    // Validate từng field
    for (const field of schema.fields) {
      // Bỏ qua các field hệ thống
      if (systemFields.includes(field.name)) {
        continue;
      }

      const value = data[field.name];
      const validation = field.validation || {};

      // Check required
      if (
        validation.required &&
        (value === undefined || value === null || value === '')
      ) {
        errors.push(
          createValidationError(
            field.name,
            `${field.label || field.name} is required`,
          ),
        );
        continue; // Bỏ qua các validation khác nếu required fail
      }

      // Nếu value không có và không required thì skip validation
      if (value === undefined || value === null) {
        continue;
      }

      // Validate min/max for numbers
      if (field.type === FieldType.NUMBER && typeof value === 'number') {
        if (validation.min !== undefined && value < validation.min) {
          errors.push(
            createValidationError(
              field.name,
              `${field.label || field.name} must be at least ${validation.min}`,
            ),
          );
        }
        if (validation.max !== undefined && value > validation.max) {
          errors.push(
            createValidationError(
              field.name,
              `${field.label || field.name} must be at most ${validation.max}`,
            ),
          );
        }
      }

      // Validate minLength/maxLength for strings
      if (
        (field.type === FieldType.STRING ||
          field.type === FieldType.TEXT ||
          field.type === FieldType.TEXTAREA) &&
        typeof value === 'string'
      ) {
        if (
          validation.minLength !== undefined &&
          value.length < validation.minLength
        ) {
          errors.push(
            createValidationError(
              field.name,
              `${field.label || field.name} must be at least ${validation.minLength} characters`,
            ),
          );
        }
        if (
          validation.maxLength !== undefined &&
          value.length > validation.maxLength
        ) {
          errors.push(
            createValidationError(
              field.name,
              `${field.label || field.name} must be at most ${validation.maxLength} characters`,
            ),
          );
        }
      }

      // Validate pattern (regex)
      if (validation.pattern && typeof value === 'string') {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value)) {
          errors.push(
            createValidationError(
              field.name,
              `${field.label || field.name} does not match the required pattern`,
            ),
          );
        }
      }
    }

    return createValidationResponse(errors);
  }
}
