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
    get CreateTierConfigDto () {
        return CreateTierConfigDto;
    },
    get TierLimitsResponseDto () {
        return TierLimitsResponseDto;
    },
    get UpdateTierConfigDto () {
        return UpdateTierConfigDto;
    }
});
const _classvalidator = require("class-validator");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateTierConfigDto = class CreateTierConfigDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'premium',
        description: 'Mã tier (unique)'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateTierConfigDto.prototype, "tierCode", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Premium',
        description: 'Tên tier'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateTierConfigDto.prototype, "tierName", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Mô tả tier'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateTierConfigDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 20,
        description: 'Số lượng database tối đa (-1 = unlimited)'
    }),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], CreateTierConfigDto.prototype, "maxDatabases", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 10000,
        description: 'Số data tối đa mỗi collection (-1 = unlimited)'
    }),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], CreateTierConfigDto.prototype, "maxDataPerCollection", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 100,
        description: 'Số collection tối đa mỗi database (-1 = unlimited)'
    }),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], CreateTierConfigDto.prototype, "maxCollectionsPerDatabase", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 50,
        description: 'Dung lượng lưu trữ tối đa GB (-1 = unlimited)'
    }),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], CreateTierConfigDto.prototype, "maxStorageGB", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 100000,
        description: 'Số API calls tối đa mỗi ngày (-1 = unlimited)'
    }),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], CreateTierConfigDto.prototype, "maxApiCallsPerDay", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 29.99,
        description: 'Giá tier'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateTierConfigDto.prototype, "price", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'USD',
        description: 'Đơn vị tiền tệ'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateTierConfigDto.prototype, "currency", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: true,
        description: 'Tier có active không'
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateTierConfigDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 1,
        description: 'Thứ tự hiển thị'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateTierConfigDto.prototype, "displayOrder", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Metadata tùy chỉnh'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], CreateTierConfigDto.prototype, "metadata", void 0);
let UpdateTierConfigDto = class UpdateTierConfigDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Premium Plus',
        description: 'Tên tier'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateTierConfigDto.prototype, "tierName", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Mô tả tier'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateTierConfigDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 30,
        description: 'Số lượng database tối đa'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateTierConfigDto.prototype, "maxDatabases", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 20000,
        description: 'Số data tối đa mỗi collection'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateTierConfigDto.prototype, "maxDataPerCollection", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 150,
        description: 'Số collection tối đa mỗi database'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateTierConfigDto.prototype, "maxCollectionsPerDatabase", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 100,
        description: 'Dung lượng lưu trữ tối đa GB'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateTierConfigDto.prototype, "maxStorageGB", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 200000,
        description: 'Số API calls tối đa mỗi ngày'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateTierConfigDto.prototype, "maxApiCallsPerDay", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 39.99,
        description: 'Giá tier'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateTierConfigDto.prototype, "price", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'USD',
        description: 'Đơn vị tiền tệ'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateTierConfigDto.prototype, "currency", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: true,
        description: 'Tier có active không'
    }),
    (0, _classvalidator.IsBoolean)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], UpdateTierConfigDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 2,
        description: 'Thứ tự hiển thị'
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateTierConfigDto.prototype, "displayOrder", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Metadata tùy chỉnh'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], UpdateTierConfigDto.prototype, "metadata", void 0);
let TierLimitsResponseDto = class TierLimitsResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], TierLimitsResponseDto.prototype, "tierCode", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], TierLimitsResponseDto.prototype, "tierName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", Number)
], TierLimitsResponseDto.prototype, "maxDatabases", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", Number)
], TierLimitsResponseDto.prototype, "maxDataPerCollection", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", Number)
], TierLimitsResponseDto.prototype, "maxCollectionsPerDatabase", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", Number)
], TierLimitsResponseDto.prototype, "maxStorageGB", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", Number)
], TierLimitsResponseDto.prototype, "maxApiCallsPerDay", void 0);

//# sourceMappingURL=tier-config.dto.js.map