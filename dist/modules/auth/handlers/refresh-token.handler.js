"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RefreshTokenHandler", {
    enumerable: true,
    get: function() {
        return RefreshTokenHandler;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _blacklistedtokenschema = require("../schemas/blacklisted-token.schema");
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
let RefreshTokenHandler = class RefreshTokenHandler {
    async execute(refreshToken) {
        // Check if token is blacklisted
        const found = await this.blacklistedModel.findOne({
            token: refreshToken
        }).exec();
        if (found) {
            throw new _common.UnauthorizedException('Refresh token has been revoked');
        }
        try {
            const payload = this.jwtService.verify(refreshToken);
            const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60; // 31536000
            const newAccessToken = this.jwtService.sign({
                sub: payload.sub,
                email: payload.email,
                userName: payload.userName,
                role: payload.role
            }, {
                expiresIn: ONE_YEAR_SECONDS
            });
            const newRefreshToken = this.jwtService.sign({
                sub: payload.sub,
                email: payload.email,
                userName: payload.userName,
                role: payload.role
            }, {
                expiresIn: ONE_YEAR_SECONDS
            });
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expiresIn: ONE_YEAR_SECONDS
            };
        } catch (error) {
            throw new _common.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    constructor(jwtService, blacklistedModel){
        this.jwtService = jwtService;
        this.blacklistedModel = blacklistedModel;
    }
};
RefreshTokenHandler = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _mongoose.InjectModel)(_blacklistedtokenschema.BlacklistedToken.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], RefreshTokenHandler);

//# sourceMappingURL=refresh-token.handler.js.map