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
    get LoginResponseDto () {
        return LoginResponseDto;
    },
    get RefreshTokenResponseDto () {
        return RefreshTokenResponseDto;
    },
    get RegisterResponseDto () {
        return RegisterResponseDto;
    },
    get UserResponseDto () {
        return UserResponseDto;
    }
});
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
let UserResponseDto = class UserResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '507f1f77bcf86cd799439011'
    }),
    _ts_metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'user@example.com'
    }),
    _ts_metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'johndoe'
    }),
    _ts_metadata("design:type", String)
], UserResponseDto.prototype, "userName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'John'
    }),
    _ts_metadata("design:type", String)
], UserResponseDto.prototype, "firstName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Doe'
    }),
    _ts_metadata("design:type", String)
], UserResponseDto.prototype, "lastName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'user'
    }),
    _ts_metadata("design:type", String)
], UserResponseDto.prototype, "role", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: true
    }),
    _ts_metadata("design:type", Boolean)
], UserResponseDto.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'https://example.com/avatar.jpg',
        required: false
    }),
    _ts_metadata("design:type", String)
], UserResponseDto.prototype, "avatar", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 100
    }),
    _ts_metadata("design:type", Number)
], UserResponseDto.prototype, "points", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 500.5
    }),
    _ts_metadata("design:type", Number)
], UserResponseDto.prototype, "walletBalance", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '2023-12-01T10:30:00Z'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserResponseDto.prototype, "lastLogin", void 0);
let LoginResponseDto = class LoginResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }),
    _ts_metadata("design:type", String)
], LoginResponseDto.prototype, "accessToken", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }),
    _ts_metadata("design:type", String)
], LoginResponseDto.prototype, "refreshToken", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: UserResponseDto
    }),
    _ts_metadata("design:type", typeof UserResponseDto === "undefined" ? Object : UserResponseDto)
], LoginResponseDto.prototype, "userProfile", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 31536000
    }),
    _ts_metadata("design:type", Number)
], LoginResponseDto.prototype, "expiresIn", void 0);
let RegisterResponseDto = class RegisterResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'User registered successfully'
    }),
    _ts_metadata("design:type", String)
], RegisterResponseDto.prototype, "message", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: UserResponseDto
    }),
    _ts_metadata("design:type", typeof UserResponseDto === "undefined" ? Object : UserResponseDto)
], RegisterResponseDto.prototype, "userProfile", void 0);
let RefreshTokenResponseDto = class RefreshTokenResponseDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }),
    _ts_metadata("design:type", String)
], RefreshTokenResponseDto.prototype, "accessToken", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }),
    _ts_metadata("design:type", String)
], RefreshTokenResponseDto.prototype, "refreshToken", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 31536000
    }),
    _ts_metadata("design:type", Number)
], RefreshTokenResponseDto.prototype, "expiresIn", void 0);

//# sourceMappingURL=auth-response.dto.js.map