"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const mongoose_1 = require("@nestjs/mongoose");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const user_schema_1 = require("../users/schemas/user.schema");
const blacklisted_token_schema_1 = require("./schemas/blacklisted-token.schema");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const login_handler_1 = require("./handlers/login.handler");
const register_handler_1 = require("./handlers/register.handler");
const refresh_token_handler_1 = require("./handlers/refresh-token.handler");
const logout_handler_1 = require("./handlers/logout.handler");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: blacklisted_token_schema_1.BlacklistedToken.name, schema: blacklisted_token_schema_1.BlacklistedTokenSchema },
            ]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') ||
                        'your-secret-key-change-this',
                    signOptions: { expiresIn: 365 * 24 * 60 * 60 },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            login_handler_1.LoginHandler,
            register_handler_1.RegisterHandler,
            refresh_token_handler_1.RefreshTokenHandler,
            logout_handler_1.LogoutHandler,
        ],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map