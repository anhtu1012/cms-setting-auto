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
    get CreateCollectionSchemaDto () {
        return CreateCollectionSchemaDto;
    },
    get FieldDefinitionDto () {
        return FieldDefinitionDto;
    },
    get FieldValidationDto () {
        return FieldValidationDto;
    },
    get ReferenceConfigDto () {
        return ReferenceConfigDto;
    },
    get SelectOptionDto () {
        return SelectOptionDto;
    },
    get UpdateCollectionSchemaDto () {
        return UpdateCollectionSchemaDto;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
const _swagger = require("@nestjs/swagger");
const _fieldtypesinterface = require("../interfaces/field-types.interface");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FieldValidationDto = class FieldValidationDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Field is required'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], FieldValidationDto.prototype, "required", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Minimum value for number fields'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], FieldValidationDto.prototype, "min", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Maximum value for number fields'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], FieldValidationDto.prototype, "max", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Minimum length for text fields'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], FieldValidationDto.prototype, "minLength", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Maximum length for text fields'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], FieldValidationDto.prototype, "maxLength", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Regex pattern for validation'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FieldValidationDto.prototype, "pattern", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Allowed enum values',
        type: [
            String
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    _ts_metadata("design:type", Array)
], FieldValidationDto.prototype, "enum", void 0);
let SelectOptionDto = class SelectOptionDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Option label',
        example: 'Option 1'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SelectOptionDto.prototype, "label", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Option value',
        example: 'option1'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SelectOptionDto.prototype, "value", void 0);
let ReferenceConfigDto = class ReferenceConfigDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Referenced collection name',
        example: 'users'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ReferenceConfigDto.prototype, "collection", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Display field from referenced collection',
        example: 'name'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ReferenceConfigDto.prototype, "displayField", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Allow multiple references',
        default: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], ReferenceConfigDto.prototype, "multiple", void 0);
let FieldDefinitionDto = class FieldDefinitionDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Field name (slug)',
        example: 'product_name'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FieldDefinitionDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _fieldtypesinterface.FieldType,
        description: 'Field type'
    }),
    (0, _classvalidator.IsEnum)(_fieldtypesinterface.FieldType),
    _ts_metadata("design:type", typeof _fieldtypesinterface.FieldType === "undefined" ? Object : _fieldtypesinterface.FieldType)
], FieldDefinitionDto.prototype, "type", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Field display label',
        example: 'Product Name'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FieldDefinitionDto.prototype, "label", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Field description'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FieldDefinitionDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Default value for the field'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], FieldDefinitionDto.prototype, "defaultValue", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Validation rules',
        type: FieldValidationDto
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>FieldValidationDto),
    _ts_metadata("design:type", typeof FieldValidationDto === "undefined" ? Object : FieldValidationDto)
], FieldDefinitionDto.prototype, "validation", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Options for select/radio fields',
        type: [
            SelectOptionDto
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>SelectOptionDto),
    _ts_metadata("design:type", Array)
], FieldDefinitionDto.prototype, "options", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Reference configuration',
        type: ReferenceConfigDto
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>ReferenceConfigDto),
    _ts_metadata("design:type", typeof ReferenceConfigDto === "undefined" ? Object : ReferenceConfigDto)
], FieldDefinitionDto.prototype, "referenceConfig", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Placeholder text'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FieldDefinitionDto.prototype, "placeholder", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Help text'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FieldDefinitionDto.prototype, "helpText", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Show in list view',
        default: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], FieldDefinitionDto.prototype, "showInList", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Show in form',
        default: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], FieldDefinitionDto.prototype, "showInForm", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Field is sortable',
        default: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], FieldDefinitionDto.prototype, "sortable", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Field is searchable',
        default: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], FieldDefinitionDto.prototype, "searchable", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Display order',
        default: 0
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], FieldDefinitionDto.prototype, "order", void 0);
let CreateCollectionSchemaDto = class CreateCollectionSchemaDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Database ID that this collection belongs to',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateCollectionSchemaDto.prototype, "databaseId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Collection name (slug)',
        example: 'products'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateCollectionSchemaDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Collection display name',
        example: 'Products'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateCollectionSchemaDto.prototype, "displayName", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Collection description',
        example: 'Manage product catalog'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateCollectionSchemaDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Icon name',
        example: 'shopping-cart'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateCollectionSchemaDto.prototype, "icon", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Field definitions',
        type: [
            FieldDefinitionDto
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>FieldDefinitionDto),
    _ts_metadata("design:type", Array)
], CreateCollectionSchemaDto.prototype, "fields", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Auto-add timestamps',
        default: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], CreateCollectionSchemaDto.prototype, "timestamps", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Enable soft delete',
        default: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], CreateCollectionSchemaDto.prototype, "softDelete", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Enable auto-generated API',
        default: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], CreateCollectionSchemaDto.prototype, "enableApi", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Custom API path',
        example: '/api/v1/products'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateCollectionSchemaDto.prototype, "apiPath", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Permission configuration',
        example: {
            create: [
                'admin'
            ],
            read: [
                'admin',
                'user'
            ]
        }
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], CreateCollectionSchemaDto.prototype, "permissions", void 0);
let UpdateCollectionSchemaDto = class UpdateCollectionSchemaDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Collection display name'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateCollectionSchemaDto.prototype, "displayName", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Collection description'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateCollectionSchemaDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Icon name'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateCollectionSchemaDto.prototype, "icon", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Field definitions',
        type: [
            FieldDefinitionDto
        ]
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>FieldDefinitionDto),
    _ts_metadata("design:type", Array)
], UpdateCollectionSchemaDto.prototype, "fields", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Auto-add timestamps'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateCollectionSchemaDto.prototype, "timestamps", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Enable soft delete'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateCollectionSchemaDto.prototype, "softDelete", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Enable auto-generated API'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateCollectionSchemaDto.prototype, "enableApi", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Custom API path'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateCollectionSchemaDto.prototype, "apiPath", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Permission configuration'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], UpdateCollectionSchemaDto.prototype, "permissions", void 0);

//# sourceMappingURL=collection-schema.dto.js.map