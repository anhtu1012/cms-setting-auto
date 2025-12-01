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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const login_handler_1 = require("./handlers/login.handler");
const register_handler_1 = require("./handlers/register.handler");
const refresh_token_handler_1 = require("./handlers/refresh-token.handler");
const logout_handler_1 = require("./handlers/logout.handler");
let AuthService = class AuthService {
    constructor(userModel, loginHandler, registerHandler, refreshTokenHandler, logoutHandler) {
        this.userModel = userModel;
        this.loginHandler = loginHandler;
        this.registerHandler = registerHandler;
        this.refreshTokenHandler = refreshTokenHandler;
        this.logoutHandler = logoutHandler;
    }
    async login(loginDto) {
        const user = await this.userModel
            .findOne({
            $or: [
                { email: loginDto.emailOrUsername },
                { userName: loginDto.emailOrUsername },
            ],
        })
            .exec();
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await this.loginHandler.validatePassword(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        user.lastLogin = new Date();
        await user.save();
        return this.loginHandler.execute(user);
    }
    async register(registerDto) {
        return this.registerHandler.execute(registerDto);
    }
    async refreshToken(refreshTokenDto) {
        return this.refreshTokenHandler.execute(refreshTokenDto.refreshToken);
    }
    async logout(refreshToken) {
        return this.logoutHandler.execute(refreshToken);
    }
    async validateUser(userId) {
        return this.userModel.findById(userId).exec();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        login_handler_1.LoginHandler,
        register_handler_1.RegisterHandler,
        refresh_token_handler_1.RefreshTokenHandler,
        logout_handler_1.LogoutHandler])
], AuthService);
//# sourceMappingURL=auth.service.js.map