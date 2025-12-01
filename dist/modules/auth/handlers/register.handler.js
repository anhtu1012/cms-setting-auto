"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RegisterHandler", {
    enumerable: true,
    get: function() {
        return RegisterHandler;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _userschema = require("../../users/schemas/user.schema");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let RegisterHandler = class RegisterHandler {
    async execute(registerDto) {
        // Check if user exists
        const existingUser = await this.userModel.findOne({
            $or: [
                {
                    email: registerDto.email
                },
                {
                    userName: registerDto.userName
                }
            ]
        }).exec();
        if (existingUser) {
            if (existingUser.email === registerDto.email) {
                throw new _common.ConflictException('Email already exists');
            }
            if (existingUser.userName === registerDto.userName) {
                throw new _common.ConflictException('Username already exists');
            }
        }
        // Hash password
        const hashedPassword = await this.hashPassword(registerDto.password);
        // Create user
        const newUser = new this.userModel({
            ...registerDto,
            password: hashedPassword,
            points: 0,
            walletBalance: 0,
            walletTransactions: [],
            pointsHistory: []
        });
        const savedUser = await newUser.save();
        return {
            message: 'User registered successfully',
            userProfile: {
                id: savedUser._id.toString(),
                email: savedUser.email,
                userName: savedUser.userName,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                role: savedUser.role,
                isActive: savedUser.isActive,
                avatar: savedUser.avatar,
                points: savedUser.points,
                walletBalance: savedUser.walletBalance,
                lastLogin: savedUser.lastLogin
            }
        };
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return _bcrypt.hash(password, saltRounds);
    }
    constructor(userModel){
        this.userModel = userModel;
    }
};
RegisterHandler = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_userschema.User.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], RegisterHandler);

//# sourceMappingURL=register.handler.js.map