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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseListResponseDto = exports.DatabaseResponseDto = exports.UpdateDatabaseDto = exports.CreateDatabaseDto = exports.DatabaseSettingsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class DatabaseSettingsDto {
}
exports.DatabaseSettingsDto = DatabaseSettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default language',
        example: 'en',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DatabaseSettingsDto.prototype, "defaultLanguage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timezone',
        example: 'Asia/Ho_Chi_Minh',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DatabaseSettingsDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date format',
        example: 'DD/MM/YYYY',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DatabaseSettingsDto.prototype, "dateFormat", void 0);
class CreateDatabaseDto {
}
exports.CreateDatabaseDto = CreateDatabaseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Database name (slug, lowercase, no spaces)',
        example: 'my-ecommerce-db',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.Matches)(/^[a-z0-9-]+$/, {
        message: 'Name must be lowercase, alphanumeric with hyphens only',
    }),
    __metadata("design:type", String)
], CreateDatabaseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Display name for the database',
        example: 'My E-commerce Database',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDatabaseDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Database description',
        example: 'Main database for e-commerce platform',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDatabaseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Icon for the database',
        example: '🛒',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDatabaseDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Database settings',
        type: DatabaseSettingsDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DatabaseSettingsDto),
    __metadata("design:type", DatabaseSettingsDto)
], CreateDatabaseDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tags for categorization',
        example: ['production', 'e-commerce'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDatabaseDto.prototype, "tags", void 0);
class UpdateDatabaseDto extends (0, swagger_1.PartialType)(CreateDatabaseDto) {
}
exports.UpdateDatabaseDto = UpdateDatabaseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Active status of the database',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDatabaseDto.prototype, "isActive", void 0);
class DatabaseResponseDto {
}
exports.DatabaseResponseDto = DatabaseResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011' }),
    __metadata("design:type", String)
], DatabaseResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'my-ecommerce-db' }),
    __metadata("design:type", String)
], DatabaseResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My E-commerce Database' }),
    __metadata("design:type", String)
], DatabaseResponseDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Main database for e-commerce platform' }),
    __metadata("design:type", String)
], DatabaseResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011' }),
    __metadata("design:type", String)
], DatabaseResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], DatabaseResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '🛒' }),
    __metadata("design:type", String)
], DatabaseResponseDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { defaultLanguage: 'en', timezone: 'Asia/Ho_Chi_Minh' },
    }),
    __metadata("design:type", DatabaseSettingsDto)
], DatabaseResponseDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['production', 'e-commerce'] }),
    __metadata("design:type", Array)
], DatabaseResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], DatabaseResponseDto.prototype, "collectionsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1250 }),
    __metadata("design:type", Number)
], DatabaseResponseDto.prototype, "dataCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-12-01T10:30:00Z' }),
    __metadata("design:type", Date)
], DatabaseResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-12-01T10:30:00Z' }),
    __metadata("design:type", Date)
], DatabaseResponseDto.prototype, "updatedAt", void 0);
class DatabaseListResponseDto {
}
exports.DatabaseListResponseDto = DatabaseListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DatabaseResponseDto] }),
    __metadata("design:type", Array)
], DatabaseListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], DatabaseListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DatabaseListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], DatabaseListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DatabaseListResponseDto.prototype, "totalPages", void 0);
//# sourceMappingURL=database.dto.js.map