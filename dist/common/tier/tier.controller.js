"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TierController", {
    enumerable: true,
    get: function() {
        return TierController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _tierservice = require("./tier.service");
const _jwtauthguard = require("../../modules/auth/guards/jwt-auth.guard");
const _tierdto = require("../dto/tier.dto");
const _apiroutesconstants = require("../constants/api-routes.constants");
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
let TierController = class TierController {
    async getTierInfo(req) {
        return this.tierService.getUserTierInfo(req.user.userId);
    }
    async checkDatabaseLimit(req) {
        return this.tierService.canCreateDatabase(req.user.userId);
    }
    async checkDataLimit(databaseId, collectionName, req) {
        return this.tierService.canCreateData(req.user.userId, databaseId, collectionName);
    }
    async getAllDataUsage(req) {
        return this.tierService.getAllDataUsage(req.user.userId);
    }
    async getDataUsage(databaseId, req) {
        return this.tierService.getDataUsageByCollection(req.user.userId, databaseId);
    }
    async upgradeTier(upgradeTierDto) {
        return this.tierService.upgradeTier(upgradeTierDto.userId, upgradeTierDto.newTier, upgradeTierDto.reason);
    }
    constructor(tierService){
        this.tierService = tierService;
    }
};
_ts_decorate([
    (0, _common.Get)('info'),
    (0, _swagger.ApiOperation)({
        summary: 'Get current user tier information and limits'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Tier information retrieved successfully',
        type: _tierdto.TierInfoResponseDto
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], TierController.prototype, "getTierInfo", null);
_ts_decorate([
    (0, _common.Get)('check-database-limit'),
    (0, _swagger.ApiOperation)({
        summary: 'Check if user can create more databases'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Database limit check result',
        type: _tierdto.LimitCheckResponseDto
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], TierController.prototype, "checkDatabaseLimit", null);
_ts_decorate([
    (0, _common.Get)('check-data-limit/:databaseId/:collectionName'),
    (0, _swagger.ApiOperation)({
        summary: 'Check if user can create more data in a collection'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Data limit check result',
        type: _tierdto.LimitCheckResponseDto
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Param)('collectionName')),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], TierController.prototype, "checkDataLimit", null);
_ts_decorate([
    (0, _common.Get)('usage'),
    (0, _swagger.ApiOperation)({
        summary: 'Get data usage statistics for all databases'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'All databases usage statistics retrieved successfully'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], TierController.prototype, "getAllDataUsage", null);
_ts_decorate([
    (0, _common.Get)('usage/:databaseId'),
    (0, _swagger.ApiOperation)({
        summary: 'Get data usage statistics by collection for a specific database'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Data usage statistics retrieved successfully',
        type: [
            _tierdto.DataUsageResponseDto
        ]
    }),
    _ts_param(0, (0, _common.Param)('databaseId')),
    _ts_param(1, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], TierController.prototype, "getDataUsage", null);
_ts_decorate([
    (0, _common.Post)('upgrade'),
    (0, _swagger.ApiOperation)({
        summary: 'Upgrade user tier (admin only for now)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Tier upgraded successfully'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tierdto.UpgradeTierDto === "undefined" ? Object : _tierdto.UpgradeTierDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TierController.prototype, "upgradeTier", null);
TierController = _ts_decorate([
    (0, _swagger.ApiTags)('Tier Management'),
    (0, _common.Controller)(_apiroutesconstants.TIER_ROUTES.BASE),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tierservice.TierService === "undefined" ? Object : _tierservice.TierService
    ])
], TierController);

//# sourceMappingURL=tier.controller.js.map