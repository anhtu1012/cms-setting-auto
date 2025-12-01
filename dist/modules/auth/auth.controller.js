"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _authservice = require("./auth.service");
const _authrequestdto = require("./dto/auth-request.dto");
const _authresponsedto = require("./dto/auth-response.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AuthController = class AuthController {
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async refreshToken(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto);
    }
    async logout(refreshTokenDto) {
        return this.authService.logout(refreshTokenDto.refreshToken);
    }
    constructor(authService){
        this.authService = authService;
    }
};
_ts_decorate([
    (0, _common.Post)('login'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Login user'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'User logged in successfully',
        type: _authresponsedto.LoginResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Invalid credentials'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authrequestdto.LoginRequestDto === "undefined" ? Object : _authrequestdto.LoginRequestDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
_ts_decorate([
    (0, _common.Post)('register'),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    (0, _swagger.ApiOperation)({
        summary: 'Register new user'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'User registered successfully',
        type: _authresponsedto.RegisterResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 409,
        description: 'Email or username already exists'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authrequestdto.RegisterRequestDto === "undefined" ? Object : _authrequestdto.RegisterRequestDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
_ts_decorate([
    (0, _common.Post)('refresh-token'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Refresh access token'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully',
        type: _authresponsedto.RefreshTokenResponseDto
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Invalid or expired refresh token'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authrequestdto.RefreshTokenRequestDto === "undefined" ? Object : _authrequestdto.RefreshTokenRequestDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
_ts_decorate([
    (0, _common.Post)('logout'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Logout and revoke refresh token'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Logged out successfully'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authrequestdto.RefreshTokenRequestDto === "undefined" ? Object : _authrequestdto.RefreshTokenRequestDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = _ts_decorate([
    (0, _swagger.ApiTags)('Authentication'),
    (0, _common.Controller)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map