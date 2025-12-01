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
exports.UpdateCollectionSchemaDto = exports.CreateCollectionSchemaDto = exports.FieldDefinitionDto = exports.ReferenceConfigDto = exports.SelectOptionDto = exports.FieldValidationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const field_types_interface_1 = require("../interfaces/field-types.interface");
class FieldValidationDto {
}
exports.FieldValidationDto = FieldValidationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field is required' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FieldValidationDto.prototype, "required", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum value for number fields' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FieldValidationDto.prototype, "min", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum value for number fields' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FieldValidationDto.prototype, "max", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum length for text fields' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FieldValidationDto.prototype, "minLength", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum length for text fields' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FieldValidationDto.prototype, "maxLength", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Regex pattern for validation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FieldValidationDto.prototype, "pattern", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Allowed enum values', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], FieldValidationDto.prototype, "enum", void 0);
class SelectOptionDto {
}
exports.SelectOptionDto = SelectOptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Option label', example: 'Option 1' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SelectOptionDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Option value', example: 'option1' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SelectOptionDto.prototype, "value", void 0);
class ReferenceConfigDto {
}
exports.ReferenceConfigDto = ReferenceConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referenced collection name', example: 'users' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReferenceConfigDto.prototype, "collection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Display field from referenced collection',
        example: 'name',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReferenceConfigDto.prototype, "displayField", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Allow multiple references',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReferenceConfigDto.prototype, "multiple", void 0);
class FieldDefinitionDto {
}
exports.FieldDefinitionDto = FieldDefinitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Field name (slug)', example: 'product_name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FieldDefinitionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: field_types_interface_1.FieldType, description: 'Field type' }),
    (0, class_validator_1.IsEnum)(field_types_interface_1.FieldType),
    __metadata("design:type", String)
], FieldDefinitionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Field display label', example: 'Product Name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FieldDefinitionDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FieldDefinitionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default value for the field' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FieldDefinitionDto.prototype, "defaultValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Validation rules',
        type: FieldValidationDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FieldValidationDto),
    __metadata("design:type", FieldValidationDto)
], FieldDefinitionDto.prototype, "validation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Options for select/radio fields',
        type: [SelectOptionDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SelectOptionDto),
    __metadata("design:type", Array)
], FieldDefinitionDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reference configuration',
        type: ReferenceConfigDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ReferenceConfigDto),
    __metadata("design:type", ReferenceConfigDto)
], FieldDefinitionDto.prototype, "referenceConfig", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Placeholder text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FieldDefinitionDto.prototype, "placeholder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Help text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FieldDefinitionDto.prototype, "helpText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show in list view', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FieldDefinitionDto.prototype, "showInList", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show in form', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FieldDefinitionDto.prototype, "showInForm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field is sortable', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FieldDefinitionDto.prototype, "sortable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field is searchable', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FieldDefinitionDto.prototype, "searchable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Display order', default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FieldDefinitionDto.prototype, "order", void 0);
class CreateCollectionSchemaDto {
}
exports.CreateCollectionSchemaDto = CreateCollectionSchemaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Database ID that this collection belongs to',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCollectionSchemaDto.prototype, "databaseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Collection name (slug)',
        example: 'products',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCollectionSchemaDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Collection display name',
        example: 'Products',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCollectionSchemaDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Collection description',
        example: 'Manage product catalog',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCollectionSchemaDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Icon name', example: 'shopping-cart' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCollectionSchemaDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Field definitions',
        type: [FieldDefinitionDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FieldDefinitionDto),
    __metadata("design:type", Array)
], CreateCollectionSchemaDto.prototype, "fields", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Auto-add timestamps',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCollectionSchemaDto.prototype, "timestamps", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable soft delete',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCollectionSchemaDto.prototype, "softDelete", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable auto-generated API',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCollectionSchemaDto.prototype, "enableApi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom API path',
        example: '/api/v1/products',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCollectionSchemaDto.prototype, "apiPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Permission configuration',
        example: { create: ['admin'], read: ['admin', 'user'] },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCollectionSchemaDto.prototype, "permissions", void 0);
class UpdateCollectionSchemaDto {
}
exports.UpdateCollectionSchemaDto = UpdateCollectionSchemaDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Collection display name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCollectionSchemaDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Collection description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCollectionSchemaDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Icon name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCollectionSchemaDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Field definitions',
        type: [FieldDefinitionDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FieldDefinitionDto),
    __metadata("design:type", Array)
], UpdateCollectionSchemaDto.prototype, "fields", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Auto-add timestamps' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCollectionSchemaDto.prototype, "timestamps", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable soft delete' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCollectionSchemaDto.prototype, "softDelete", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable auto-generated API' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCollectionSchemaDto.prototype, "enableApi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom API path' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCollectionSchemaDto.prototype, "apiPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Permission configuration' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateCollectionSchemaDto.prototype, "permissions", void 0);
//# sourceMappingURL=collection-schema.dto.js.map