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
exports.CollectionSchemaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const collection_schema_dto_1 = require("../../dto/collection-schema.dto");
const pagination_dto_1 = require("../../../../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const database_ownership_guard_1 = require("../../../../common/guards/database-ownership.guard");
const database_id_decorator_1 = require("../../../../common/decorators/database-id.decorator");
const collection_schema_service_1 = require("./collection-schema.service");
let CollectionSchemaController = class CollectionSchemaController {
    constructor(collectionSchemaService) {
        this.collectionSchemaService = collectionSchemaService;
    }
    create(createDto, databaseId, req) {
        const dto = { ...createDto, databaseId };
        return this.collectionSchemaService.create(dto, req.user.userId);
    }
    findAll(paginationDto, databaseId, req) {
        return this.collectionSchemaService.findAll(paginationDto, req.user.userId, databaseId);
    }
    findAllSchemas(paginationDto, databaseId, req) {
        return this.collectionSchemaService.findAll(paginationDto, req.user.userId, databaseId);
    }
    async findByName(name, databaseId, req) {
        const schema = await this.collectionSchemaService.findByName(name, req.user.userId, databaseId);
        if (!schema) {
            throw new common_1.NotFoundException(`Collection schema with name "${name}" not found`);
        }
        return schema;
    }
    findOne(id, req) {
        return this.collectionSchemaService.findById(id, req.user.userId);
    }
    update(id, updateDto, req) {
        return this.collectionSchemaService.update(id, updateDto, req.user.userId);
    }
    remove(id, req) {
        return this.collectionSchemaService.remove(id, req.user.userId);
    }
    validateData(collectionName, databaseId, data, req) {
        return this.collectionSchemaService.validateData(collectionName, req.user.userId, databaseId, data);
    }
};
exports.CollectionSchemaController = CollectionSchemaController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new collection schema (table)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Collection schema created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input or duplicate name' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, database_id_decorator_1.DatabaseId)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [collection_schema_dto_1.CreateCollectionSchemaDto, String, Object]),
    __metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all collection schemas with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Collection schemas retrieved' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, database_id_decorator_1.DatabaseId)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, Object]),
    __metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all collection schemas (paginated)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schemas retrieved (paginated)' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, database_id_decorator_1.DatabaseId)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, Object]),
    __metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "findAllSchemas", null);
__decorate([
    (0, common_1.Get)('by-name/:name'),
    (0, swagger_1.ApiOperation)({ summary: 'Get collection schema by name' }),
    (0, swagger_1.ApiParam)({
        name: 'name',
        example: 'products',
        description: 'Collection name',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schema found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Schema not found' }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, database_id_decorator_1.DatabaseId)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CollectionSchemaController.prototype, "findByName", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get collection schema by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schema found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Schema not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update collection schema' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schema updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Schema not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, collection_schema_dto_1.UpdateCollectionSchemaDto, Object]),
    __metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete collection schema' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schema deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Schema not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('validate/:collectionName'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate data against schema' }),
    (0, swagger_1.ApiParam)({ name: 'collectionName', example: 'products' }),
    (0, swagger_1.ApiBody)({
        description: 'Data to validate against the collection schema',
        schema: {
            type: 'object',
            example: {
                product_name: 'iPhone 15 Pro',
                sku: 'IPHONE-15-PRO',
                price: 999.99,
                category: 'electronics',
                in_stock: true,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Validation result returned',
        schema: {
            type: 'object',
            properties: {
                valid: { type: 'boolean', example: true },
                errors: {
                    type: 'array',
                    items: { type: 'string' },
                    example: [],
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('collectionName')),
    __param(1, (0, database_id_decorator_1.DatabaseId)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "validateData", null);
exports.CollectionSchemaController = CollectionSchemaController = __decorate([
    (0, swagger_1.ApiTags)('collection-schemas'),
    (0, common_1.Controller)('collection-schemas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, database_ownership_guard_1.DatabaseOwnershipGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({
        name: 'x-database-id',
        description: 'Database ID that user has access to',
        required: true,
        schema: { type: 'string', example: '507f1f77bcf86cd799439011' },
    }),
    __metadata("design:paramtypes", [collection_schema_service_1.CollectionSchemaService])
], CollectionSchemaController);
//# sourceMappingURL=collection-schema.controller.js.map