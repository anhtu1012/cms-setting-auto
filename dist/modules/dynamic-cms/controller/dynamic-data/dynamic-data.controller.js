"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DynamicDataController", {
    enumerable: true,
    get: function() {
        return DynamicDataController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _paginationdto = require("../../../../common/dto/pagination.dto");
const _dynamicdataservice = require("./dynamic-data.service");
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
let DynamicDataController = class DynamicDataController {
    create(databaseId, collectionName, data, req) {
        const userId = req?.user?.userId || null;
        return this.dynamicDataService.create(collectionName, databaseId, data, userId);
    }
    createMany(databaseId, collectionName, dataArray, req) {
        const userId = req?.user?.userId || null;
        if (!Array.isArray(dataArray)) {
            throw new _common.BadRequestException('Body must be an array of objects');
        }
        return this.dynamicDataService.createMany(collectionName, databaseId, dataArray, userId);
    }
    replaceAll(databaseId, collectionName, dataArray, req) {
        const userId = req?.user?.userId || null;
        if (!Array.isArray(dataArray)) {
            throw new _common.BadRequestException('Body must be an array of objects');
        }
        return this.dynamicDataService.replaceAll(collectionName, databaseId, dataArray, userId);
    }
    findAll(databaseId, collectionName, paginationDto, req) {
        const userId = req?.user?.userId || null;
        return this.dynamicDataService.findAll(collectionName, userId, databaseId, paginationDto);
    }
    query(databaseId, collectionName, body) {
        return this.dynamicDataService.query(collectionName, body.filter, {
            sort: body.sort,
            limit: body.limit,
            skip: body.skip
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
    constructor(dynamicDataService){
        this.dynamicDataService = dynamicDataService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create new document in dynamic collection'
    }),
    (0, _swagger.ApiParam)({
        name: 'databaseId',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiBody)({
        description: 'Document data to create',
        schema: {
            type: 'object',
            example: {
                product_name: 'iPhone 15 Pro',
                sku: 'IPHONE-15-PRO',
                price: 999.99,
                category: 'electronics',
                description: 'Latest iPhone model',
                tags: [
                    'new',
                    'bestseller'
                ],
                in_stock: true
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Document created successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Validation failed'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Collection schema not found'
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_param(2, (0, _common.Body)()),
    _ts_param(3, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof Record === "undefined" ? Object : Record,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], DynamicDataController.prototype, "create", null);
_ts_decorate([
    (0, _common.Post)('bulk'),
    (0, _swagger.ApiOperation)({
        summary: 'Create multiple documents in dynamic collection'
    }),
    (0, _swagger.ApiParam)({
        name: 'databaseId',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiBody)({
        description: 'Array of document data to create',
        schema: {
            type: 'array',
            items: {
                type: 'object'
            },
            example: [
                {
                    product_name: 'iPhone 15 Pro',
                    sku: 'IPHONE-15-PRO',
                    price: 999.99,
                    category: 'electronics',
                    description: 'Latest iPhone model',
                    tags: [
                        'new',
                        'bestseller'
                    ],
                    in_stock: true
                },
                {
                    product_name: 'Samsung Galaxy S24',
                    sku: 'SAMSUNG-S24',
                    price: 899.99,
                    category: 'electronics',
                    description: 'Latest Samsung flagship',
                    tags: [
                        'new',
                        'android'
                    ],
                    in_stock: true
                }
            ]
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Documents created (returns success/failed count)'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid input'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Collection schema not found'
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_param(2, (0, _common.Body)()),
    _ts_param(3, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Array,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], DynamicDataController.prototype, "createMany", null);
_ts_decorate([
    (0, _common.Put)('replace-all'),
    (0, _swagger.ApiOperation)({
        summary: 'Replace all documents in collection with new data array'
    }),
    (0, _swagger.ApiParam)({
        name: 'databaseId',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiBody)({
        description: 'Array of new document data (will delete all old data and create new)',
        schema: {
            type: 'array',
            items: {
                type: 'object'
            },
            example: [
                {
                    product_name: 'New Product 1',
                    sku: 'NEW-001',
                    price: 499.99,
                    category: 'electronics',
                    in_stock: true
                },
                {
                    product_name: 'New Product 2',
                    sku: 'NEW-002',
                    price: 599.99,
                    category: 'electronics',
                    in_stock: true
                }
            ]
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'All old data deleted and new data created (returns deleted/created count)'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid input'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Collection schema not found'
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_param(2, (0, _common.Body)()),
    _ts_param(3, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Array,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], DynamicDataController.prototype, "replaceAll", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all documents from dynamic collection'
    }),
    (0, _swagger.ApiParam)({
        name: 'databaseId',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        example: 1
    }),
    (0, _swagger.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        example: 10
    }),
    (0, _swagger.ApiQuery)({
        name: 'search',
        required: false,
        type: String
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Documents retrieved'
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_param(2, (0, _common.Query)()),
    _ts_param(3, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _paginationdto.PaginationDto === "undefined" ? Object : _paginationdto.PaginationDto,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], DynamicDataController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Post)('query'),
    (0, _swagger.ApiOperation)({
        summary: 'Query documents with custom filter'
    }),
    (0, _swagger.ApiParam)({
        name: 'databaseId',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiBody)({
        description: 'Query filter with optional sort, limit, skip',
        schema: {
            type: 'object',
            properties: {
                filter: {
                    type: 'object',
                    example: {
                        category: 'electronics',
                        in_stock: true
                    }
                },
                sort: {
                    type: 'object',
                    example: {
                        price: -1,
                        createdAt: -1
                    }
                },
                limit: {
                    type: 'number',
                    example: 20
                },
                skip: {
                    type: 'number',
                    example: 0
                }
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Query results returned'
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], DynamicDataController.prototype, "query", null);
_ts_decorate([
    (0, _common.Get)('count'),
    (0, _swagger.ApiOperation)({
        summary: 'Count documents in collection'
    }),
    (0, _swagger.ApiParam)({
        name: 'databaseId',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Count returned'
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], DynamicDataController.prototype, "count", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get document by ID'
    }),
    (0, _swagger.ApiParam)({
        name: 'databaseId',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Document found'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Document not found'
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_param(3, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], DynamicDataController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Update document by ID'
    }),
    (0, _swagger.ApiParam)({
        name: 'databaseId',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiBody)({
        description: 'Fields to update (partial update supported)',
        schema: {
            type: 'object',
            example: {
                price: 899.99,
                in_stock: false
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Document updated'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Validation failed'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Document not found'
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_param(3, (0, _common.Body)()),
    _ts_param(4, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        typeof Record === "undefined" ? Object : Record,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], DynamicDataController.prototype, "update", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Replace document by ID (full replacement)'
    }),
    (0, _swagger.ApiParam)({
        name: 'databaseId',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiBody)({
        description: 'Complete document data (replaces entire document)',
        schema: {
            type: 'object',
            example: {
                product_name: 'iPhone 15 Pro Max',
                sku: 'IPHONE-15-PRO-MAX',
                price: 1199.99,
                category: 'electronics',
                description: 'Latest iPhone model with larger screen',
                tags: [
                    'new',
                    'bestseller',
                    'premium'
                ],
                in_stock: true
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Document replaced'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Validation failed'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Document not found'
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_param(3, (0, _common.Body)()),
    _ts_param(4, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        typeof Record === "undefined" ? Object : Record,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], DynamicDataController.prototype, "replace", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Soft delete document by ID'
    }),
    (0, _swagger.ApiParam)({
        name: 'databaseId',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Document deleted'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Document not found'
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_param(3, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], DynamicDataController.prototype, "softDelete", null);
_ts_decorate([
    (0, _common.Delete)(':id/hard'),
    (0, _swagger.ApiOperation)({
        summary: 'Permanently delete document by ID'
    }),
    (0, _swagger.ApiParam)({
        name: 'databaseId',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Document permanently deleted'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Document not found'
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_param(3, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], DynamicDataController.prototype, "hardDelete", null);
_ts_decorate([
    (0, _common.Post)(':id/restore'),
    (0, _swagger.ApiOperation)({
        summary: 'Restore soft-deleted document'
    }),
    (0, _swagger.ApiParam)({
        name: 'databaseId',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiParam)({
        name: 'id',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Document restored'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Document not found'
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_param(3, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], DynamicDataController.prototype, "restore", null);
DynamicDataController = _ts_decorate([
    (0, _swagger.ApiTags)('dynamic-data'),
    (0, _common.Controller)(':databaseId/:collectionName'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dynamicdataservice.DynamicDataService === "undefined" ? Object : _dynamicdataservice.DynamicDataService
    ])
], DynamicDataController);

//# sourceMappingURL=dynamic-data.controller.js.map