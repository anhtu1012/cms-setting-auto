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
exports.DatabaseOwnershipGuard = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const database_schema_1 = require("../../modules/dynamic-cms/schemas/database.schema");
let DatabaseOwnershipGuard = class DatabaseOwnershipGuard {
    constructor(databaseModel) {
        this.databaseModel = databaseModel;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const databaseId = request.headers['x-database-id'];
        if (!user || !user.userId) {
            throw new common_1.ForbiddenException('User authentication required');
        }
        if (!databaseId) {
            throw new common_1.BadRequestException('Database ID is required in header x-database-id');
        }
        if (!mongoose_2.Types.ObjectId.isValid(databaseId)) {
            throw new common_1.BadRequestException('Invalid Database ID format');
        }
        const database = await this.databaseModel
            .findOne({
            _id: new mongoose_2.Types.ObjectId(databaseId),
            userId: new mongoose_2.Types.ObjectId(user.userId),
            isActive: true,
        })
            .exec();
        if (!database) {
            throw new common_1.ForbiddenException('Database not found or you do not have access to this database');
        }
        request.database = database;
        return true;
    }
};
exports.DatabaseOwnershipGuard = DatabaseOwnershipGuard;
exports.DatabaseOwnershipGuard = DatabaseOwnershipGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(database_schema_1.Database.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DatabaseOwnershipGuard);
//# sourceMappingURL=database-ownership.guard.js.map