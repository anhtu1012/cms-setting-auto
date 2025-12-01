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
exports.LoginHandler = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
let LoginHandler = class LoginHandler {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async execute(user) {
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            userName: user.userName,
            role: user.role,
        };
        const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: ONE_YEAR_SECONDS,
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: ONE_YEAR_SECONDS,
        });
        return {
            accessToken,
            refreshToken,
            userProfile: {
                id: user._id.toString(),
                email: user.email,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                avatar: user.avatar,
                points: user.points,
                walletBalance: user.walletBalance,
                lastLogin: user.lastLogin,
            },
            expiresIn: ONE_YEAR_SECONDS,
        };
    }
    async validatePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
};
exports.LoginHandler = LoginHandler;
exports.LoginHandler = LoginHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], LoginHandler);
//# sourceMappingURL=login.handler.js.map