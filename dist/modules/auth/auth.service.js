"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _userschema = require("../users/schemas/user.schema");
const _loginhandler = require("./handlers/login.handler");
const _registerhandler = require("./handlers/register.handler");
const _refreshtokenhandler = require("./handlers/refresh-token.handler");
const _logouthandler = require("./handlers/logout.handler");
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
let AuthService = class AuthService {
    async login(loginDto) {
        // Find user by email or username
        const user = await this.userModel.findOne({
            $or: [
                {
                    email: loginDto.emailOrUsername
                },
                {
                    userName: loginDto.emailOrUsername
                }
            ]
        }).exec();
        if (!user) {
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        // Validate password
        const isPasswordValid = await this.loginHandler.validatePassword(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new _common.UnauthorizedException('Account is inactive');
        }
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        // Generate tokens
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
    constructor(userModel, loginHandler, registerHandler, refreshTokenHandler, logoutHandler){
        this.userModel = userModel;
        this.loginHandler = loginHandler;
        this.registerHandler = registerHandler;
        this.refreshTokenHandler = refreshTokenHandler;
        this.logoutHandler = logoutHandler;
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_userschema.User.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _loginhandler.LoginHandler === "undefined" ? Object : _loginhandler.LoginHandler,
        typeof _registerhandler.RegisterHandler === "undefined" ? Object : _registerhandler.RegisterHandler,
        typeof _refreshtokenhandler.RefreshTokenHandler === "undefined" ? Object : _refreshtokenhandler.RefreshTokenHandler,
        typeof _logouthandler.LogoutHandler === "undefined" ? Object : _logouthandler.LogoutHandler
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map