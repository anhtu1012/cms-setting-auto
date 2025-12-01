"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LogoutHandler", {
    enumerable: true,
    get: function() {
        return LogoutHandler;
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
let LogoutHandler = class LogoutHandler {
    async execute(refreshToken) {
        if (!refreshToken) {
            throw new _common.BadRequestException('Refresh token is required');
        }
        // Try to decode token to determine expiry
        try {
            const payload = this.jwtService.verify(refreshToken, {
                ignoreExpiration: true
            });
            // Calculate expiry date from exp claim if present
            const expiresAt = payload?.exp ? new Date(payload.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000);
            // Store in blacklist (upsert to avoid duplicates)
            await this.blacklistedModel.updateOne({
                token: refreshToken
            }, {
                token: refreshToken,
                expiresAt
            }, {
                upsert: true
            }).exec();
            return {
                success: true,
                message: 'Logged out successfully'
            };
        } catch (err) {
            // If token invalid, still respond success so callers can clear local tokens
            await this.blacklistedModel.updateOne({
                token: refreshToken
            }, {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000)
            }, {
                upsert: true
            }).exec();
            return {
                success: true,
                message: 'Logged out successfully'
            };
        }
    }
    constructor(jwtService, blacklistedModel){
        this.jwtService = jwtService;
        this.blacklistedModel = blacklistedModel;
    }
};
LogoutHandler = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _mongoose.InjectModel)(_blacklistedtokenschema.BlacklistedToken.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], LogoutHandler);

//# sourceMappingURL=logout.handler.js.map