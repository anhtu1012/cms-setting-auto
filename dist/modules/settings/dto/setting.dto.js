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
    get CreateSettingDto () {
        return CreateSettingDto;
    },
    get UpdateSettingDto () {
        return UpdateSettingDto;
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
let CreateSettingDto = class CreateSettingDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'site_name',
        description: 'Setting key (unique identifier)'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSettingDto.prototype, "key", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: {
            en: 'My Site',
            vi: 'Website của tôi'
        },
        description: 'Setting value (any type)'
    }),
    _ts_metadata("design:type", Object)
], CreateSettingDto.prototype, "value", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Website name configuration',
        description: 'Setting description'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSettingDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: [
            'general',
            'appearance',
            'security',
            'notification',
            'integration'
        ],
        default: 'general',
        description: 'Setting category'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)([
        'general',
        'appearance',
        'security',
        'notification',
        'integration'
    ]),
    _ts_metadata("design:type", String)
], CreateSettingDto.prototype, "category", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: true,
        default: true,
        description: 'Is setting publicly accessible'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], CreateSettingDto.prototype, "isPublic", void 0);
let UpdateSettingDto = class UpdateSettingDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: {
            en: 'My Site',
            vi: 'Website của tôi'
        },
        description: 'Setting value (any type)'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], UpdateSettingDto.prototype, "value", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Website name configuration',
        description: 'Setting description'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateSettingDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: [
            'general',
            'appearance',
            'security',
            'notification',
            'integration'
        ],
        description: 'Setting category'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)([
        'general',
        'appearance',
        'security',
        'notification',
        'integration'
    ]),
    _ts_metadata("design:type", String)
], UpdateSettingDto.prototype, "category", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: true,
        description: 'Is setting publicly accessible'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], UpdateSettingDto.prototype, "isPublic", void 0);

//# sourceMappingURL=setting.dto.js.map