"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _config = require("@nestjs/config");
const _passport = require("@nestjs/passport");
const _mongoose = require("@nestjs/mongoose");
const _authcontroller = require("./auth.controller");
const _authservice = require("./auth.service");
const _userschema = require("../users/schemas/user.schema");
const _blacklistedtokenschema = require("./schemas/blacklisted-token.schema");
const _jwtstrategy = require("./strategies/jwt.strategy");
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
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _mongoose.MongooseModule.forFeature([
                {
                    name: _userschema.User.name,
                    schema: _userschema.UserSchema
                },
                {
                    name: _blacklistedtokenschema.BlacklistedToken.name,
                    schema: _blacklistedtokenschema.BlacklistedTokenSchema
                }
            ]),
            _passport.PassportModule,
            _jwt.JwtModule.registerAsync({
                imports: [
                    _config.ConfigModule
                ],
                inject: [
                    _config.ConfigService
                ],
                useFactory: async (configService)=>({
                        secret: configService.get('JWT_SECRET') || 'your-secret-key-change-this',
                        // default token lifetime set to 1 year (in seconds)
                        signOptions: {
                            expiresIn: 365 * 24 * 60 * 60
                        }
                    })
            })
        ],
        controllers: [
            _authcontroller.AuthController
        ],
        providers: [
            _authservice.AuthService,
            _jwtstrategy.JwtStrategy,
            _loginhandler.LoginHandler,
            _registerhandler.RegisterHandler,
            _refreshtokenhandler.RefreshTokenHandler,
            _logouthandler.LogoutHandler
        ],
        exports: [
            _authservice.AuthService,
            _jwt.JwtModule
        ]
    })
], AuthModule);

//# sourceMappingURL=auth.module.js.map