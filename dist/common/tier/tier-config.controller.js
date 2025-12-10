"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TierConfigController", {
    enumerable: true,
    get: function() {
        return TierConfigController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _tierconfigservice = require("./tier-config.service");
const _tierconfigdto = require("./dto/tier-config.dto");
const _jwtauthguard = require("../../modules/auth/guards/jwt-auth.guard");
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
let TierConfigController = class TierConfigController {
    /**
   * Lấy tất cả tier configs
   * Public API - không cần authentication
   */ async getAllTiers(includeInactive) {
        return this.tierConfigService.getAllTiers(includeInactive === true);
    }
    /**
   * Lấy tier theo code
   */ async getTierByCode(tierCode) {
        return this.tierConfigService.getTierByCode(tierCode);
    }
    /**
   * Lấy tier limits (chỉ limits, không bao gồm giá...)
   */ async getTierLimits(tierCode) {
        return this.tierConfigService.getTierLimits(tierCode);
    }
    /**
   * Tạo tier mới
   * Chỉ admin mới có quyền tạo
   */ async createTier(createDto) {
        return this.tierConfigService.createTier(createDto);
    }
    /**
   * Cập nhật tier
   * Chỉ admin mới có quyền update
   */ async updateTier(tierCode, updateDto) {
        return this.tierConfigService.updateTier(tierCode, updateDto);
    }
    /**
   * Xóa tier (soft delete)
   * Chỉ admin mới có quyền xóa
   */ async deleteTier(tierCode) {
        await this.tierConfigService.deleteTier(tierCode);
        return {
            message: `Tier '${tierCode}' has been deleted`
        };
    }
    /**
   * Hard delete tier (Cẩn thận!)
   * Chỉ admin mới có quyền
   */ async hardDeleteTier(tierCode) {
        await this.tierConfigService.hardDeleteTier(tierCode);
        return {
            message: `Tier '${tierCode}' has been permanently deleted`
        };
    }
    /**
   * Seed default tiers
   * Chỉ dùng lần đầu setup hoặc reset
   */ async seedDefaultTiers() {
        await this.tierConfigService.seedDefaultTiers();
        return {
            message: 'Default tiers have been seeded successfully'
        };
    }
    constructor(tierConfigService){
        this.tierConfigService = tierConfigService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Lấy danh sách tất cả tiers'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Thành công'
    }),
    _ts_param(0, (0, _common.Query)('includeInactive')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], TierConfigController.prototype, "getAllTiers", null);
_ts_decorate([
    (0, _common.Get)(':tierCode'),
    (0, _swagger.ApiOperation)({
        summary: 'Lấy thông tin tier theo code'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Thành công'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Không tìm thấy tier'
    }),
    _ts_param(0, (0, _common.Param)('tierCode')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TierConfigController.prototype, "getTierByCode", null);
_ts_decorate([
    (0, _common.Get)(':tierCode/limits'),
    (0, _swagger.ApiOperation)({
        summary: 'Lấy thông tin giới hạn của tier'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Thành công'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Không tìm thấy tier'
    }),
    _ts_param(0, (0, _common.Param)('tierCode')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TierConfigController.prototype, "getTierLimits", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Tạo tier mới (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Tạo thành công'
    }),
    (0, _swagger.ApiResponse)({
        status: 409,
        description: 'Tier code đã tồn tại'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tierconfigdto.CreateTierConfigDto === "undefined" ? Object : _tierconfigdto.CreateTierConfigDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TierConfigController.prototype, "createTier", null);
_ts_decorate([
    (0, _common.Put)(':tierCode'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Cập nhật tier (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Cập nhật thành công'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Không tìm thấy tier'
    }),
    _ts_param(0, (0, _common.Param)('tierCode')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _tierconfigdto.UpdateTierConfigDto === "undefined" ? Object : _tierconfigdto.UpdateTierConfigDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TierConfigController.prototype, "updateTier", null);
_ts_decorate([
    (0, _common.Delete)(':tierCode'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Xóa tier - soft delete (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Xóa thành công'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Không tìm thấy tier'
    }),
    _ts_param(0, (0, _common.Param)('tierCode')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TierConfigController.prototype, "deleteTier", null);
_ts_decorate([
    (0, _common.Delete)(':tierCode/hard'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Xóa vĩnh viễn tier (Admin only - Cẩn thận!)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Xóa thành công'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Không tìm thấy tier'
    }),
    _ts_param(0, (0, _common.Param)('tierCode')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TierConfigController.prototype, "hardDeleteTier", null);
_ts_decorate([
    (0, _common.Post)('seed/defaults'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Seed default tiers vào database (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Seed thành công'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], TierConfigController.prototype, "seedDefaultTiers", null);
TierConfigController = _ts_decorate([
    (0, _swagger.ApiTags)('Tier Configuration'),
    (0, _common.Controller)('v1/tier-config'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tierconfigservice.TierConfigService === "undefined" ? Object : _tierconfigservice.TierConfigService
    ])
], TierConfigController);

//# sourceMappingURL=tier-config.controller.js.map