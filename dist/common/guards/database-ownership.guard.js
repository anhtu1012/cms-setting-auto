"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DatabaseOwnershipGuard", {
    enumerable: true,
    get: function() {
        return DatabaseOwnershipGuard;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _databaseschema = require("../../modules/dynamic-cms/schemas/database.schema");
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
let DatabaseOwnershipGuard = class DatabaseOwnershipGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const databaseId = request.headers['x-database-id'];
        // Kiểm tra có user từ JWT guard không
        if (!user || !user.userId) {
            throw new _common.ForbiddenException('User authentication required');
        }
        // Kiểm tra có databaseId trong header không
        if (!databaseId) {
            throw new _common.BadRequestException('Database ID is required in header x-database-id');
        }
        // Validate ObjectId format
        if (!_mongoose1.Types.ObjectId.isValid(databaseId)) {
            throw new _common.BadRequestException('Invalid Database ID format');
        }
        // Kiểm tra database có tồn tại và thuộc về user không
        const database = await this.databaseModel.findOne({
            _id: new _mongoose1.Types.ObjectId(databaseId),
            userId: new _mongoose1.Types.ObjectId(user.userId),
            isActive: true
        }).exec();
        if (!database) {
            throw new _common.ForbiddenException('Database not found or you do not have access to this database');
        }
        // Lưu database vào request để sử dụng sau này nếu cần
        request.database = database;
        return true;
    }
    constructor(databaseModel){
        this.databaseModel = databaseModel;
    }
};
DatabaseOwnershipGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_databaseschema.Database.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], DatabaseOwnershipGuard);

//# sourceMappingURL=database-ownership.guard.js.map