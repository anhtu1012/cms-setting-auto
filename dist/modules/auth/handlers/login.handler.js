"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoginHandler", {
    enumerable: true,
    get: function() {
        return LoginHandler;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LoginHandler = class LoginHandler {
    async execute(user) {
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            userName: user.userName,
            role: user.role
        };
        // Set tokens to expire in 1 year (seconds)
        const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60; // 31536000
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: ONE_YEAR_SECONDS
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: ONE_YEAR_SECONDS
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
                lastLogin: user.lastLogin
            },
            expiresIn: ONE_YEAR_SECONDS
        };
    }
    async validatePassword(plainPassword, hashedPassword) {
        return _bcrypt.compare(plainPassword, hashedPassword);
    }
    constructor(jwtService){
        this.jwtService = jwtService;
    }
};
LoginHandler = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService
    ])
], LoginHandler);

//# sourceMappingURL=login.handler.js.map