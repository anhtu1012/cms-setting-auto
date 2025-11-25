import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CollectionSchemaModel,
  CollectionSchemaDocument,
} from './schemas/collection-schema.schema';
import {
  CreateCollectionSchemaDto,
  UpdateCollectionSchemaDto,
} from './dto/collection-schema.dto';
import {
  PaginationDto,
  PaginationResponse,
} from '../../common/dto/pagination.dto';

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
    userId?: string,
  ): Promise<CollectionSchemaModel> {
    // Kiểm tra xem collection name đã tồn tại chưa
    const existing = await this.collectionSchemaModel
      .findOne({ name: createDto.name })
      .exec();

    if (existing) {
      throw new BadRequestException(
        `Collection with name "${createDto.name}" already exists`,
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
      createdBy: userId,
      version: 1,
    });

    return schema.save();
  }

  /**
   * Lấy danh sách tất cả collection schemas
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<CollectionSchemaModel>> {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { displayName: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

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
   * Lấy collection schema theo ID
   */
  async findById(id: string): Promise<CollectionSchemaModel | null> {
    return this.collectionSchemaModel.findById(id).exec();
  }

  /**
   * Lấy collection schema theo name
   */
  async findByName(name: string): Promise<CollectionSchemaModel | null> {
    return this.collectionSchemaModel.findOne({ name }).exec();
  }

  /**
   * Lấy tất cả collection schemas (không phân trang)
   */
  async findAllSchemas(): Promise<CollectionSchemaModel[]> {
    return this.collectionSchemaModel.find().sort({ displayName: 1 }).exec();
  }

  /**
   * Cập nhật collection schema
   */
  async update(
    id: string,
    updateDto: UpdateCollectionSchemaDto,
    userId?: string,
  ): Promise<CollectionSchemaModel | null> {
    const schema = await this.collectionSchemaModel.findById(id).exec();

    if (!schema) {
      throw new NotFoundException(
        `Collection schema with id "${id}" not found`,
      );
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
  async remove(id: string): Promise<CollectionSchemaModel | null> {
    const schema = await this.collectionSchemaModel.findById(id).exec();

    if (!schema) {
      throw new NotFoundException(
        `Collection schema with id "${id}" not found`,
      );
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
    data: Record<string, any>,
  ): Promise<{ valid: boolean; errors: string[] }> {
    const schema = await this.findByName(collectionName);

    if (!schema) {
      return {
        valid: false,
        errors: [`Collection schema "${collectionName}" not found`],
      };
    }

    // Kiểm tra data có tồn tại không
    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        errors: ['Data must be a valid object'],
      };
    }

    const errors: string[] = [];

    // Validate từng field
    for (const field of schema.fields) {
      const value = data[field.name];

      // Required validation
      if (
        field.validation?.required &&
        (value === undefined || value === null || value === '')
      ) {
        errors.push(`Field "${field.label}" is required`);
        continue;
      }

      // Skip nếu field không required và không có value
      if (
        !field.validation?.required &&
        (value === undefined || value === null)
      ) {
        continue;
      }

      // Type-specific validation
      switch (field.type) {
        case 'number':
          if (typeof value !== 'number') {
            errors.push(`Field "${field.label}" must be a number`);
          } else {
            if (
              field.validation?.min !== undefined &&
              value < field.validation.min
            ) {
              errors.push(
                `Field "${field.label}" must be at least ${field.validation.min}`,
              );
            }
            if (
              field.validation?.max !== undefined &&
              value > field.validation.max
            ) {
              errors.push(
                `Field "${field.label}" must be at most ${field.validation.max}`,
              );
            }
          }
          break;

        case 'text':
        case 'textarea':
        case 'email':
        case 'url':
          if (typeof value !== 'string') {
            errors.push(`Field "${field.label}" must be a string`);
          } else {
            if (
              field.validation?.minLength &&
              value.length < field.validation.minLength
            ) {
              errors.push(
                `Field "${field.label}" must be at least ${field.validation.minLength} characters`,
              );
            }
            if (
              field.validation?.maxLength &&
              value.length > field.validation.maxLength
            ) {
              errors.push(
                `Field "${field.label}" must be at most ${field.validation.maxLength} characters`,
              );
            }
            if (field.validation?.pattern) {
              const regex = new RegExp(field.validation.pattern);
              if (!regex.test(value)) {
                errors.push(
                  `Field "${field.label}" does not match required pattern`,
                );
              }
            }
          }
          break;

        case 'email':
          if (typeof value === 'string') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              errors.push(`Field "${field.label}" must be a valid email`);
            }
          }
          break;

        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(`Field "${field.label}" must be a boolean`);
          }
          break;

        case 'select':
        case 'radio':
          if (
            field.options &&
            !field.options.some((opt) => opt.value === value)
          ) {
            errors.push(
              `Field "${field.label}" must be one of the allowed options`,
            );
          }
          break;

        case 'multi_select':
        case 'checkbox':
          if (!Array.isArray(value)) {
            errors.push(`Field "${field.label}" must be an array`);
          } else if (field.options) {
            const allowedValues = field.options.map((opt) => opt.value);
            const invalidValues = value.filter(
              (v) => !allowedValues.includes(v),
            );
            if (invalidValues.length > 0) {
              errors.push(
                `Field "${field.label}" contains invalid values: ${invalidValues.join(', ')}`,
              );
            }
          }
          break;
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
