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
exports.DynamicDataController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../../../common/dto/pagination.dto");
const dynamic_data_service_1 = require("./dynamic-data.service");
let DynamicDataController = class DynamicDataController {
    constructor(dynamicDataService) {
        this.dynamicDataService = dynamicDataService;
    }
    create(databaseId, collectionName, data, req) {
        const userId = req?.user?.userId || null;
        return this.dynamicDataService.create(collectionName, databaseId, data, userId);
    }
    findAll(databaseId, collectionName, paginationDto, req) {
        const userId = req?.user?.userId || null;
        return this.dynamicDataService.findAll(collectionName, userId, databaseId, paginationDto);
    }
    query(databaseId, collectionName, body) {
        return this.dynamicDataService.query(collectionName, body.filter, {
            sort: body.sort,
            limit: body.limit,
            skip: body.skip,
        });
    }
    count(databaseId, collectionName) {
        return this.dynamicDataService.count(collectionName);
    }
    findOne(databaseId, collectionName, id, req) {
        const userId = req?.user?.userId || null;
        return this.dynamicDataService.findById(collectionName, id, userId, databaseId);
    }
    update(databaseId, collectionName, id, data, req) {
        const userId = req?.user?.userId || null;
        return this.dynamicDataService.update(collectionName, id, databaseId, data, userId);
    }
    replace(databaseId, collectionName, id, data, req) {
        const userId = req?.user?.userId || null;
        return this.dynamicDataService.replace(collectionName, id, databaseId, data, userId);
    }
    softDelete(databaseId, collectionName, id, req) {
        const userId = req?.user?.userId || null;
        return this.dynamicDataService.softDelete(collectionName, id, userId, databaseId);
    }
    hardDelete(databaseId, collectionName, id, req) {
        const userId = req?.user?.userId || null;
        return this.dynamicDataService.hardDelete(collectionName, id, userId, databaseId);
    }
    restore(databaseId, collectionName, id, req) {
        const userId = req?.user?.userId || null;
        return this.dynamicDataService.restore(collectionName, id, userId, databaseId);
    }
};
exports.DynamicDataController = DynamicDataController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new document in dynamic collection' }),
    (0, swagger_1.ApiParam)({ name: 'databaseId', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiParam)({ name: 'collectionName', example: 'products' }),
    (0, swagger_1.ApiBody)({
        description: 'Document data to create',
        schema: {
            type: 'object',
            example: {
                product_name: 'iPhone 15 Pro',
                sku: 'IPHONE-15-PRO',
                price: 999.99,
                category: 'electronics',
                description: 'Latest iPhone model',
                tags: ['new', 'bestseller'],
                in_stock: true,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Document created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Collection schema not found' }),
    __param(0, (0, common_1.Param)('databaseId')),
    __param(1, (0, common_1.Param)('collectionName')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], DynamicDataController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all documents from dynamic collection' }),
    (0, swagger_1.ApiParam)({ name: 'databaseId', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiParam)({ name: 'collectionName', example: 'products' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Documents retrieved' }),
    __param(0, (0, common_1.Param)('databaseId')),
    __param(1, (0, common_1.Param)('collectionName')),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", void 0)
], DynamicDataController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('query'),
    (0, swagger_1.ApiOperation)({ summary: 'Query documents with custom filter' }),
    (0, swagger_1.ApiParam)({ name: 'databaseId', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiParam)({ name: 'collectionName', example: 'products' }),
    (0, swagger_1.ApiBody)({
        description: 'Query filter with optional sort, limit, skip',
        schema: {
            type: 'object',
            properties: {
                filter: {
                    type: 'object',
                    example: { category: 'electronics', in_stock: true },
                },
                sort: {
                    type: 'object',
                    example: { price: -1, createdAt: -1 },
                },
                limit: { type: 'number', example: 20 },
                skip: { type: 'number', example: 0 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Query results returned' }),
    __param(0, (0, common_1.Param)('databaseId')),
    __param(1, (0, common_1.Param)('collectionName')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], DynamicDataController.prototype, "query", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Count documents in collection' }),
    (0, swagger_1.ApiParam)({ name: 'databaseId', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiParam)({ name: 'collectionName', example: 'products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Count returned' }),
    __param(0, (0, common_1.Param)('databaseId')),
    __param(1, (0, common_1.Param)('collectionName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DynamicDataController.prototype, "count", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get document by ID' }),
    (0, swagger_1.ApiParam)({ name: 'databaseId', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiParam)({ name: 'collectionName', example: 'products' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    __param(0, (0, common_1.Param)('databaseId')),
    __param(1, (0, common_1.Param)('collectionName')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], DynamicDataController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update document by ID' }),
    (0, swagger_1.ApiParam)({ name: 'databaseId', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiParam)({ name: 'collectionName', example: 'products' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiBody)({
        description: 'Fields to update (partial update supported)',
        schema: {
            type: 'object',
            example: {
                price: 899.99,
                in_stock: false,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document updated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    __param(0, (0, common_1.Param)('databaseId')),
    __param(1, (0, common_1.Param)('collectionName')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], DynamicDataController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Replace document by ID (full replacement)' }),
    (0, swagger_1.ApiParam)({ name: 'databaseId', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiParam)({ name: 'collectionName', example: 'products' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiBody)({
        description: 'Complete document data (replaces entire document)',
        schema: {
            type: 'object',
            example: {
                product_name: 'iPhone 15 Pro Max',
                sku: 'IPHONE-15-PRO-MAX',
                price: 1199.99,
                category: 'electronics',
                description: 'Latest iPhone model with larger screen',
                tags: ['new', 'bestseller', 'premium'],
                in_stock: true,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document replaced' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    __param(0, (0, common_1.Param)('databaseId')),
    __param(1, (0, common_1.Param)('collectionName')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], DynamicDataController.prototype, "replace", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete document by ID' }),
    (0, swagger_1.ApiParam)({ name: 'databaseId', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiParam)({ name: 'collectionName', example: 'products' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    __param(0, (0, common_1.Param)('databaseId')),
    __param(1, (0, common_1.Param)('collectionName')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], DynamicDataController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Delete)(':id/hard'),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete document by ID' }),
    (0, swagger_1.ApiParam)({ name: 'databaseId', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiParam)({ name: 'collectionName', example: 'products' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document permanently deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    __param(0, (0, common_1.Param)('databaseId')),
    __param(1, (0, common_1.Param)('collectionName')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], DynamicDataController.prototype, "hardDelete", null);
__decorate([
    (0, common_1.Post)(':id/restore'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore soft-deleted document' }),
    (0, swagger_1.ApiParam)({ name: 'databaseId', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiParam)({ name: 'collectionName', example: 'products' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: '507f1f77bcf86cd799439011' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document restored' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    __param(0, (0, common_1.Param)('databaseId')),
    __param(1, (0, common_1.Param)('collectionName')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], DynamicDataController.prototype, "restore", null);
exports.DynamicDataController = DynamicDataController = __decorate([
    (0, swagger_1.ApiTags)('dynamic-data'),
    (0, common_1.Controller)(':databaseId/:collectionName'),
    __metadata("design:paramtypes", [dynamic_data_service_1.DynamicDataService])
], DynamicDataController);
//# sourceMappingURL=dynamic-data.controller.js.map