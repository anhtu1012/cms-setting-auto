"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TierService", {
    enumerable: true,
    get: function() {
        return TierService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _userschema = require("../../modules/users/schemas/user.schema");
const _databaseschema = require("../../modules/dynamic-cms/schemas/database.schema");
const _dynamicdataschema = require("../../modules/dynamic-cms/schemas/dynamic-data.schema");
const _tierconfigservice = require("./tier-config.service");
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
let TierService = class TierService {
    /**
   * Lấy thông tin tier và usage của user
   */ async getUserTierInfo(userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }
        const tierLimits = await this.tierConfigService.getTierLimits(user.tier);
        const databaseCount = await this.databaseModel.countDocuments({
            userId: user._id,
            isActive: true
        }).exec();
        return {
            tier: user.tier,
            limits: tierLimits,
            usage: {
                databases: databaseCount,
                apiCallsToday: user.apiCallsToday || 0
            }
        };
    }
    /**
   * Kiểm tra xem user có thể tạo database mới không
   */ async canCreateDatabase(userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            return {
                allowed: false,
                reason: 'User not found',
                current: 0,
                limit: 0
            };
        }
        const tierLimits = await this.tierConfigService.getTierLimits(user.tier);
        // Nếu unlimited
        if (this.tierConfigService.isUnlimited(tierLimits.maxDatabases)) {
            return {
                allowed: true,
                current: -1,
                limit: -1
            };
        }
        const currentCount = await this.databaseModel.countDocuments({
            userId: user._id,
            isActive: true
        }).exec();
        const allowed = currentCount < tierLimits.maxDatabases;
        return {
            allowed,
            reason: allowed ? undefined : `Maximum databases reached (${tierLimits.maxDatabases}) for ${user.tier} tier`,
            current: currentCount,
            limit: tierLimits.maxDatabases
        };
    }
    /**
   * Kiểm tra xem user có thể tạo data mới trong collection không
   */ async canCreateData(userId, databaseId, collectionName) {
        // Validate ObjectId format
        if (!_mongoose1.Types.ObjectId.isValid(databaseId)) {
            throw new _common.BadRequestException(`Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`);
        }
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            return {
                allowed: false,
                reason: 'User not found',
                current: 0,
                limit: 0
            };
        }
        const tierLimits = await this.tierConfigService.getTierLimits(user.tier);
        // Nếu unlimited
        if (this.tierConfigService.isUnlimited(tierLimits.maxDataPerCollection)) {
            return {
                allowed: true,
                current: -1,
                limit: -1
            };
        }
        // Kiểm tra database có thuộc về user không
        const database = await this.databaseModel.findOne({
            _id: databaseId,
            userId: user._id
        }).exec();
        if (!database) {
            return {
                allowed: false,
                reason: 'Database not found or access denied',
                current: 0,
                limit: tierLimits.maxDataPerCollection
            };
        }
        // Đếm số data hiện tại
        const currentCount = await this.dynamicDataModel.countDocuments({
            databaseId: databaseId,
            _collection: collectionName
        }).exec();
        const allowed = currentCount < tierLimits.maxDataPerCollection;
        return {
            allowed,
            reason: allowed ? undefined : `Maximum data per collection reached (${tierLimits.maxDataPerCollection}) for ${user.tier} tier`,
            current: currentCount,
            limit: tierLimits.maxDataPerCollection
        };
    }
    /**
   * Nâng cấp tier cho user
   */ async upgradeTier(userId, newTier, reason) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }
        // Kiểm tra tier mới có tồn tại không
        await this.tierConfigService.getTierByCode(newTier);
        // Lưu lịch sử
        if (user.tier !== newTier) {
            user.tierHistory.push({
                tier: user.tier,
                startDate: user.tierStartDate || // createdAt may not be present on the typed document, fall back to cast or ObjectId timestamp
                (user.createdAt ?? user._id.getTimestamp()),
                endDate: new Date(),
                upgradeReason: reason
            });
        }
        user.tier = newTier;
        user.tierStartDate = new Date();
        // Set expiry date (1 năm cho các tier trả phí)
        if (newTier !== 'free') {
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            user.tierExpiryDate = expiryDate;
        }
        return await user.save();
    }
    /**
   * Lấy thống kê sử dụng data của TẤT CẢ databases của user
   */ async getAllDataUsage(userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }
        // Lấy tất cả databases của user
        const databases = await this.databaseModel.find({
            userId: new _mongoose1.Types.ObjectId(userId)
        }).exec();
        const result = [];
        for (const db of databases){
            // Đếm data theo collection cho từng database
            const collections = await this.dynamicDataModel.aggregate([
                {
                    $match: {
                        databaseId: db._id.toString()
                    }
                },
                {
                    $group: {
                        _id: '$_collection',
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        count: -1
                    }
                }
            ]).exec();
            const totalData = collections.reduce((sum, col)=>sum + col.count, 0);
            result.push({
                databaseId: db._id.toString(),
                databaseName: db.name,
                totalCollections: collections.length,
                totalData: totalData,
                collections: collections.map((col)=>({
                        collection: col._id,
                        count: col.count
                    }))
            });
        }
        return result;
    }
    /**
   * Lấy thống kê sử dụng data của user theo collection
   */ async getDataUsageByCollection(userId, databaseId) {
        // Validate ObjectId format
        if (!_mongoose1.Types.ObjectId.isValid(databaseId)) {
            throw new _common.BadRequestException(`Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`);
        }
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }
        // Kiểm tra database có thuộc về user không
        const database = await this.databaseModel.findOne({
            _id: new _mongoose1.Types.ObjectId(databaseId),
            userId: new _mongoose1.Types.ObjectId(userId)
        }).exec();
        if (!database) {
            throw new _common.ForbiddenException(`Database not found or you don't have permission to access it`);
        }
        const tierLimits = await this.tierConfigService.getTierLimits(user.tier);
        // Lấy danh sách collections và đếm data
        const collections = await this.dynamicDataModel.aggregate([
            {
                $match: {
                    databaseId: databaseId
                }
            },
            {
                $group: {
                    _id: '$_collection',
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]).exec();
        return collections.map((col)=>{
            const limit = tierLimits.maxDataPerCollection;
            const percentage = this.tierConfigService.isUnlimited(limit) ? 0 : col.count / limit * 100;
            return {
                collection: col._id,
                count: col.count,
                limit: limit,
                percentage: Math.round(percentage * 100) / 100
            };
        });
    }
    /**
   * Reset API call counter (chạy hàng ngày)
   */ async resetDailyApiCalls() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await this.userModel.updateMany({
            $or: [
                {
                    lastApiCallReset: {
                        $lt: today
                    }
                },
                {
                    lastApiCallReset: null
                }
            ]
        }, {
            $set: {
                apiCallsToday: 0,
                lastApiCallReset: new Date()
            }
        }).exec();
    }
    /**
   * Tăng API call counter
   */ async incrementApiCalls(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            $inc: {
                apiCallsToday: 1
            }
        }).exec();
    }
    constructor(userModel, databaseModel, dynamicDataModel, tierConfigService){
        this.userModel = userModel;
        this.databaseModel = databaseModel;
        this.dynamicDataModel = dynamicDataModel;
        this.tierConfigService = tierConfigService;
    }
};
TierService = _ts_decorate([
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
], TierService);

//# sourceMappingURL=tier.service.js.map