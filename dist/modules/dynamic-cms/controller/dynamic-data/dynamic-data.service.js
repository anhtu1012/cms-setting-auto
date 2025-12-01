"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DynamicDataService", {
    enumerable: true,
    get: function() {
        return DynamicDataService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _dynamicdataschema = require("../../schemas/dynamic-data.schema");
const _collectionschemaservice = require("../collection-schema/collection-schema.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let DynamicDataService = class DynamicDataService {
    /**
   * Transform document để trả về data phẳng, không có lớp _data
   */ transformDocument(doc) {
        if (!doc) return null;
        const plainDoc = doc.toObject ? doc.toObject() : doc;
        const { _data, ...rest } = plainDoc;
        return {
            ...rest,
            ..._data
        };
    }
    /**
   * Transform array of documents
   */ transformDocuments(docs) {
        return docs.map((doc)=>this.transformDocument(doc));
    }
    /**
   * Tạo document mới trong collection động
   */ async create(collectionName, databaseId, data, userId) {
        // Kiểm tra collection schema có tồn tại không (không check ownership)
        const schema = await this.collectionSchemaService.findByNamePublic(collectionName, databaseId);
        if (!schema) {
            throw new _common.NotFoundException(`Collection schema "${collectionName}" not found`);
        }
        // Validate dữ liệu (public - không check ownership)
        const validation = await this.collectionSchemaService.validateDataPublic(collectionName, databaseId, data);
        if (!validation.valid) {
            throw new _common.BadRequestException({
                message: 'Validation failed',
                errors: validation.errors
            });
        }
        // Tạo document
        const document = new this.dynamicDataModel({
            _collection: collectionName,
            userId: userId ? new _mongoose1.Types.ObjectId(userId) : null,
            databaseId: new _mongoose1.Types.ObjectId(databaseId),
            _data: data,
            createdBy: userId,
            updatedBy: userId
        });
        const saved = await document.save();
        return this.transformDocument(saved);
    }
    /**
   * Lấy danh sách documents trong collection của user
   */ async findAll(collectionName, userId, databaseId, paginationDto, filter) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        // Kiểm tra collection schema (không check ownership)
        const schema = await this.collectionSchemaService.findByNamePublic(collectionName, databaseId);
        if (!schema) {
            throw new _common.NotFoundException(`Collection schema "${collectionName}" not found`);
        }
        // Build query
        const query = {
            _collection: collectionName,
            databaseId: new _mongoose1.Types.ObjectId(databaseId),
            deletedAt: null
        };
        // Chỉ thêm userId filter nếu có
        if (userId) {
            query.userId = new _mongoose1.Types.ObjectId(userId);
        }
        // Thêm filter nếu có
        if (filter) {
            Object.keys(filter).forEach((key)=>{
                query[`_data.${key}`] = filter[key];
            });
        }
        // Thêm search nếu có
        if (search) {
            const searchableFields = schema.fields.filter((f)=>f.searchable).map((f)=>f.name);
            if (searchableFields.length > 0) {
                query.$or = searchableFields.map((fieldName)=>({
                        [`_data.${fieldName}`]: {
                            $regex: search,
                            $options: 'i'
                        }
                    }));
            }
        }
        const [data, total] = await Promise.all([
            this.dynamicDataModel.find(query).skip(skip).limit(limit).sort({
                createdAt: -1
            }).exec(),
            this.dynamicDataModel.countDocuments(query).exec()
        ]);
        return {
            data: this.transformDocuments(data),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    /**
   * Lấy document theo ID và kiểm tra ownership
   */ async findById(collectionName, id, userId, databaseId) {
        const query = {
            _id: id,
            _collection: collectionName,
            databaseId: new _mongoose1.Types.ObjectId(databaseId),
            deletedAt: null
        };
        if (userId) {
            query.userId = new _mongoose1.Types.ObjectId(userId);
        }
        const document = await this.dynamicDataModel.findOne(query).exec();
        if (!document) {
            throw new _common.NotFoundException(`Document not found in collection "${collectionName}"`);
        }
        return this.transformDocument(document);
    }
    /**
   * Cập nhật document
   */ async update(collectionName, id, databaseId, data, userId) {
        // Kiểm tra document có tồn tại không và kiểm tra ownership
        const query = {
            _id: id,
            _collection: collectionName,
            databaseId: new _mongoose1.Types.ObjectId(databaseId),
            deletedAt: null
        };
        if (userId) {
            query.userId = new _mongoose1.Types.ObjectId(userId);
        }
        const existing = await this.dynamicDataModel.findOne(query).exec();
        if (!existing) {
            throw new _common.NotFoundException(`Document not found in collection "${collectionName}"`);
        }
        // Merge data cũ với data mới
        const mergedData = {
            ...existing._data,
            ...data
        };
        // Validate dữ liệu mới (public)
        const validation = await this.collectionSchemaService.validateDataPublic(collectionName, databaseId, mergedData);
        if (!validation.valid) {
            throw new _common.BadRequestException({
                message: 'Validation failed',
                errors: validation.errors
            });
        }
        // Cập nhật
        const updated = await this.dynamicDataModel.findByIdAndUpdate(id, {
            _data: mergedData,
            updatedBy: userId
        }, {
            new: true
        }).exec();
        return this.transformDocument(updated);
    }
    /**
   * Thay thế hoàn toàn document (PUT)
   */ async replace(collectionName, id, databaseId, data, userId) {
        // Kiểm tra document có tồn tại không và kiểm tra ownership
        const query = {
            _id: id,
            _collection: collectionName,
            databaseId: new _mongoose1.Types.ObjectId(databaseId),
            deletedAt: null
        };
        if (userId) {
            query.userId = new _mongoose1.Types.ObjectId(userId);
        }
        const existing = await this.dynamicDataModel.findOne(query).exec();
        if (!existing) {
            throw new _common.NotFoundException(`Document not found in collection "${collectionName}"`);
        }
        // Validate dữ liệu mới (không merge, thay thế hoàn toàn) - public
        const validation = await this.collectionSchemaService.validateDataPublic(collectionName, databaseId, data);
        if (!validation.valid) {
            throw new _common.BadRequestException({
                message: 'Validation failed',
                errors: validation.errors
            });
        }
        // Thay thế hoàn toàn
        const replaced = await this.dynamicDataModel.findByIdAndUpdate(id, {
            _data: data,
            updatedBy: userId
        }, {
            new: true
        }).exec();
        return this.transformDocument(replaced);
    }
    /**
   * Xóa document (soft delete)
   */ async softDelete(collectionName, id, userId, databaseId) {
        const document = await this.findById(collectionName, id, userId, databaseId);
        if (!document) {
            throw new _common.NotFoundException(`Document not found in collection "${collectionName}"`);
        }
        const deleted = await this.dynamicDataModel.findByIdAndUpdate(id, {
            deletedAt: new Date()
        }, {
            new: true
        }).exec();
        return this.transformDocument(deleted);
    }
    /**
   * Xóa document vĩnh viễn
   */ async hardDelete(collectionName, id, userId, databaseId) {
        const query = {
            _id: id,
            _collection: collectionName,
            databaseId: new _mongoose1.Types.ObjectId(databaseId)
        };
        if (userId) {
            query.userId = new _mongoose1.Types.ObjectId(userId);
        }
        const document = await this.dynamicDataModel.findOne(query).exec();
        if (!document) {
            throw new _common.NotFoundException(`Document not found in collection "${collectionName}"`);
        }
        const deleted = await this.dynamicDataModel.findByIdAndDelete(id).exec();
        return this.transformDocument(deleted);
    }
    /**
   * Restore document đã xóa
   */ async restore(collectionName, id, userId, databaseId) {
        const query = {
            _id: id,
            _collection: collectionName,
            databaseId: new _mongoose1.Types.ObjectId(databaseId)
        };
        if (userId) {
            query.userId = new _mongoose1.Types.ObjectId(userId);
        }
        const document = await this.dynamicDataModel.findOne(query).exec();
        if (!document) {
            throw new _common.NotFoundException(`Document not found in collection "${collectionName}"`);
        }
        const restored = await this.dynamicDataModel.findByIdAndUpdate(id, {
            deletedAt: null
        }, {
            new: true
        }).exec();
        return this.transformDocument(restored);
    }
    /**
   * Query với điều kiện phức tạp
   */ async query(collectionName, queryFilter, options) {
        const query = {
            _collection: collectionName,
            deletedAt: null
        };
        // Transform filter to query _data fields
        Object.keys(queryFilter).forEach((key)=>{
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
        const results = await queryBuilder.exec();
        return this.transformDocuments(results);
    }
    /**
   * Đếm số lượng documents
   */ async count(collectionName, filter) {
        const query = {
            _collection: collectionName,
            deletedAt: null
        };
        if (filter) {
            Object.keys(filter).forEach((key)=>{
                query[`_data.${key}`] = filter[key];
            });
        }
        return this.dynamicDataModel.countDocuments(query).exec();
    }
    constructor(dynamicDataModel, collectionSchemaService){
        this.dynamicDataModel = dynamicDataModel;
        this.collectionSchemaService = collectionSchemaService;
    }
};
DynamicDataService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_dynamicdataschema.DynamicData.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _collectionschemaservice.CollectionSchemaService === "undefined" ? Object : _collectionschemaservice.CollectionSchemaService
    ])
], DynamicDataService);

//# sourceMappingURL=dynamic-data.service.js.map