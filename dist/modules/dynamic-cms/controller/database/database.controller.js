"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DatabaseController", {
    enumerable: true,
    get: function() {
        return DatabaseController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _databaseservice = require("./database.service");
const _databasedto = require("../../dto/database.dto");
const _paginationdto = require("../../../../common/dto/pagination.dto");
const _jwtauthguard = require("../../../auth/guards/jwt-auth.guard");
const _tierlimitsguard = require("../../../../common/guards/tier-limits.guard");
const _apiroutesconstants = require("../../../../common/constants/api-routes.constants");
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
let DatabaseController = class DatabaseController {
    async create(createDatabaseDto, req) {
        return this.databaseService.create(createDatabaseDto, req.user.userId);
    }
    async findAll(paginationDto, req) {
        return this.databaseService.findAllByUser(req.user.userId, paginationDto);
    }
    async findOne(id, req) {
        return this.databaseService.findOne(id, req.user.userId);
    }
    async update(id, updateDatabaseDto, req) {
        return this.databaseService.update(id, updateDatabaseDto, req.user.userId);
    }
    async remove(id, req) {
        return this.databaseService.remove(id, req.user.userId);
    }
    async permanentDelete(id, req) {
        return this.databaseService.permanentDelete(id, req.user.userId);
    }
    constructor(databaseService){
        this.databaseService = databaseService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_tierlimitsguard.TierLimitsGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new database'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Database created successfully',
        type: _databasedto.DatabaseResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 409,
        description: 'Database name already exists'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Tier limit reached'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _databasedto.CreateDatabaseDto === "undefined" ? Object : _databasedto.CreateDatabaseDto,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], DatabaseController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all databases of current user'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'List of databases',
        type: _databasedto.DatabaseListResponseDto
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paginationdto.PaginationDto === "undefined" ? Object : _paginationdto.PaginationDto,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], DatabaseController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get database by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Database details',
        type: _databasedto.DatabaseResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Database not found'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Access denied'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], DatabaseController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Update database'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Database updated successfully',
        type: _databasedto.DatabaseResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Database not found'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Access denied'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _databasedto.UpdateDatabaseDto === "undefined" ? Object : _databasedto.UpdateDatabaseDto,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], DatabaseController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Deactivate database (soft delete)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Database deactivated successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Database not found'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Access denied'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], DatabaseController.prototype, "remove", null);
_ts_decorate([
    (0, _common.Delete)(':id/permanent'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Permanently delete database'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Database permanently deleted'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Database not found'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Access denied'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], DatabaseController.prototype, "permanentDelete", null);
DatabaseController = _ts_decorate([
    (0, _swagger.ApiTags)('Databases'),
    (0, _common.Controller)(_apiroutesconstants.DATABASE_ROUTES.BASE),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _databaseservice.DatabaseService === "undefined" ? Object : _databaseservice.DatabaseService
    ])
], DatabaseController);

//# sourceMappingURL=database.controller.js.map