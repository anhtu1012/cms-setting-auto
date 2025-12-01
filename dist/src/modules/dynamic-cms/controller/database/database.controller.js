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
exports.DatabaseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const database_service_1 = require("./database.service");
const database_dto_1 = require("../../dto/database.dto");
const pagination_dto_1 = require("../../../../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
let DatabaseController = class DatabaseController {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
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
};
exports.DatabaseController = DatabaseController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new database' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Database created successfully',
        type: database_dto_1.DatabaseResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Database name already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [database_dto_1.CreateDatabaseDto, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all databases of current user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of databases',
        type: database_dto_1.DatabaseListResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get database by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Database details',
        type: database_dto_1.DatabaseResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Database not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update database' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Database updated successfully',
        type: database_dto_1.DatabaseResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Database not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, database_dto_1.UpdateDatabaseDto, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate database (soft delete)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Database deactivated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Database not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(':id/permanent'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete database' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Database permanently deleted',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Database not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "permanentDelete", null);
exports.DatabaseController = DatabaseController = __decorate([
    (0, swagger_1.ApiTags)('Databases'),
    (0, common_1.Controller)('databases'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DatabaseController);
//# sourceMappingURL=database.controller.js.map