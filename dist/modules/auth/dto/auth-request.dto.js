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
    get LoginRequestDto () {
        return LoginRequestDto;
    },
    get RefreshTokenRequestDto () {
        return RefreshTokenRequestDto;
    },
    get RegisterRequestDto () {
        return RegisterRequestDto;
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
let LoginRequestDto = class LoginRequestDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'user@example.com',
        description: 'User email or username'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], LoginRequestDto.prototype, "emailOrUsername", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'password123',
        description: 'User password'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], LoginRequestDto.prototype, "password", void 0);
let RegisterRequestDto = class RegisterRequestDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'user@example.com',
        description: 'User email address'
    }),
    (0, _classvalidator.IsEmail)(),
    _ts_metadata("design:type", String)
], RegisterRequestDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'johndoe',
        description: 'Unique username'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(3),
    _ts_metadata("design:type", String)
], RegisterRequestDto.prototype, "userName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'password123',
        minLength: 6,
        description: 'User password'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(6),
    _ts_metadata("design:type", String)
], RegisterRequestDto.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'John',
        description: 'User first name'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], RegisterRequestDto.prototype, "firstName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Doe',
        description: 'User last name'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], RegisterRequestDto.prototype, "lastName", void 0);
let RefreshTokenRequestDto = class RefreshTokenRequestDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Refresh token'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], RefreshTokenRequestDto.prototype, "refreshToken", void 0);

//# sourceMappingURL=auth-request.dto.js.map