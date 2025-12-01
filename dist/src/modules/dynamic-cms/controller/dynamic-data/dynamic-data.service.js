"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicDataService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dynamic_data_schema_1 = require("../../schemas/dynamic-data.schema");
const collection_schema_service_1 = require("../collection-schema/collection-schema.service");
let DynamicDataService = class DynamicDataService {
    constructor(dynamicDataModel, collectionSchemaService) {
        this.dynamicDataModel = dynamicDataModel;
        this.collectionSchemaService = collectionSchemaService;
    }
    transformDocument(doc) {
        if (!doc)
            return null;
        const plainDoc = doc.toObject ? doc.toObject() : doc;
        const { _data, ...rest } = plainDoc;
        return {
            ...rest,
            ..._data,
        };
    }
    transformDocuments(docs) {
        return docs.map((doc) => this.transformDocument(doc));
    }
    async create(collectionName, databaseId, data, userId) {
        const schema = await this.collectionSchemaService.findByNamePublic(collectionName, databaseId);
        if (!schema) {
            throw new common_1.NotFoundException(`Collection schema "${collectionName}" not found`);
        }
        const validation = await this.collectionSchemaService.validateDataPublic(collectionName, databaseId, data);
        if (!validation.valid) {
            throw new common_1.BadRequestException({
                message: 'Validation failed',
                errors: validation.errors,
            });
        }
        const document = new this.dynamicDataModel({
            _collection: collectionName,
            userId: userId ? new mongoose_2.Types.ObjectId(userId) : null,
            databaseId: new mongoose_2.Types.ObjectId(databaseId),
            _data: data,
            createdBy: userId,
            updatedBy: userId,
        });
        const saved = await document.save();
        return this.transformDocument(saved);
    }
    async findAll(collectionName, userId, databaseId, paginationDto, filter) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const schema = await this.collectionSchemaService.findByNamePublic(collectionName, databaseId);
        if (!schema) {
            throw new common_1.NotFoundException(`Collection schema "${collectionName}" not found`);
        }
        const query = {
            _collection: collectionName,
            databaseId: new mongoose_2.Types.ObjectId(databaseId),
            deletedAt: null,
        };
        if (userId) {
            query.userId = new mongoose_2.Types.ObjectId(userId);
        }
        if (filter) {
            Object.keys(filter).forEach((key) => {
                query[`_data.${key}`] = filter[key];
            });
        }
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
            data: this.transformDocuments(data),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(collectionName, id, userId, databaseId) {
        const query = {
            _id: id,
            _collection: collectionName,
            databaseId: new mongoose_2.Types.ObjectId(databaseId),
            deletedAt: null,
        };
        if (userId) {
            query.userId = new mongoose_2.Types.ObjectId(userId);
        }
        const document = await this.dynamicDataModel.findOne(query).exec();
        if (!document) {
            throw new common_1.NotFoundException(`Document not found in collection "${collectionName}"`);
        }
        return this.transformDocument(document);
    }
    async update(collectionName, id, databaseId, data, userId) {
        const query = {
            _id: id,
            _collection: collectionName,
            databaseId: new mongoose_2.Types.ObjectId(databaseId),
            deletedAt: null,
        };
        if (userId) {
            query.userId = new mongoose_2.Types.ObjectId(userId);
        }
        const existing = await this.dynamicDataModel.findOne(query).exec();
        if (!existing) {
            throw new common_1.NotFoundException(`Document not found in collection "${collectionName}"`);
        }
        const mergedData = { ...existing._data, ...data };
        const validation = await this.collectionSchemaService.validateDataPublic(collectionName, databaseId, mergedData);
        if (!validation.valid) {
            throw new common_1.BadRequestException({
                message: 'Validation failed',
                errors: validation.errors,
            });
        }
        const updated = await this.dynamicDataModel
            .findByIdAndUpdate(id, {
            _data: mergedData,
            updatedBy: userId,
        }, { new: true })
            .exec();
        return this.transformDocument(updated);
    }
    async replace(collectionName, id, databaseId, data, userId) {
        const query = {
            _id: id,
            _collection: collectionName,
            databaseId: new mongoose_2.Types.ObjectId(databaseId),
            deletedAt: null,
        };
        if (userId) {
            query.userId = new mongoose_2.Types.ObjectId(userId);
        }
        const existing = await this.dynamicDataModel.findOne(query).exec();
        if (!existing) {
            throw new common_1.NotFoundException(`Document not found in collection "${collectionName}"`);
        }
        const validation = await this.collectionSchemaService.validateDataPublic(collectionName, databaseId, data);
        if (!validation.valid) {
            throw new common_1.BadRequestException({
                message: 'Validation failed',
                errors: validation.errors,
            });
        }
        const replaced = await this.dynamicDataModel
            .findByIdAndUpdate(id, {
            _data: data,
            updatedBy: userId,
        }, { new: true })
            .exec();
        return this.transformDocument(replaced);
    }
    async softDelete(collectionName, id, userId, databaseId) {
        const document = await this.findById(collectionName, id, userId, databaseId);
        if (!document) {
            throw new common_1.NotFoundException(`Document not found in collection "${collectionName}"`);
        }
        const deleted = await this.dynamicDataModel
            .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
            .exec();
        return this.transformDocument(deleted);
    }
    async hardDelete(collectionName, id, userId, databaseId) {
        const query = {
            _id: id,
            _collection: collectionName,
            databaseId: new mongoose_2.Types.ObjectId(databaseId),
        };
        if (userId) {
            query.userId = new mongoose_2.Types.ObjectId(userId);
        }
        const document = await this.dynamicDataModel.findOne(query).exec();
        if (!document) {
            throw new common_1.NotFoundException(`Document not found in collection "${collectionName}"`);
        }
        const deleted = await this.dynamicDataModel.findByIdAndDelete(id).exec();
        return this.transformDocument(deleted);
    }
    async restore(collectionName, id, userId, databaseId) {
        const query = {
            _id: id,
            _collection: collectionName,
            databaseId: new mongoose_2.Types.ObjectId(databaseId),
        };
        if (userId) {
            query.userId = new mongoose_2.Types.ObjectId(userId);
        }
        const document = await this.dynamicDataModel.findOne(query).exec();
        if (!document) {
            throw new common_1.NotFoundException(`Document not found in collection "${collectionName}"`);
        }
        const restored = await this.dynamicDataModel
            .findByIdAndUpdate(id, { deletedAt: null }, { new: true })
            .exec();
        return this.transformDocument(restored);
    }
    async query(collectionName, queryFilter, options) {
        const query = {
            _collection: collectionName,
            deletedAt: null,
        };
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
        const results = await queryBuilder.exec();
        return this.transformDocuments(results);
    }
    async count(collectionName, filter) {
        const query = {
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
};
exports.DynamicDataService = DynamicDataService;
exports.DynamicDataService = DynamicDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(dynamic_data_schema_1.DynamicData.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        collection_schema_service_1.CollectionSchemaService])
], DynamicDataService);
//# sourceMappingURL=dynamic-data.service.js.map