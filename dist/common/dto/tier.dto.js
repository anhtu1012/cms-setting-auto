"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get DataUsageResponseDto () {
        return DataUsageResponseDto;
    },
    get LimitCheckResponseDto () {
        return LimitCheckResponseDto;
    },
    get TierInfoResponseDto () {
        return TierInfoResponseDto;
    },
    get UpgradeTierDto () {
        return UpgradeTierDto;
    }
});
const _classvalidator = require("class-validator");
const _swagger = require("@nestjs/swagger");
const _tierenum = require("../enums/tier.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UpgradeTierDto = class UpgradeTierDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'User ID to upgrade',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _classvalidator.IsMongoId)(),
    _ts_metadata("design:type", String)
], UpgradeTierDto.prototype, "userId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'New tier level',
        enum: _tierenum.AccountTier,
        example: _tierenum.AccountTier.PREMIUM
    }),
    (0, _classvalidator.IsEnum)(_tierenum.AccountTier),
    _ts_metadata("design:type", typeof _tierenum.AccountTier === "undefined" ? Object : _tierenum.AccountTier)
], UpgradeTierDto.prototype, "newTier", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Reason for upgrade',
        example: 'Payment via Stripe - Order #12345'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpgradeTierDto.prototype, "reason", void 0);
let TierInfoResponseDto = class TierInfoResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _tierenum.AccountTier
    }),
    _ts_metadata("design:type", typeof _tierenum.AccountTier === "undefined" ? Object : _tierenum.AccountTier)
], TierInfoResponseDto.prototype, "tier", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Tier limits',
        example: {
            maxDatabases: 2,
            maxDataPerCollection: 100,
            maxCollectionsPerDatabase: 5,
            maxStorageGB: 1,
            maxApiCallsPerDay: 1000
        }
    }),
    _ts_metadata("design:type", Object)
], TierInfoResponseDto.prototype, "limits", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Current usage statistics',
        example: {
            databases: 1,
            apiCallsToday: 45
        }
    }),
    _ts_metadata("design:type", Object)
], TierInfoResponseDto.prototype, "usage", void 0);
let LimitCheckResponseDto = class LimitCheckResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Whether action is allowed'
    }),
    _ts_metadata("design:type", Boolean)
], LimitCheckResponseDto.prototype, "allowed", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Reason if not allowed'
    }),
    _ts_metadata("design:type", String)
], LimitCheckResponseDto.prototype, "reason", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Current count'
    }),
    _ts_metadata("design:type", Number)
], LimitCheckResponseDto.prototype, "current", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Maximum limit'
    }),
    _ts_metadata("design:type", Number)
], LimitCheckResponseDto.prototype, "limit", void 0);
let DataUsageResponseDto = class DataUsageResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Collection name'
    }),
    _ts_metadata("design:type", String)
], DataUsageResponseDto.prototype, "collection", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Current data count'
    }),
    _ts_metadata("design:type", Number)
], DataUsageResponseDto.prototype, "count", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Maximum limit'
    }),
    _ts_metadata("design:type", Number)
], DataUsageResponseDto.prototype, "limit", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Usage percentage'
    }),
    _ts_metadata("design:type", Number)
], DataUsageResponseDto.prototype, "percentage", void 0);

//# sourceMappingURL=tier.dto.js.map