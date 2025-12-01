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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenHandler = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const blacklisted_token_schema_1 = require("../schemas/blacklisted-token.schema");
let RefreshTokenHandler = class RefreshTokenHandler {
    constructor(jwtService, blacklistedModel) {
        this.jwtService = jwtService;
        this.blacklistedModel = blacklistedModel;
    }
    async execute(refreshToken) {
        const found = await this.blacklistedModel
            .findOne({ token: refreshToken })
            .exec();
        if (found) {
            throw new common_1.UnauthorizedException('Refresh token has been revoked');
        }
        try {
            const payload = this.jwtService.verify(refreshToken);
            const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;
            const newAccessToken = this.jwtService.sign({
                sub: payload.sub,
                email: payload.email,
                userName: payload.userName,
                role: payload.role,
            }, { expiresIn: ONE_YEAR_SECONDS });
            const newRefreshToken = this.jwtService.sign({
                sub: payload.sub,
                email: payload.email,
                userName: payload.userName,
                role: payload.role,
            }, { expiresIn: ONE_YEAR_SECONDS });
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expiresIn: ONE_YEAR_SECONDS,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
};
exports.RefreshTokenHandler = RefreshTokenHandler;
exports.RefreshTokenHandler = RefreshTokenHandler = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(blacklisted_token_schema_1.BlacklistedToken.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        mongoose_2.Model])
], RefreshTokenHandler);
//# sourceMappingURL=refresh-token.handler.js.map