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
    get CreateUserDto () {
        return CreateUserDto;
    },
    get UpdateUserDto () {
        return UpdateUserDto;
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
let CreateUserDto = class CreateUserDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'user@example.com',
        description: 'User email address'
    }),
    (0, _classvalidator.IsEmail)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'johndoe',
        description: 'Unique username'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(3),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "userName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'password123',
        minLength: 6,
        description: 'User password'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(6),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'John',
        description: 'User first name'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Doe',
        description: 'User last name'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: [
            'admin',
            'user',
            'editor'
        ],
        default: 'user',
        description: 'User role'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)([
        'admin',
        'user',
        'editor'
    ]),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'https://example.com/avatar.jpg',
        description: 'User avatar URL'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "avatar", void 0);
let UpdateUserDto = class UpdateUserDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'johndoe',
        description: 'Username'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(3),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "userName", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'John',
        description: 'User first name'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Doe',
        description: 'User last name'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: [
            'admin',
            'user',
            'editor'
        ],
        description: 'User role'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)([
        'admin',
        'user',
        'editor'
    ]),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'https://example.com/avatar.jpg',
        description: 'User avatar URL'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "avatar", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: true,
        description: 'User active status'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 100,
        description: 'User points'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], UpdateUserDto.prototype, "points", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 500.5,
        description: 'Wallet balance'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], UpdateUserDto.prototype, "walletBalance", void 0);

//# sourceMappingURL=user.dto.js.map