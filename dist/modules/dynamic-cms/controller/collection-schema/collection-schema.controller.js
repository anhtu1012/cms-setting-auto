"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CollectionSchemaController", {
    enumerable: true,
    get: function() {
        return CollectionSchemaController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _collectionschemadto = require("../../dto/collection-schema.dto");
const _paginationdto = require("../../../../common/dto/pagination.dto");
const _jwtauthguard = require("../../../auth/guards/jwt-auth.guard");
const _databaseownershipguard = require("../../../../common/guards/database-ownership.guard");
const _databaseiddecorator = require("../../../../common/decorators/database-id.decorator");
const _collectionschemaservice = require("./collection-schema.service");
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
let CollectionSchemaController = class CollectionSchemaController {
    create(createDto, databaseId, req) {
        // Override databaseId from header instead of body
        const dto = {
            ...createDto,
            databaseId
        };
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
            throw new _common.NotFoundException(`Collection schema with name "${name}" not found`);
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
    constructor(collectionSchemaService){
        this.collectionSchemaService = collectionSchemaService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new collection schema (table)'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Collection schema created successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid input or duplicate name'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _databaseiddecorator.DatabaseId)()),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _collectionschemadto.CreateCollectionSchemaDto === "undefined" ? Object : _collectionschemadto.CreateCollectionSchemaDto,
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all collection schemas with pagination'
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
        description: 'Collection schemas retrieved'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_param(1, (0, _databaseiddecorator.DatabaseId)()),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paginationdto.PaginationDto === "undefined" ? Object : _paginationdto.PaginationDto,
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)('all'),
    (0, _swagger.ApiOperation)({
        summary: 'Get all collection schemas (paginated)'
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
        description: 'Schemas retrieved (paginated)'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_param(1, (0, _databaseiddecorator.DatabaseId)()),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paginationdto.PaginationDto === "undefined" ? Object : _paginationdto.PaginationDto,
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "findAllSchemas", null);
_ts_decorate([
    (0, _common.Get)('by-name/:name'),
    (0, _swagger.ApiOperation)({
        summary: 'Get collection schema by name'
    }),
    (0, _swagger.ApiParam)({
        name: 'name',
        example: 'products',
        description: 'Collection name'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Schema found'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Schema not found'
    }),
    _ts_param(0, (0, _common.Param)('name')),
    _ts_param(1, (0, _databaseiddecorator.DatabaseId)()),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], CollectionSchemaController.prototype, "findByName", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get collection schema by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Schema found'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Schema not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Update collection schema'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Schema updated successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Schema not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _collectionschemadto.UpdateCollectionSchemaDto === "undefined" ? Object : _collectionschemadto.UpdateCollectionSchemaDto,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Delete collection schema'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Schema deleted successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Schema not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], CollectionSchemaController.prototype, "remove", null);
_ts_decorate([
    (0, _common.Post)('validate/:collectionName'),
    (0, _swagger.ApiOperation)({
        summary: 'Validate data against schema'
    }),
    (0, _swagger.ApiParam)({
        name: 'collectionName',
        example: 'products'
    }),
    (0, _swagger.ApiBody)({
        description: 'Data to validate against the collection schema',
        schema: {
            type: 'object',
            example: {
                product_name: 'iPhone 15 Pro',
                sku: 'IPHONE-15-PRO',
                price: 999.99,
                category: 'electronics',
                in_stock: true
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Validation result returned',
        schema: {
            type: 'object',
            properties: {
                valid: {
                    type: 'boolean',
                    example: true
                },
                errors: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    example: []
                }
            }
        }
    }),
    _ts_param(0, (0, _common.Param)('collectionName')),
    _ts_param(1, (0, _databaseiddecorator.DatabaseId)()),
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
], CollectionSchemaController.prototype, "validateData", null);
CollectionSchemaController = _ts_decorate([
    (0, _swagger.ApiTags)('collection-schemas'),
    (0, _common.Controller)('collection-schemas'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _databaseownershipguard.DatabaseOwnershipGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiHeader)({
        name: 'x-database-id',
        description: 'Database ID that user has access to',
        required: true,
        schema: {
            type: 'string',
            example: '507f1f77bcf86cd799439011'
        }
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _collectionschemaservice.CollectionSchemaService === "undefined" ? Object : _collectionschemaservice.CollectionSchemaService
    ])
], CollectionSchemaController);

//# sourceMappingURL=collection-schema.controller.js.map