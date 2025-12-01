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
    get CreateDatabaseDto () {
        return CreateDatabaseDto;
    },
    get DatabaseListResponseDto () {
        return DatabaseListResponseDto;
    },
    get DatabaseResponseDto () {
        return DatabaseResponseDto;
    },
    get DatabaseSettingsDto () {
        return DatabaseSettingsDto;
    },
    get UpdateDatabaseDto () {
        return UpdateDatabaseDto;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
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
let DatabaseSettingsDto = class DatabaseSettingsDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Default language',
        example: 'en'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], DatabaseSettingsDto.prototype, "defaultLanguage", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Timezone',
        example: 'Asia/Ho_Chi_Minh'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], DatabaseSettingsDto.prototype, "timezone", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Date format',
        example: 'DD/MM/YYYY'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], DatabaseSettingsDto.prototype, "dateFormat", void 0);
let CreateDatabaseDto = class CreateDatabaseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Database name (slug, lowercase, no spaces)',
        example: 'my-ecommerce-db'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(3),
    (0, _classvalidator.Matches)(/^[a-z0-9-]+$/, {
        message: 'Name must be lowercase, alphanumeric with hyphens only'
    }),
    _ts_metadata("design:type", String)
], CreateDatabaseDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Display name for the database',
        example: 'My E-commerce Database'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateDatabaseDto.prototype, "displayName", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Database description',
        example: 'Main database for e-commerce platform'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateDatabaseDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Icon for the database',
        example: '🛒'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateDatabaseDto.prototype, "icon", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Database settings',
        type: DatabaseSettingsDto
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>DatabaseSettingsDto),
    _ts_metadata("design:type", typeof DatabaseSettingsDto === "undefined" ? Object : DatabaseSettingsDto)
], CreateDatabaseDto.prototype, "settings", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Tags for categorization',
        example: [
            'production',
            'e-commerce'
        ],
        type: [
            String
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    _ts_metadata("design:type", Array)
], CreateDatabaseDto.prototype, "tags", void 0);
let UpdateDatabaseDto = class UpdateDatabaseDto extends (0, _swagger.PartialType)(CreateDatabaseDto) {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Active status of the database',
        example: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateDatabaseDto.prototype, "isActive", void 0);
let DatabaseResponseDto = class DatabaseResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '507f1f77bcf86cd799439011'
    }),
    _ts_metadata("design:type", String)
], DatabaseResponseDto.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'my-ecommerce-db'
    }),
    _ts_metadata("design:type", String)
], DatabaseResponseDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'My E-commerce Database'
    }),
    _ts_metadata("design:type", String)
], DatabaseResponseDto.prototype, "displayName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Main database for e-commerce platform'
    }),
    _ts_metadata("design:type", String)
], DatabaseResponseDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '507f1f77bcf86cd799439011'
    }),
    _ts_metadata("design:type", String)
], DatabaseResponseDto.prototype, "userId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: true
    }),
    _ts_metadata("design:type", Boolean)
], DatabaseResponseDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '🛒'
    }),
    _ts_metadata("design:type", String)
], DatabaseResponseDto.prototype, "icon", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: {
            defaultLanguage: 'en',
            timezone: 'Asia/Ho_Chi_Minh'
        }
    }),
    _ts_metadata("design:type", typeof DatabaseSettingsDto === "undefined" ? Object : DatabaseSettingsDto)
], DatabaseResponseDto.prototype, "settings", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: [
            'production',
            'e-commerce'
        ]
    }),
    _ts_metadata("design:type", Array)
], DatabaseResponseDto.prototype, "tags", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 5
    }),
    _ts_metadata("design:type", Number)
], DatabaseResponseDto.prototype, "collectionsCount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 1250
    }),
    _ts_metadata("design:type", Number)
], DatabaseResponseDto.prototype, "dataCount", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '2023-12-01T10:30:00Z'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], DatabaseResponseDto.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '2023-12-01T10:30:00Z'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], DatabaseResponseDto.prototype, "updatedAt", void 0);
let DatabaseListResponseDto = class DatabaseListResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: [
            DatabaseResponseDto
        ]
    }),
    _ts_metadata("design:type", Array)
], DatabaseListResponseDto.prototype, "data", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 10
    }),
    _ts_metadata("design:type", Number)
], DatabaseListResponseDto.prototype, "total", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 1
    }),
    _ts_metadata("design:type", Number)
], DatabaseListResponseDto.prototype, "page", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 10
    }),
    _ts_metadata("design:type", Number)
], DatabaseListResponseDto.prototype, "limit", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 1
    }),
    _ts_metadata("design:type", Number)
], DatabaseListResponseDto.prototype, "totalPages", void 0);

//# sourceMappingURL=database.dto.js.map