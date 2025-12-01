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
exports.RegisterHandler = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("../../users/schemas/user.schema");
let RegisterHandler = class RegisterHandler {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async execute(registerDto) {
        const existingUser = await this.userModel
            .findOne({
            $or: [{ email: registerDto.email }, { userName: registerDto.userName }],
        })
            .exec();
        if (existingUser) {
            if (existingUser.email === registerDto.email) {
                throw new common_1.ConflictException('Email already exists');
            }
            if (existingUser.userName === registerDto.userName) {
                throw new common_1.ConflictException('Username already exists');
            }
        }
        const hashedPassword = await this.hashPassword(registerDto.password);
        const newUser = new this.userModel({
            ...registerDto,
            password: hashedPassword,
            points: 0,
            walletBalance: 0,
            walletTransactions: [],
            pointsHistory: [],
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
                lastLogin: savedUser.lastLogin,
            },
        };
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
};
exports.RegisterHandler = RegisterHandler;
exports.RegisterHandler = RegisterHandler = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RegisterHandler);
//# sourceMappingURL=register.handler.js.map