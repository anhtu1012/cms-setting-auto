"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CollectionSchemaService", {
    enumerable: true,
    get: function() {
        return CollectionSchemaService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _collectionschemaschema = require("../../schemas/collection-schema.schema");
const _fieldtypesinterface = require("../../interfaces/field-types.interface");
const _validationdto = require("../../../../common/dto/validation.dto");
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
let CollectionSchemaService = class CollectionSchemaService {
    /**
   * Tạo collection schema mới
   */ async create(createDto, userId) {
        // Kiểm tra xem collection name đã tồn tại trong database này chưa
        const existing = await this.collectionSchemaModel.findOne({
            databaseId: new _mongoose1.Types.ObjectId(createDto.databaseId),
            name: createDto.name
        }).exec();
        if (existing) {
            throw new _common.BadRequestException(`Collection with name "${createDto.name}" already exists in this database`);
        }
        // Validate field names không trùng nhau
        const fieldNames = createDto.fields.map((f)=>f.name);
        const uniqueNames = new Set(fieldNames);
        if (fieldNames.length !== uniqueNames.size) {
            throw new _common.BadRequestException('Field names must be unique');
        }
        // Tạo collection schema
        const schema = new this.collectionSchemaModel({
            ...createDto,
            databaseId: new _mongoose1.Types.ObjectId(createDto.databaseId),
            userId: new _mongoose1.Types.ObjectId(userId),
            createdBy: userId,
            version: 1
        });
        return schema.save();
    }
    /**
   * Lấy danh sách collection schemas của user trong database
   */ async findAll(paginationDto, userId, databaseId) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const query = {
            userId: new _mongoose1.Types.ObjectId(userId)
        };
        if (databaseId) {
            query.databaseId = new _mongoose1.Types.ObjectId(databaseId);
        }
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    displayName: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }
        const [data, total] = await Promise.all([
            this.collectionSchemaModel.find(query).skip(skip).limit(limit).sort({
                createdAt: -1
            }).exec(),
            this.collectionSchemaModel.countDocuments(query).exec()
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    /**
   * Lấy collection schema theo ID và kiểm tra ownership
   */ async findById(id, userId) {
        const schema = await this.collectionSchemaModel.findById(id).exec();
        if (!schema) {
            throw new _common.NotFoundException(`Collection schema with id "${id}" not found`);
        }
        if (schema.userId.toString() !== userId) {
            throw new _common.ForbiddenException('You do not have access to this collection');
        }
        return schema;
    }
    /**
   * Lấy collection schema theo name trong database của user (có check ownership)
   */ async findByName(name, userId, databaseId) {
        return this.collectionSchemaModel.findOne({
            name,
            userId: new _mongoose1.Types.ObjectId(userId),
            databaseId: new _mongoose1.Types.ObjectId(databaseId)
        }).exec();
    }
    /**
   * Lấy collection schema theo name trong database (không check ownership)
   * Dùng cho public API - chỉ cần databaseId
   */ async findByNamePublic(name, databaseId) {
        return this.collectionSchemaModel.findOne({
            name,
            databaseId: new _mongoose1.Types.ObjectId(databaseId)
        }).exec();
    }
    /**
   * Lấy tất cả collection schemas của user (không phân trang)
   */ async findAllSchemas(userId, databaseId) {
        const query = {
            userId: new _mongoose1.Types.ObjectId(userId)
        };
        if (databaseId) {
            query.databaseId = new _mongoose1.Types.ObjectId(databaseId);
        }
        return this.collectionSchemaModel.find(query).select('-fields').sort({
            displayName: 1
        }).exec();
    }
    /**
   * Cập nhật collection schema
   */ async update(id, updateDto, userId) {
        const schema = await this.collectionSchemaModel.findById(id).exec();
        if (!schema) {
            throw new _common.NotFoundException(`Collection schema with id "${id}" not found`);
        }
        // Check ownership
        if (schema.userId.toString() !== userId) {
            throw new _common.ForbiddenException('You do not have access to this collection');
        }
        // Nếu update fields, validate field names
        if (updateDto.fields) {
            const fieldNames = updateDto.fields.map((f)=>f.name);
            const uniqueNames = new Set(fieldNames);
            if (fieldNames.length !== uniqueNames.size) {
                throw new _common.BadRequestException('Field names must be unique');
            }
        }
        // Tăng version khi update
        const updatedSchema = await this.collectionSchemaModel.findByIdAndUpdate(id, {
            ...updateDto,
            version: schema.version + 1
        }, {
            new: true
        }).exec();
        return updatedSchema;
    }
    /**
   * Xóa collection schema
   */ async remove(id, userId) {
        const schema = await this.collectionSchemaModel.findById(id).exec();
        if (!schema) {
            throw new _common.NotFoundException(`Collection schema with id "${id}" not found`);
        }
        // Check ownership
        if (schema.userId.toString() !== userId) {
            throw new _common.ForbiddenException('You do not have access to this collection');
        }
        // TODO: Kiểm tra xem có dữ liệu nào đang sử dụng schema này không
        // Nếu có thì cần warning hoặc không cho xóa
        return this.collectionSchemaModel.findByIdAndDelete(id).exec();
    }
    /**
   * Validate dữ liệu theo schema
   */ async validateData(collectionName, userId, databaseId, data) {
        const errors = [];
        // Lấy schema
        const schema = await this.findByName(collectionName, userId, databaseId);
        if (!schema) {
            throw new _common.NotFoundException(`Collection schema "${collectionName}" not found`);
        }
        // Danh sách các field tự động của hệ thống - không cần validate
        const systemFields = [
            'id',
            '_id',
            'createdAt',
            'updatedAt',
            '__v'
        ];
        // Validate từng field
        for (const field of schema.fields){
            // Bỏ qua các field hệ thống
            if (systemFields.includes(field.name)) {
                continue;
            }
            const value = data[field.name];
            const validation = field.validation || {};
            // Check required
            if (validation.required && (value === undefined || value === null || value === '')) {
                errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} is required`));
                continue;
            }
            // Nếu không có value và không required thì skip validation type
            if (value === undefined || value === null) {
                continue;
            }
            // Validate type
            const actualType = typeof value;
            let isValidType = false;
            switch(field.type){
                case _fieldtypesinterface.FieldType.STRING:
                case _fieldtypesinterface.FieldType.TEXT:
                case _fieldtypesinterface.FieldType.TEXTAREA:
                case _fieldtypesinterface.FieldType.EMAIL:
                case _fieldtypesinterface.FieldType.URL:
                case _fieldtypesinterface.FieldType.RICH_TEXT:
                    isValidType = actualType === 'string';
                    break;
                case _fieldtypesinterface.FieldType.NUMBER:
                    isValidType = actualType === 'number' && !isNaN(value);
                    break;
                case _fieldtypesinterface.FieldType.BOOLEAN:
                case _fieldtypesinterface.FieldType.CHECKBOX:
                    isValidType = actualType === 'boolean';
                    break;
                case _fieldtypesinterface.FieldType.DATE:
                case _fieldtypesinterface.FieldType.DATETIME:
                    isValidType = !isNaN(Date.parse(value));
                    break;
                case _fieldtypesinterface.FieldType.ARRAY:
                case _fieldtypesinterface.FieldType.MULTI_SELECT:
                    isValidType = Array.isArray(value);
                    break;
                case _fieldtypesinterface.FieldType.JSON:
                    isValidType = actualType === 'object' && !Array.isArray(value);
                    break;
                case _fieldtypesinterface.FieldType.REFERENCE:
                    // Reference có thể là ObjectId hoặc string
                    isValidType = actualType === 'string' || _mongoose1.Types.ObjectId.isValid(value);
                    break;
                case _fieldtypesinterface.FieldType.SELECT:
                case _fieldtypesinterface.FieldType.RADIO:
                    isValidType = actualType === 'string' || actualType === 'number';
                    break;
                case _fieldtypesinterface.FieldType.FILE:
                case _fieldtypesinterface.FieldType.IMAGE:
                    isValidType = actualType === 'string'; // URL string
                    break;
                default:
                    isValidType = true; // Unknown types pass
            }
            if (!isValidType) {
                errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} must be of type ${field.type}, got ${actualType}`));
            }
            // Validate enum
            if (validation.enum && validation.enum.length > 0) {
                if (!validation.enum.includes(value)) {
                    errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} must be one of: ${validation.enum.join(', ')}`));
                }
            }
            // Validate min/max for numbers
            if (field.type === _fieldtypesinterface.FieldType.NUMBER && typeof value === 'number') {
                if (validation.min !== undefined && value < validation.min) {
                    errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} must be at least ${validation.min}`));
                }
                if (validation.max !== undefined && value > validation.max) {
                    errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} must be at most ${validation.max}`));
                }
            }
            // Validate minLength/maxLength for strings
            if ((field.type === _fieldtypesinterface.FieldType.STRING || field.type === _fieldtypesinterface.FieldType.TEXT || field.type === _fieldtypesinterface.FieldType.TEXTAREA) && typeof value === 'string') {
                if (validation.minLength !== undefined && value.length < validation.minLength) {
                    errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} must be at least ${validation.minLength} characters`));
                }
                if (validation.maxLength !== undefined && value.length > validation.maxLength) {
                    errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} must be at most ${validation.maxLength} characters`));
                }
            }
            // Validate pattern (regex)
            if (validation.pattern && typeof value === 'string') {
                const regex = new RegExp(validation.pattern);
                if (!regex.test(value)) {
                    errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} does not match the required pattern`));
                }
            }
        // TODO: Validate unique
        // Cần inject DynamicDataModel để check uniqueness trong database
        }
        return (0, _validationdto.createValidationResponse)(errors);
    }
    /**
   * Validate dữ liệu theo schema (public - không check ownership)
   * Dùng cho dynamic-data public API
   */ async validateDataPublic(collectionName, databaseId, data) {
        const errors = [];
        // Lấy schema (không check ownership)
        const schema = await this.findByNamePublic(collectionName, databaseId);
        if (!schema) {
            throw new _common.NotFoundException(`Collection schema "${collectionName}" not found`);
        }
        // Danh sách các field tự động của hệ thống - không cần validate
        const systemFields = [
            'id',
            '_id',
            'createdAt',
            'updatedAt',
            '__v'
        ];
        // Validate từng field
        for (const field of schema.fields){
            // Bỏ qua các field hệ thống
            if (systemFields.includes(field.name)) {
                continue;
            }
            const value = data[field.name];
            const validation = field.validation || {};
            // Check required
            if (validation.required && (value === undefined || value === null || value === '')) {
                errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} is required`));
                continue; // Bỏ qua các validation khác nếu required fail
            }
            // Nếu value không có và không required thì skip validation
            if (value === undefined || value === null) {
                continue;
            }
            // Validate min/max for numbers
            if (field.type === _fieldtypesinterface.FieldType.NUMBER && typeof value === 'number') {
                if (validation.min !== undefined && value < validation.min) {
                    errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} must be at least ${validation.min}`));
                }
                if (validation.max !== undefined && value > validation.max) {
                    errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} must be at most ${validation.max}`));
                }
            }
            // Validate minLength/maxLength for strings
            if ((field.type === _fieldtypesinterface.FieldType.STRING || field.type === _fieldtypesinterface.FieldType.TEXT || field.type === _fieldtypesinterface.FieldType.TEXTAREA) && typeof value === 'string') {
                if (validation.minLength !== undefined && value.length < validation.minLength) {
                    errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} must be at least ${validation.minLength} characters`));
                }
                if (validation.maxLength !== undefined && value.length > validation.maxLength) {
                    errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} must be at most ${validation.maxLength} characters`));
                }
            }
            // Validate pattern (regex)
            if (validation.pattern && typeof value === 'string') {
                const regex = new RegExp(validation.pattern);
                if (!regex.test(value)) {
                    errors.push((0, _validationdto.createValidationError)(field.name, `${field.label || field.name} does not match the required pattern`));
                }
            }
        }
        return (0, _validationdto.createValidationResponse)(errors);
    }
    constructor(collectionSchemaModel){
        this.collectionSchemaModel = collectionSchemaModel;
    }
};
CollectionSchemaService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_collectionschemaschema.CollectionSchemaModel.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], CollectionSchemaService);

//# sourceMappingURL=collection-schema.service.js.map