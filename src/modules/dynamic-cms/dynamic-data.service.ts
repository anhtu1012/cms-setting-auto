import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  DynamicData,
  DynamicDataDocument,
} from './schemas/dynamic-data.schema';
import { CollectionSchemaService } from './collection-schema.service';
import {
  PaginationDto,
  PaginationResponse,
} from '../../common/dto/pagination.dto';

@Injectable()
export class DynamicDataService {
  constructor(
    @InjectModel(DynamicData.name)
    private dynamicDataModel: Model<DynamicDataDocument>,
    private collectionSchemaService: CollectionSchemaService,
  ) {}

  /**
   * Tạo document mới trong collection động
   */
  async create(
    collectionName: string,
    data: Record<string, any>,
    userId?: string,
  ): Promise<DynamicData> {
    // Kiểm tra collection schema có tồn tại không
    const schema =
      await this.collectionSchemaService.findByName(collectionName);
    if (!schema) {
      throw new NotFoundException(
        `Collection schema "${collectionName}" not found`,
      );
    }

    // Validate dữ liệu
    const validation = await this.collectionSchemaService.validateData(
      collectionName,
      data,
    );

    if (!validation.valid) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Tạo document
    const document = new this.dynamicDataModel({
      _collection: collectionName,
      _data: data,
      createdBy: userId,
      updatedBy: userId,
    });

    return document.save();
  }

  /**
   * Lấy danh sách documents trong collection
   */
  async findAll(
    collectionName: string,
    paginationDto: PaginationDto,
    filter?: Record<string, any>,
  ): Promise<PaginationResponse<DynamicData>> {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    // Kiểm tra collection schema
    const schema =
      await this.collectionSchemaService.findByName(collectionName);
    if (!schema) {
      throw new NotFoundException(
        `Collection schema "${collectionName}" not found`,
      );
    }

    // Build query
    const query: FilterQuery<DynamicDataDocument> = {
      _collection: collectionName,
      deletedAt: null, // Không lấy các bản ghi đã xóa
    };

    // Thêm filter nếu có
    if (filter) {
      Object.keys(filter).forEach((key) => {
        query[`_data.${key}`] = filter[key];
      });
    }

    // Thêm search nếu có
    if (search) {
      const searchableFields = schema.fields
        .filter((f) => f.searchable)
        .map((f) => f.name);

      if (searchableFields.length > 0) {
        query.$or = searchableFields.map((fieldName) => ({
          [`_data.${fieldName}`]: { $regex: search, $options: 'i' },
        }));
      }
    }

    const [data, total] = await Promise.all([
      this.dynamicDataModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.dynamicDataModel.countDocuments(query).exec(),
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
   * Lấy document theo ID
   */
  async findById(
    collectionName: string,
    id: string,
  ): Promise<DynamicData | null> {
    const document = await this.dynamicDataModel
      .findOne({
        _id: id,
        _collection: collectionName,
        deletedAt: null,
      })
      .exec();

    if (!document) {
      throw new NotFoundException(
        `Document not found in collection "${collectionName}"`,
      );
    }

    return document;
  }

  /**
   * Cập nhật document
   */
  async update(
    collectionName: string,
    id: string,
    data: Record<string, any>,
    userId?: string,
  ): Promise<DynamicData | null> {
    // Kiểm tra document có tồn tại không
    const existing = await this.findById(collectionName, id);
    if (!existing) {
      throw new NotFoundException(
        `Document not found in collection "${collectionName}"`,
      );
    }

    // Merge data cũ với data mới
    const mergedData = { ...existing._data, ...data };

    // Validate dữ liệu mới
    const validation = await this.collectionSchemaService.validateData(
      collectionName,
      mergedData,
    );

    if (!validation.valid) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Cập nhật
    return this.dynamicDataModel
      .findByIdAndUpdate(
        id,
        {
          _data: mergedData,
          updatedBy: userId,
        },
        { new: true },
      )
      .exec();
  }

  /**
   * Xóa document (soft delete)
   */
  async softDelete(
    collectionName: string,
    id: string,
  ): Promise<DynamicData | null> {
    const document = await this.findById(collectionName, id);
    if (!document) {
      throw new NotFoundException(
        `Document not found in collection "${collectionName}"`,
      );
    }

    return this.dynamicDataModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();
  }

  /**
   * Xóa document vĩnh viễn
   */
  async hardDelete(
    collectionName: string,
    id: string,
  ): Promise<DynamicData | null> {
    const document = await this.dynamicDataModel
      .findOne({
        _id: id,
        _collection: collectionName,
      })
      .exec();

    if (!document) {
      throw new NotFoundException(
        `Document not found in collection "${collectionName}"`,
      );
    }

    return this.dynamicDataModel.findByIdAndDelete(id).exec();
  }

  /**
   * Restore document đã xóa
   */
  async restore(
    collectionName: string,
    id: string,
  ): Promise<DynamicData | null> {
    const document = await this.dynamicDataModel
      .findOne({
        _id: id,
        _collection: collectionName,
      })
      .exec();

    if (!document) {
      throw new NotFoundException(
        `Document not found in collection "${collectionName}"`,
      );
    }

    return this.dynamicDataModel
      .findByIdAndUpdate(id, { deletedAt: null }, { new: true })
      .exec();
  }

  /**
   * Query với điều kiện phức tạp
   */
  async query(
    collectionName: string,
    queryFilter: Record<string, any>,
    options?: {
      sort?: Record<string, 1 | -1>;
      limit?: number;
      skip?: number;
    },
  ): Promise<DynamicData[]> {
    const query: FilterQuery<DynamicDataDocument> = {
      _collection: collectionName,
      deletedAt: null,
    };

    // Transform filter to query _data fields
    Object.keys(queryFilter).forEach((key) => {
      query[`_data.${key}`] = queryFilter[key];
    });

    let queryBuilder = this.dynamicDataModel.find(query);

    if (options?.sort) {
      queryBuilder = queryBuilder.sort(options.sort);
    }

    if (options?.skip) {
      queryBuilder = queryBuilder.skip(options.skip);
    }

    if (options?.limit) {
      queryBuilder = queryBuilder.limit(options.limit);
    }

    return queryBuilder.exec();
  }

  /**
   * Đếm số lượng documents
   */
  async count(
    collectionName: string,
    filter?: Record<string, any>,
  ): Promise<number> {
    const query: FilterQuery<DynamicDataDocument> = {
      _collection: collectionName,
      deletedAt: null,
    };

    if (filter) {
      Object.keys(filter).forEach((key) => {
        query[`_data.${key}`] = filter[key];
      });
    }

    return this.dynamicDataModel.countDocuments(query).exec();
  }
}
