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
const _relationshipservice = require("./relationship.service");
const _fieldtypesinterface = require("../../interfaces/field-types.interface");
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
   */ async create(collectionName, databaseId, data, userId, options) {
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
        // Validate references nếu có
        await this.validateReferencesInData(schema, databaseId, data);
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
        let result = this.transformDocument(saved);
        // Populate nếu được yêu cầu
        if (options?.populate) {
            result = await this.relationshipService.populateDocument(collectionName, databaseId, result, options.populateDepth || 1);
        }
        return result;
    }
    /**
   * Validate tất cả references trong data
   */ async validateReferencesInData(schema, databaseId, data) {
        const referenceFields = schema.fields.filter((field)=>field.type === _fieldtypesinterface.FieldType.REFERENCE && field.referenceConfig);
        for (const field of referenceFields){
            const refConfig = field.referenceConfig;
            const fieldValue = data[field.name];
            if (!fieldValue) continue;
            if (refConfig.multiple && Array.isArray(fieldValue)) {
                // Validate multiple references
                const validation = await this.relationshipService.validateReferences(refConfig.collection, databaseId, fieldValue);
                if (!validation.valid) {
                    throw new _common.BadRequestException(`Invalid references in field "${field.name}": ${validation.invalidIds.join(', ')}`);
                }
            } else if (!Array.isArray(fieldValue)) {
                // Validate single reference
                const isValid = await this.relationshipService.validateReference(refConfig.collection, databaseId, fieldValue);
                if (!isValid) {
                    throw new _common.BadRequestException(`Invalid reference in field "${field.name}": ${fieldValue}`);
                }
            }
        }
    }
    /**
   * Tạo nhiều documents cùng lúc (bulk create)
   */ async createMany(collectionName, databaseId, dataArray, userId) {
        // Kiểm tra collection schema có tồn tại không
        const schema = await this.collectionSchemaService.findByNamePublic(collectionName, databaseId);
        if (!schema) {
            throw new _common.NotFoundException(`Collection schema "${collectionName}" not found`);
        }
        const results = [];
        let successCount = 0;
        let failedCount = 0;
        // Xử lý từng document
        for(let i = 0; i < dataArray.length; i++){
            try {
                const data = dataArray[i];
                // Validate dữ liệu
                const validation = await this.collectionSchemaService.validateDataPublic(collectionName, databaseId, data);
                if (!validation.valid) {
                    results.push({
                        success: false,
                        error: `Validation failed: ${JSON.stringify(validation.errors)}`,
                        index: i
                    });
                    failedCount++;
                    continue;
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
                results.push({
                    success: true,
                    data: this.transformDocument(saved),
                    index: i
                });
                successCount++;
            } catch (error) {
                results.push({
                    success: false,
                    error: error.message || 'Unknown error',
                    index: i
                });
                failedCount++;
            }
        }
        return {
            success: successCount,
            failed: failedCount,
            results
        };
    }
    /**
   * Thay thế toàn bộ data cũ bằng data mới (replace all)
   * Xóa tất cả documents cũ và tạo mới từ mảng
   */ async replaceAll(collectionName, databaseId, dataArray, userId) {
        // Kiểm tra collection schema có tồn tại không
        const schema = await this.collectionSchemaService.findByNamePublic(collectionName, databaseId);
        if (!schema) {
            throw new _common.NotFoundException(`Collection schema "${collectionName}" not found`);
        }
        // Xóa tất cả documents cũ trong collection
        const deleteQuery = {
            _collection: collectionName,
            databaseId: new _mongoose1.Types.ObjectId(databaseId)
        };
        // Chỉ xóa documents của user nếu có userId
        if (userId) {
            deleteQuery.userId = new _mongoose1.Types.ObjectId(userId);
        }
        const deleteResult = await this.dynamicDataModel.deleteMany(deleteQuery);
        const deletedCount = deleteResult.deletedCount || 0;
        // Tạo documents mới
        const results = [];
        let createdCount = 0;
        let failedCount = 0;
        for(let i = 0; i < dataArray.length; i++){
            try {
                const data = dataArray[i];
                // Validate dữ liệu
                const validation = await this.collectionSchemaService.validateDataPublic(collectionName, databaseId, data);
                if (!validation.valid) {
                    results.push({
                        success: false,
                        error: `Validation failed: ${JSON.stringify(validation.errors)}`,
                        index: i
                    });
                    failedCount++;
                    continue;
                }
                // Tạo document mới
                const document = new this.dynamicDataModel({
                    _collection: collectionName,
                    userId: userId ? new _mongoose1.Types.ObjectId(userId) : null,
                    databaseId: new _mongoose1.Types.ObjectId(databaseId),
                    _data: data,
                    createdBy: userId,
                    updatedBy: userId
                });
                const saved = await document.save();
                results.push({
                    success: true,
                    data: this.transformDocument(saved),
                    index: i
                });
                createdCount++;
            } catch (error) {
                results.push({
                    success: false,
                    error: error.message || 'Unknown error',
                    index: i
                });
                failedCount++;
            }
        }
        return {
            deleted: deletedCount,
            created: createdCount,
            failed: failedCount,
            results
        };
    }
    /**
   * Lấy danh sách documents trong collection của user
   */ async findAll(collectionName, userId, databaseId, paginationDto, filter, options) {
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
        let transformedData = this.transformDocuments(data);
        // Populate nếu được yêu cầu
        if (options?.populate) {
            transformedData = await this.relationshipService.populateDocuments(collectionName, databaseId, transformedData, options.populateDepth || 1);
        }
        return {
            data: transformedData,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    /**
   * Lấy document theo ID và kiểm tra ownership
   */ async findById(collectionName, id, userId, databaseId, options) {
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
        let result = this.transformDocument(document);
        // Populate nếu được yêu cầu
        if (options?.populate) {
            result = await this.relationshipService.populateDocument(collectionName, databaseId, result, options.populateDepth || 1);
        }
        return result;
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
    constructor(dynamicDataModel, collectionSchemaService, relationshipService){
        this.dynamicDataModel = dynamicDataModel;
        this.collectionSchemaService = collectionSchemaService;
        this.relationshipService = relationshipService;
    }
};
DynamicDataService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_dynamicdataschema.DynamicData.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _collectionschemaservice.CollectionSchemaService === "undefined" ? Object : _collectionschemaservice.CollectionSchemaService,
        typeof _relationshipservice.RelationshipService === "undefined" ? Object : _relationshipservice.RelationshipService
    ])
], DynamicDataService);

//# sourceMappingURL=dynamic-data.service.js.map