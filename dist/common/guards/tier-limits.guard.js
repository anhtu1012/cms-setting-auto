"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TierLimitsGuard", {
    enumerable: true,
    get: function() {
        return TierLimitsGuard;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _userschema = require("../../modules/users/schemas/user.schema");
const _databaseschema = require("../../modules/dynamic-cms/schemas/database.schema");
const _dynamicdataschema = require("../../modules/dynamic-cms/schemas/dynamic-data.schema");
const _apiroutesconstants = require("../constants/api-routes.constants");
const _tierconfigservice = require("../tier/tier-config.service");
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
let TierLimitsGuard = class TierLimitsGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.userId;
        if (!userId) {
            throw new _common.BadRequestException('User ID not found in request');
        }
        // Lấy thông tin user và tier
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new _common.ForbiddenException('User not found');
        }
        const tierLimits = await this.tierConfigService.getTierLimits(user.tier);
        const method = request.method;
        const path = request.route?.path;
        // Kiểm tra giới hạn dựa trên endpoint
        if (this.isDatabaseCreation(method, path)) {
            await this.checkDatabaseLimit(user, tierLimits);
        } else if (this.isDataCreation(method, path, request)) {
            await this.checkDataLimit(user, tierLimits, request);
        } else if (this.isBulkCreation(method, path)) {
            await this.checkBulkDataLimit(user, tierLimits, request);
        } else if (this.isReplaceAll(method, path)) {
            await this.checkReplaceAllLimit(user, tierLimits, request);
        }
        return true;
    }
    /**
   * Kiểm tra xem có phải là tạo database không
   */ isDatabaseCreation(method, path) {
        return method === 'POST' && path === _apiroutesconstants.ROUTE_PATTERNS.DATABASE_CREATE;
    }
    /**
   * Kiểm tra xem có phải là tạo data không
   */ isDataCreation(method, path, request) {
        // POST /v1/:databaseId/:collectionName (không phải bulk hoặc replace-all)
        return method === 'POST' && (path === _apiroutesconstants.ROUTE_PATTERNS.DATA_CREATE_V1 || path === _apiroutesconstants.ROUTE_PATTERNS.DATA_CREATE) && !path.includes('bulk') && !path.includes('replace-all');
    }
    /**
   * Kiểm tra xem có phải là bulk create không
   */ isBulkCreation(method, path) {
        return method === 'POST' && (path === _apiroutesconstants.ROUTE_PATTERNS.DATA_BULK_CREATE_V1 || path === _apiroutesconstants.ROUTE_PATTERNS.DATA_BULK_CREATE);
    }
    /**
   * Kiểm tra xem có phải là replace-all không
   */ isReplaceAll(method, path) {
        return method === 'PUT' && (path === _apiroutesconstants.ROUTE_PATTERNS.DATA_REPLACE_ALL_V1 || path === _apiroutesconstants.ROUTE_PATTERNS.DATA_REPLACE_ALL);
    }
    /**
   * Kiểm tra giới hạn tạo database
   */ async checkDatabaseLimit(user, tierLimits) {
        // Nếu unlimited thì bỏ qua
        if (this.tierConfigService.isUnlimited(tierLimits.maxDatabases)) {
            return;
        }
        // Đếm số database hiện tại của user
        const currentCount = await this.databaseModel.countDocuments({
            userId: user._id,
            isActive: true
        }).exec();
        if (currentCount >= tierLimits.maxDatabases) {
            throw new _common.ForbiddenException(`You have reached the maximum number of databases (${tierLimits.maxDatabases}) for your ${user.tier} tier. Please upgrade your account or delete unused databases.`);
        }
    }
    /**
   * Kiểm tra giới hạn tạo data trong collection
   */ async checkDataLimit(user, tierLimits, request) {
        // Nếu unlimited thì bỏ qua
        if (this.tierConfigService.isUnlimited(tierLimits.maxDataPerCollection)) {
            return;
        }
        const databaseId = request.params.databaseId;
        const collectionName = request.params.collectionName;
        // Validate ObjectId format
        if (!_mongoose1.Types.ObjectId.isValid(databaseId)) {
            throw new _common.BadRequestException(`Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`);
        }
        // Kiểm tra database có thuộc về user không
        const database = await this.databaseModel.findOne({
            _id: databaseId,
            userId: user._id
        }).exec();
        if (!database) {
            throw new _common.ForbiddenException('Database not found or you do not have access');
        }
        // Đếm số data hiện tại trong collection
        const currentCount = await this.dynamicDataModel.countDocuments({
            databaseId: databaseId,
            _collection: collectionName
        }).exec();
        if (currentCount >= tierLimits.maxDataPerCollection) {
            throw new _common.ForbiddenException(`You have reached the maximum number of data (${tierLimits.maxDataPerCollection}) per collection for your ${user.tier} tier. Please upgrade your account or delete unused data.`);
        }
    }
    /**
   * Kiểm tra giới hạn tạo bulk data
   */ async checkBulkDataLimit(user, tierLimits, request) {
        // Nếu unlimited thì bỏ qua
        if (this.tierConfigService.isUnlimited(tierLimits.maxDataPerCollection)) {
            return;
        }
        const databaseId = request.params.databaseId;
        const collectionName = request.params.collectionName;
        const dataArray = request.body;
        if (!Array.isArray(dataArray)) {
            throw new _common.BadRequestException('Body must be an array');
        }
        // Validate ObjectId format
        if (!_mongoose1.Types.ObjectId.isValid(databaseId)) {
            throw new _common.BadRequestException(`Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`);
        }
        // Kiểm tra database có thuộc về user không
        const database = await this.databaseModel.findOne({
            _id: databaseId,
            userId: user._id
        }).exec();
        if (!database) {
            throw new _common.ForbiddenException('Database not found or you do not have access');
        }
        // Đếm số data hiện tại trong collection
        const currentCount = await this.dynamicDataModel.countDocuments({
            databaseId: databaseId,
            _collection: collectionName
        }).exec();
        // Kiểm tra nếu thêm bulk data có vượt giới hạn không
        const newTotal = currentCount + dataArray.length;
        if (newTotal > tierLimits.maxDataPerCollection) {
            throw new _common.ForbiddenException(`Cannot create ${dataArray.length} items. Current: ${currentCount}, Limit: ${tierLimits.maxDataPerCollection} for your ${user.tier} tier. You can add maximum ${tierLimits.maxDataPerCollection - currentCount} more items.`);
        }
    }
    /**
   * Kiểm tra giới hạn replace-all
   */ async checkReplaceAllLimit(user, tierLimits, request) {
        // Nếu unlimited thì bỏ qua
        if (this.tierConfigService.isUnlimited(tierLimits.maxDataPerCollection)) {
            return;
        }
        const databaseId = request.params.databaseId;
        const collectionName = request.params.collectionName;
        const dataArray = request.body;
        if (!Array.isArray(dataArray)) {
            throw new _common.BadRequestException('Body must be an array');
        }
        // Validate ObjectId format
        if (!_mongoose1.Types.ObjectId.isValid(databaseId)) {
            throw new _common.BadRequestException(`Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`);
        }
        // Kiểm tra database có thuộc về user không
        const database = await this.databaseModel.findOne({
            _id: databaseId,
            userId: user._id
        }).exec();
        if (!database) {
            throw new _common.ForbiddenException('Database not found or you do not have access');
        }
        // Kiểm tra số lượng data mới có vượt giới hạn không
        if (dataArray.length > tierLimits.maxDataPerCollection) {
            throw new _common.ForbiddenException(`Cannot replace with ${dataArray.length} items. Maximum data per collection is ${tierLimits.maxDataPerCollection} for your ${user.tier} tier.`);
        }
    }
    constructor(userModel, databaseModel, dynamicDataModel, tierConfigService){
        this.userModel = userModel;
        this.databaseModel = databaseModel;
        this.dynamicDataModel = dynamicDataModel;
        this.tierConfigService = tierConfigService;
    }
};
TierLimitsGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_userschema.User.name)),
    _ts_param(1, (0, _mongoose.InjectModel)(_databaseschema.Database.name)),
    _ts_param(2, (0, _mongoose.InjectModel)(_dynamicdataschema.DynamicData.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _tierconfigservice.TierConfigService === "undefined" ? Object : _tierconfigservice.TierConfigService
    ])
], TierLimitsGuard);

//# sourceMappingURL=tier-limits.guard.js.map