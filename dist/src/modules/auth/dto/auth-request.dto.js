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
exports.RefreshTokenRequestDto = exports.RegisterRequestDto = exports.LoginRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class LoginRequestDto {
}
exports.LoginRequestDto = LoginRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'User email or username',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginRequestDto.prototype, "emailOrUsername", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'password123',
        description: 'User password',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginRequestDto.prototype, "password", void 0);
class RegisterRequestDto {
}
exports.RegisterRequestDto = RegisterRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'User email address',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterRequestDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'johndoe',
        description: 'Unique username',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], RegisterRequestDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'password123',
        minLength: 6,
        description: 'User password',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterRequestDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John',
        description: 'User first name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterRequestDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Doe',
        description: 'User last name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterRequestDto.prototype, "lastName", void 0);
class RefreshTokenRequestDto {
}
exports.RefreshTokenRequestDto = RefreshTokenRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Refresh token',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefreshTokenRequestDto.prototype, "refreshToken", void 0);
//# sourceMappingURL=auth-request.dto.js.map