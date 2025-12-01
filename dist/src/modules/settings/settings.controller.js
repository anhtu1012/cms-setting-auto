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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settings_service_1 = require("./settings.service");
const setting_dto_1 = require("./dto/setting.dto");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SettingsController = class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    create(createSettingDto) {
        return this.settingsService.create(createSettingDto);
    }
    findAll(paginationDto) {
        return this.settingsService.findAll(paginationDto);
    }
    findByCategory(category) {
        return this.settingsService.findByCategory(category);
    }
    findByKey(key) {
        return this.settingsService.findByKey(key);
    }
    findOne(id) {
        return this.settingsService.findOne(id);
    }
    update(id, updateSettingDto) {
        return this.settingsService.update(id, updateSettingDto);
    }
    updateByKey(key, body) {
        return this.settingsService.updateByKey(key, body.value);
    }
    remove(id) {
        return this.settingsService.remove(id);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new setting' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Setting created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [setting_dto_1.CreateSettingDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all settings with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get settings by category' }),
    (0, swagger_1.ApiParam)({
        name: 'category',
        enum: ['general', 'appearance', 'security', 'notification', 'integration'],
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings found' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('key/:key'),
    (0, swagger_1.ApiOperation)({ summary: 'Get setting by key' }),
    (0, swagger_1.ApiParam)({ name: 'key', example: 'site_name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Setting found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Setting not found' }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "findByKey", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get setting by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Setting found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Setting not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update setting by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Setting updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Setting not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, setting_dto_1.UpdateSettingDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('key/:key'),
    (0, swagger_1.ApiOperation)({ summary: 'Update setting value by key' }),
    (0, swagger_1.ApiParam)({ name: 'key', example: 'site_name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Setting updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Setting not found' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateByKey", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "remove", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('settings'),
    (0, common_1.Controller)('settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map