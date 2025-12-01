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
exports.CollectionSchemaService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const collection_schema_schema_1 = require("../../schemas/collection-schema.schema");
const field_types_interface_1 = require("../../interfaces/field-types.interface");
const validation_dto_1 = require("../../../../common/dto/validation.dto");
let CollectionSchemaService = class CollectionSchemaService {
    constructor(collectionSchemaModel) {
        this.collectionSchemaModel = collectionSchemaModel;
    }
    async create(createDto, userId) {
        const existing = await this.collectionSchemaModel
            .findOne({
            databaseId: new mongoose_2.Types.ObjectId(createDto.databaseId),
            name: createDto.name,
        })
            .exec();
        if (existing) {
            throw new common_1.BadRequestException(`Collection with name "${createDto.name}" already exists in this database`);
        }
        const fieldNames = createDto.fields.map((f) => f.name);
        const uniqueNames = new Set(fieldNames);
        if (fieldNames.length !== uniqueNames.size) {
            throw new common_1.BadRequestException('Field names must be unique');
        }
        const schema = new this.collectionSchemaModel({
            ...createDto,
            databaseId: new mongoose_2.Types.ObjectId(createDto.databaseId),
            userId: new mongoose_2.Types.ObjectId(userId),
            createdBy: userId,
            version: 1,
        });
        return schema.save();
    }
    async findAll(paginationDto, userId, databaseId) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const query = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (databaseId) {
            query.databaseId = new mongoose_2.Types.ObjectId(databaseId);
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
    async findById(id, userId) {
        const schema = await this.collectionSchemaModel.findById(id).exec();
        if (!schema) {
            throw new common_1.NotFoundException(`Collection schema with id "${id}" not found`);
        }
        if (schema.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this collection');
        }
        return schema;
    }
    async findByName(name, userId, databaseId) {
        return this.collectionSchemaModel
            .findOne({
            name,
            userId: new mongoose_2.Types.ObjectId(userId),
            databaseId: new mongoose_2.Types.ObjectId(databaseId),
        })
            .exec();
    }
    async findByNamePublic(name, databaseId) {
        return this.collectionSchemaModel
            .findOne({
            name,
            databaseId: new mongoose_2.Types.ObjectId(databaseId),
        })
            .exec();
    }
    async findAllSchemas(userId, databaseId) {
        const query = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (databaseId) {
            query.databaseId = new mongoose_2.Types.ObjectId(databaseId);
        }
        return this.collectionSchemaModel
            .find(query)
            .select('-fields')
            .sort({ displayName: 1 })
            .exec();
    }
    async update(id, updateDto, userId) {
        const schema = await this.collectionSchemaModel.findById(id).exec();
        if (!schema) {
            throw new common_1.NotFoundException(`Collection schema with id "${id}" not found`);
        }
        if (schema.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this collection');
        }
        if (updateDto.fields) {
            const fieldNames = updateDto.fields.map((f) => f.name);
            const uniqueNames = new Set(fieldNames);
            if (fieldNames.length !== uniqueNames.size) {
                throw new common_1.BadRequestException('Field names must be unique');
            }
        }
        const updatedSchema = await this.collectionSchemaModel
            .findByIdAndUpdate(id, {
            ...updateDto,
            version: schema.version + 1,
        }, { new: true })
            .exec();
        return updatedSchema;
    }
    async remove(id, userId) {
        const schema = await this.collectionSchemaModel.findById(id).exec();
        if (!schema) {
            throw new common_1.NotFoundException(`Collection schema with id "${id}" not found`);
        }
        if (schema.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this collection');
        }
        return this.collectionSchemaModel.findByIdAndDelete(id).exec();
    }
    async validateData(collectionName, userId, databaseId, data) {
        const errors = [];
        const schema = await this.findByName(collectionName, userId, databaseId);
        if (!schema) {
            throw new common_1.NotFoundException(`Collection schema "${collectionName}" not found`);
        }
        const systemFields = ['id', '_id', 'createdAt', 'updatedAt', '__v'];
        for (const field of schema.fields) {
            if (systemFields.includes(field.name)) {
                continue;
            }
            const value = data[field.name];
            const validation = field.validation || {};
            if (validation.required &&
                (value === undefined || value === null || value === '')) {
                errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} is required`));
                continue;
            }
            if (value === undefined || value === null) {
                continue;
            }
            const actualType = typeof value;
            let isValidType = false;
            switch (field.type) {
                case field_types_interface_1.FieldType.STRING:
                case field_types_interface_1.FieldType.TEXT:
                case field_types_interface_1.FieldType.TEXTAREA:
                case field_types_interface_1.FieldType.EMAIL:
                case field_types_interface_1.FieldType.URL:
                case field_types_interface_1.FieldType.RICH_TEXT:
                    isValidType = actualType === 'string';
                    break;
                case field_types_interface_1.FieldType.NUMBER:
                    isValidType = actualType === 'number' && !isNaN(value);
                    break;
                case field_types_interface_1.FieldType.BOOLEAN:
                case field_types_interface_1.FieldType.CHECKBOX:
                    isValidType = actualType === 'boolean';
                    break;
                case field_types_interface_1.FieldType.DATE:
                case field_types_interface_1.FieldType.DATETIME:
                    isValidType = !isNaN(Date.parse(value));
                    break;
                case field_types_interface_1.FieldType.ARRAY:
                case field_types_interface_1.FieldType.MULTI_SELECT:
                    isValidType = Array.isArray(value);
                    break;
                case field_types_interface_1.FieldType.JSON:
                    isValidType = actualType === 'object' && !Array.isArray(value);
                    break;
                case field_types_interface_1.FieldType.REFERENCE:
                    isValidType =
                        actualType === 'string' || mongoose_2.Types.ObjectId.isValid(value);
                    break;
                case field_types_interface_1.FieldType.SELECT:
                case field_types_interface_1.FieldType.RADIO:
                    isValidType = actualType === 'string' || actualType === 'number';
                    break;
                case field_types_interface_1.FieldType.FILE:
                case field_types_interface_1.FieldType.IMAGE:
                    isValidType = actualType === 'string';
                    break;
                default:
                    isValidType = true;
            }
            if (!isValidType) {
                errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} must be of type ${field.type}, got ${actualType}`));
            }
            if (validation.enum && validation.enum.length > 0) {
                if (!validation.enum.includes(value)) {
                    errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} must be one of: ${validation.enum.join(', ')}`));
                }
            }
            if (field.type === field_types_interface_1.FieldType.NUMBER && typeof value === 'number') {
                if (validation.min !== undefined && value < validation.min) {
                    errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} must be at least ${validation.min}`));
                }
                if (validation.max !== undefined && value > validation.max) {
                    errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} must be at most ${validation.max}`));
                }
            }
            if ((field.type === field_types_interface_1.FieldType.STRING ||
                field.type === field_types_interface_1.FieldType.TEXT ||
                field.type === field_types_interface_1.FieldType.TEXTAREA) &&
                typeof value === 'string') {
                if (validation.minLength !== undefined &&
                    value.length < validation.minLength) {
                    errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} must be at least ${validation.minLength} characters`));
                }
                if (validation.maxLength !== undefined &&
                    value.length > validation.maxLength) {
                    errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} must be at most ${validation.maxLength} characters`));
                }
            }
            if (validation.pattern && typeof value === 'string') {
                const regex = new RegExp(validation.pattern);
                if (!regex.test(value)) {
                    errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} does not match the required pattern`));
                }
            }
        }
        return (0, validation_dto_1.createValidationResponse)(errors);
    }
    async validateDataPublic(collectionName, databaseId, data) {
        const errors = [];
        const schema = await this.findByNamePublic(collectionName, databaseId);
        if (!schema) {
            throw new common_1.NotFoundException(`Collection schema "${collectionName}" not found`);
        }
        const systemFields = ['id', '_id', 'createdAt', 'updatedAt', '__v'];
        for (const field of schema.fields) {
            if (systemFields.includes(field.name)) {
                continue;
            }
            const value = data[field.name];
            const validation = field.validation || {};
            if (validation.required &&
                (value === undefined || value === null || value === '')) {
                errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} is required`));
                continue;
            }
            if (value === undefined || value === null) {
                continue;
            }
            if (field.type === field_types_interface_1.FieldType.NUMBER && typeof value === 'number') {
                if (validation.min !== undefined && value < validation.min) {
                    errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} must be at least ${validation.min}`));
                }
                if (validation.max !== undefined && value > validation.max) {
                    errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} must be at most ${validation.max}`));
                }
            }
            if ((field.type === field_types_interface_1.FieldType.STRING ||
                field.type === field_types_interface_1.FieldType.TEXT ||
                field.type === field_types_interface_1.FieldType.TEXTAREA) &&
                typeof value === 'string') {
                if (validation.minLength !== undefined &&
                    value.length < validation.minLength) {
                    errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} must be at least ${validation.minLength} characters`));
                }
                if (validation.maxLength !== undefined &&
                    value.length > validation.maxLength) {
                    errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} must be at most ${validation.maxLength} characters`));
                }
            }
            if (validation.pattern && typeof value === 'string') {
                const regex = new RegExp(validation.pattern);
                if (!regex.test(value)) {
                    errors.push((0, validation_dto_1.createValidationError)(field.name, `${field.label || field.name} does not match the required pattern`));
                }
            }
        }
        return (0, validation_dto_1.createValidationResponse)(errors);
    }
};
exports.CollectionSchemaService = CollectionSchemaService;
exports.CollectionSchemaService = CollectionSchemaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(collection_schema_schema_1.CollectionSchemaModel.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CollectionSchemaService);
//# sourceMappingURL=collection-schema.service.js.map